import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "llama-3.3-70b-versatile";
const GROQ_KEY     = import.meta.env.VITE_GROQ_API_KEY || "";
console.log("GROQ KEY LOADED:", GROQ_KEY ? "YES ✓" : "NO ✗ — check .env");

const buildSystemPrompt = (plan) => `

You are BAUNA — elite AI fitness coach.

USER CURRENT FULL PLAN (STRICT REFERENCE):
${plan?.plan || ""}

USER STATS:
- BMI: ${plan?.bmi}
- Maintenance Calories: ${plan?.maintenanceCalories}
- Target Calories: ${plan?.targetCalories}
- Body Fat: ${plan?.bodyFat}%
- Workout Goal: ${plan?.workoutSuggestion}
- Diet Type: ${plan?.dietSuggestion}

═══════════════════════════════
MASTER STRUCTURE RULES (ABSOLUTE)
═══════════════════════════════

- Plan contains MULTIPLE WEEKS.
- NEVER change number of weeks.
- NEVER add weeks.
- NEVER remove weeks.
- NEVER merge weeks.
- NEVER skip any week.

Each week MUST ALWAYS contain:

1) Diet Table (7 days)
2) Workout Table (7 days)
3) Health Tips Table (5 tips)

Health Tips MUST NEVER be removed.

All weeks must remain in SAME ORDER.

═══════════════════════════════
DIET TABLE STRUCTURE (LOCKED)
═══════════════════════════════

Diet table columns MUST ALWAYS be:

Day | Breakfast | Lunch | Snack | Dinner | Calories/Day | Protein/Day

Rules:

- Calories/Day column is COMPULSORY
- Protein/Day column is COMPULSORY
- These MUST be LAST TWO columns
- Every meal MUST show:

(food name (XXX kcal, XXg protein))

- Daily totals MUST match meal sum
- Do NOT remove totals column
- Do NOT merge totals inside meals

Diet type restriction MUST continue:

If Vegetarian → NEVER add chicken / egg / fish / meat.

═══════════════════════════════
WORKOUT STRUCTURE RULES
═══════════════════════════════

Each week must contain intensity progression:

Low  
Low-Moderate  
Moderate  
Moderate-High  
High  
Recovery  
Rest  

Workout table columns:

Day | Exercise | Intensity | Duration | Timing

═══════════════════════════════
MODE 1 — Q&A
═══════════════════════════════

If user asks question → answer briefly.
DO NOT regenerate plan.

═══════════════════════════════
MODE 2 — GLOBAL PLAN MODIFICATION
═══════════════════════════════

When user asks ANY change:

- Apply change to ALL days of ALL weeks.
- NEVER update partial plan.
- NEVER update only visible week.
- NEVER change number of weeks.
- NEVER remove tips.
- NEVER change table structure.

Examples:

Increase protein →
→ Increase protein in EVERY meal
→ Increase Protein/Day totals
→ Apply to ALL weeks

Reduce calories →
→ Reduce meal calories
→ Update totals for ALL days

Make workout intense →
→ Adjust progression for ALL weeks



VERY IMPORTANT:

Return COMPLETE updated FULL plan ONLY inside:

\`\`\`plan
FULL MULTI WEEK PLAN
\`\`\`

Then explain:

✅ What changed  
💡 Why better  
🔥 One motivation line  

Personality: intense, motivating, short.

`.trim()

const Dots = () => (
  <span style={{ display: "inline-flex", gap: 4, alignItems: "center", padding: "3px 0" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{
        width: 7, height: 7, borderRadius: "50%", background: "#ff3c00",
        display: "inline-block",
        animation: `im-bounce 1s ease-in-out ${i * 0.18}s infinite`,
      }} />
    ))}
  </span>
);

// ⭐ extracts markdown plan from ```plan ... ``` blocks
function extractPlan(text) {
  const match = text.match(/```plan\s*([\s\S]*?)```/);
  if (!match) return null;
  return match[1].trim();
}

// ⭐ removes the ```plan block from display text
function cleanDisplay(text) {
  return text.replace(/```plan[\s\S]*?```/g, "").trim();
}

const markdownStyles = `
  .im-md p { margin: 3px 0; font-size: 13.5px; color: #dedede; line-height: 1.7; }
  .im-md h1, .im-md h2, .im-md h3 {
    color: #ff3c00; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.04em; margin: 12px 0 5px; font-size: 12.5px;
  }
  .im-md strong { color: #fff; font-weight: 700; }
  .im-md em { font-style: italic; color: #aaa; }
  .im-md hr { border: none; border-top: 1px solid #333; margin: 8px 0; }
  .im-md ul, .im-md ol { margin: 4px 0 4px 16px; }
  .im-md li { font-size: 13.5px; color: #dedede; line-height: 1.7; margin-bottom: 2px; }
  .im-md li::marker { color: #ff3c00; font-weight: 700; }
  .im-md blockquote { border-left: 3px solid #ff3c00; margin: 6px 0; padding: 4px 10px; background: #1a1a1a; border-radius: 0 6px 6px 0; }
  .im-md blockquote p { margin: 0; font-size: 13px; color: #aaa; }
  .im-md table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12.5px; }
  .im-md th { background: #ff3c00; color: #fff; padding: 8px 11px; text-align: left; font-weight: 600; font-size: 12px; white-space: nowrap; }
  .im-md td { padding: 7px 11px; border-bottom: 1px solid #2a2a2a; color: #dedede; background: #1e1e1e; }
  .im-md tr:nth-child(even) td { background: #222; }
  .im-md tr:hover td { background: #2a1500; transition: 0.2s; }
  .im-md code { background: #1a1a1a; border-radius: 4px; padding: 1px 5px; font-size: 12px; color: #ff7040; border: 1px solid #333; }
  .im-md pre { display: none; }
  .im-md-update p, .im-md-update li { color: #7fd97f; }
  .im-md-update td { color: #7fd97f; background: #0a1a0a; }
  .im-md-update tr:nth-child(even) td { background: #0d1f0d; }
  .im-md-update strong { color: #a0f0a0; }
`;

const BotMessage = ({ content, updated }) => (
  <div style={{
    alignSelf: "flex-start",
    background: updated ? "#0a1a0a" : "#181818",
    border: updated ? "1px solid #1a3a1a" : "1px solid #252525",
    padding: "11px 14px",
    borderRadius: "14px 14px 14px 3px",
    maxWidth: "92%",
  }}>
    <div className={updated ? "im-md im-md-update" : "im-md"}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  </div>
);

export default function FitnessChatWidget({ plan, onPlanUpdate }) {
  const [open, setOpen]         = useState(false);
  const [unread, setUnread]     = useState(1);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "BAUNA online. 🔥 Your plan is loaded — ask me anything or tell me what to change." },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 120); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
       body: JSON.stringify({
  model: GROQ_MODEL,
  messages: [
    { role: "system", content: buildSystemPrompt(plan) },
    ...next.map((m) => ({ role: m.role, content: m.content })),
  ],
  max_tokens: 8000,
  temperature: 0.6,
  top_p: 0.9,
}),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("GROQ RESPONSE →", data);

const raw = data.choices?.[0]?.message?.content || "No response.";
console.log("RAW →", raw);

const updatedPlanText = extractPlan(raw);
if (updatedPlanText && onPlanUpdate) {
  console.log("PLAN TEXT UPDATED →", updatedPlanText);
  // ⭐ pass back full state with updated plan string
  onPlanUpdate({ ...plan, plan: updatedPlanText });
}

const display = cleanDisplay(raw);
setMessages((prev) => [...prev, {
  role: "assistant",
  content: display || "✅ Plan updated!",
  updated: !!updatedPlanText
}]);

    } catch (e) {
      console.error("GROQ ERROR →", e);
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}`, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const QUICK = [
    "Explain my macros in detail",
    "Change my whole workout plan",
    "Give me a new diet plan",
    "Make my plan more intense",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap');
        @keyframes im-bounce   { 0%,80%,100%{transform:scale(0.55);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes im-slideup  { from{opacity:0;transform:translateY(14px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes im-pulse    { 0%{box-shadow:0 0 0 0 rgba(255,60,0,0.65),0 8px 28px rgba(255,60,0,0.4)} 70%{box-shadow:0 0 0 13px rgba(255,60,0,0),0 8px 28px rgba(255,60,0,0.4)} 100%{box-shadow:0 0 0 0 rgba(255,60,0,0),0 8px 28px rgba(255,60,0,0.4)} }
        @keyframes im-fadein   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .im-bubble            { animation: im-pulse 2.2s ease-out infinite; transition: transform 0.18s; }
        .im-bubble:hover      { transform: scale(1.08) !important; }
        .im-win               { animation: im-slideup 0.26s cubic-bezier(0.16,1,0.3,1); }
        .im-msg               { animation: im-fadein 0.2s ease; }
        .im-inp:focus         { border-color: #ff3c00 !important; }
        .im-send:not(:disabled):hover { opacity:0.85; transform:scale(0.95); }
        .im-close:hover       { color: #ff3c00 !important; }
        .im-qb:hover          { border-color:#ff3c00 !important; color:#ff3c00 !important; }
        .im-msgs::-webkit-scrollbar       { width: 3px; }
        .im-msgs::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        ${markdownStyles}
      `}</style>

      <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, fontFamily:"'Barlow', sans-serif" }}>

        {open && (
          <div className="im-win" style={{
            position:"absolute", bottom:76, right:0,
            width:370, height:560,
            background:"#0d0d0d", border:"1px solid #252525",
            borderRadius:"16px 16px 4px 16px",
            boxShadow:"0 24px 80px rgba(0,0,0,0.9)",
            display:"flex", flexDirection:"column", overflow:"hidden",
          }}>

            {/* Header */}
            <div style={{ background:"#111", borderBottom:"1px solid #1f1f1f", padding:"13px 16px", display:"flex", alignItems:"center", gap:11, flexShrink:0 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#ff3c00,#880000)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, boxShadow:"0 0 14px rgba(255,60,0,0.45)" }}>💪</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, letterSpacing:"0.1em", color:"#ff3c00", lineHeight:1 }}>BAUNA</div>
                <div style={{ fontSize:10, color:"#555", marginTop:2, fontWeight:600, letterSpacing:"0.07em" }}>POWERED BY SHUKLA FITNESS · </div>
              </div>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 7px #22c55e" }} />
              <button className="im-close" onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#444", cursor:"pointer", fontSize:19, lineHeight:1, padding:"2px 4px", marginLeft:6 }}>✕</button>
            </div>

            {/* Plan banner */}
            <div style={{ background: plan ? "#0f0800" : "#0a0a0a", borderBottom:"1px solid #1f1500", padding:"7px 14px", display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
              <span style={{ fontSize:12 }}>{plan ? "📋" : "⚠️"}</span>
              <span style={{ fontSize:11, color: plan ? "#ff7040" : "#666", fontWeight:600, letterSpacing:"0.04em" }}>
                {plan ? "PLAN LOADED — Ask anything or request changes" : "No plan loaded — pass your plan as a prop"}
              </span>
            </div>

            {/* Messages */}
            <div className="im-msgs" style={{ flex:1, overflowY:"auto", padding:"14px 13px", display:"flex", flexDirection:"column", gap:10 }}>
              {messages.map((m, i) => (
                m.role === "user" ? (
                  <div key={i} className="im-msg" style={{
                    alignSelf:"flex-end",
                    background:"linear-gradient(135deg,#ff3c00,#cc2200)",
                    color:"#fff", padding:"10px 14px",
                    borderRadius:"14px 14px 3px 14px",
                    maxWidth:"82%", fontSize:13.5, lineHeight:1.55, fontWeight:500,
                    boxShadow:"0 4px 16px rgba(255,60,0,0.25)",
                  }}>
                    {m.content}
                  </div>
                ) : m.error ? (
                  <div key={i} className="im-msg" style={{
                    alignSelf:"flex-start",
                    background:"#1a0a0a", border:"1px solid #3a1a1a",
                    color:"#ff7070", padding:"10px 14px",
                    borderRadius:"14px 14px 14px 3px",
                    maxWidth:"92%", fontSize:12.5, lineHeight:1.5,
                  }}>
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="im-msg">
                    <BotMessage content={m.content} updated={m.updated} />
                  </div>
                )
              ))}
              {loading && (
                <div style={{ alignSelf:"flex-start", background:"#181818", border:"1px solid #252525", padding:"11px 14px", borderRadius:"14px 14px 14px 3px" }}>
                  <Dots />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.filter(m => m.role === "user").length === 0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, padding:"8px 13px 0", flexShrink:0 }}>
                {QUICK.map((q) => (
                  <button key={q} className="im-qb"
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    style={{ background:"#181818", border:"1px solid #2a2a2a", borderRadius:20, color:"#666", fontSize:11, padding:"5px 11px", cursor:"pointer", fontFamily:"'Barlow', sans-serif", fontWeight:600, transition:"all 0.15s" }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ display:"flex", gap:8, padding:"10px 13px 13px", background:"#111", borderTop:"1px solid #1f1f1f", marginTop:8, flexShrink:0 }}>
              <input ref={inputRef} className="im-inp"
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Ask about your plan or request changes..."
                disabled={loading}
                style={{ flex:1, background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:10, color:"#e0e0e0", fontSize:13, padding:"10px 13px", outline:"none", fontFamily:"'Barlow', sans-serif", height:42, transition:"border-color 0.2s" }}
              />
              <button className="im-send" onClick={send} disabled={loading || !input.trim()}
                style={{ width:42, height:42, borderRadius:10, border:"none", cursor: loading||!input.trim() ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.18s", background: loading||!input.trim() ? "#1e1e1e" : "linear-gradient(135deg,#ff3c00,#cc2200)", boxShadow: !loading&&input.trim() ? "0 4px 14px rgba(255,60,0,0.3)" : "none" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke={loading||!input.trim() ? "#444" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Floating bubble */}
        <div className="im-bubble" onClick={() => setOpen((o) => !o)}
          style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#ff3c00,#bb2200)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", userSelect:"none" }}>
          <span style={{ fontSize: open ? 22 : 26 }}>{open ? "✕" : "🔥"}</span>
          {!open && unread > 0 && (
            <div style={{ position:"absolute", top:1, right:1, width:18, height:18, background:"#ff3c00", border:"2px solid #111", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700 }}>
              {unread}
            </div>
          )}
        </div>
      </div>
    </>
  );
}