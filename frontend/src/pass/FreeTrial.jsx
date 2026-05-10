import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/FreeTrial.css";

const FreeTrial = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ⭐ If navigated from a plan page with state, pre-select that plan */
  const preselectedPlan = location.state?.plan || "Basic";

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    plan: preselectedPlan,
    goal: ""
  });

  const [submitted,     setSubmitted]     = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [checking,      setChecking]      = useState(true);
  const [existingTrial, setExistingTrial] = useState(null);

  /* ⭐ Check if this user already used their free trial */
  useEffect(() => {
    const checkTrial = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setChecking(false); return; }
      try {
        const res  = await fetch("/api/auth/trial/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.hasTrial) {
          setExistingTrial({ plan: data.plan, expiresAt: data.expiresAt });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    checkTrial();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res  = await fetch("/api/auth/trial/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) { setSubmitted(true); }
      else         { alert(data.message || "Something went wrong."); }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: "🏋️", title: "Full Gym Access",   desc: "Use all equipment & floors free for 7 days" },
    { icon: "🧘",  title: "Group Classes",      desc: "Join Yoga, Zumba & HIIT sessions" },
    { icon: "📱",  title: "App Access",         desc: "Track workouts & book classes on mobile" },
    { icon: "🥗",  title: "Diet Guidance",      desc: "Get a starter diet tip from our experts" },
    { icon: "🔒",  title: "No Credit Card",     desc: "Zero payment needed to start your trial" },
    { icon: "⚡",  title: "Instant Activation", desc: "Start the same day you sign up" },
  ];

  const allPlans = [
    { value: "Basic",        label: "Basic — ₹699/mo after trial" },
    { value: "Pro",          label: "Pro — ₹1199/mo after trial" },
    { value: "Elite",        label: "Elite — ₹1865/mo after trial" },
    { value: "Unlimited",    label: "Unlimited — ₹2699/mo after trial" },
    { value: "Home Workout", label: "Home Workout — ₹499/mo after trial" },
  ];

  /* ── CHECKING ── */
  if (checking) return (
    <div><Navbar showMenu showIcons dark />
      <div className="ft-checking"><p>Checking your trial status...</p></div>
    <Footer /></div>
  );

  /* ── ALREADY HAS A TRIAL ── */
  if (existingTrial) {
    const expiry = new Date(existingTrial.expiresAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });
    return (
      <div><Navbar showMenu showIcons dark />
        <div className="ft-success">
          <div className="ft-success-box">
            <div className="ft-success-icon">🎟️</div>
            <h1>Trial <span>Already Active</span></h1>
            <p>You have an active free trial for</p>
            <div className="ft-trial-plan-badge">{existingTrial.plan}</div>
            <p className="ft-success-sub">Valid until <strong>{expiry}</strong></p>
            <p className="ft-success-sub" style={{ color: "#ff6b00" }}>
              Only one free trial is allowed per account.
            </p>
            <div className="ft-success-actions">
              <button className="ft-btn-primary" onClick={() => navigate("/")}>Go to Home</button>
              <button className="ft-btn-ghost"   onClick={() => navigate("/membership-payment")}>Buy a Plan</button>
            </div>
          </div>
        </div>
      <Footer /></div>
    );
  }

  /* ── SUCCESS ── */
  if (submitted) return (
    <div><Navbar showMenu showIcons dark />
      <div className="ft-success">
        <div className="ft-success-box">
          <div className="ft-success-icon">💪</div>
          <h1>You're In, <span>{form.name.split(" ")[0]}!</span></h1>
          <p>Your 7-day free trial for</p>
          <div className="ft-trial-plan-badge">{form.plan}</div>
          <p>is now active.</p>
          <p className="ft-success-sub">
            Check <strong>{form.email}</strong> for your access details.
          </p>
          <p className="ft-success-sub" style={{ color: "#ff6b00" }}>
            One free trial per account — this was yours!
          </p>
          <div className="ft-success-actions">
            <button className="ft-btn-primary" onClick={() => navigate("/")}>Go to Home</button>
            <button className="ft-btn-ghost"   onClick={() => navigate("/basic")}>Explore Plans</button>
          </div>
        </div>
      </div>
    <Footer /></div>
  );

  /* ── MAIN FORM ── */
  return (
    <div>
      <Navbar showMenu showIcons dark />
      <div className="ft-page">

        {/* HERO */}
        <div className="ft-hero">
          <div className="ft-hero-bg" />
          <div className="ft-hero-content">
            <p className="ft-eyebrow">NO COMMITMENT · NO CREDIT CARD</p>
            <h1>7 Days. <span>Free.</span><br />No Excuses.</h1>
            <p className="ft-hero-sub">
              Try ShuklaPass free for a full week — gym, classes, app, everything.
              If you love it, pick a plan. If not, walk away. Simple.
            </p>
            <div className="ft-hero-cta">
              <a href="#trial-form" className="ft-btn-primary">Claim Free Trial</a>
            </div>
          </div>
        </div>

        {/* PERKS */}
        <div className="ft-perks">
          <h2>What You Get — <span>Free</span></h2>
          <div className="ft-perks-grid">
            {perks.map((p, i) => (
              <div className="ft-perk-card" key={i}>
                <div className="ft-perk-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="ft-form-section" id="trial-form">

          <div className="ft-form-left">
            <p className="ft-eyebrow">START TODAY</p>
            <h2>Claim Your<br /><span>Free Trial</span></h2>
            <p className="ft-form-sub">
              Fill in your details and we'll activate your 7-day pass instantly.
              No hidden charges. Cancel anytime.
            </p>
            <div className="ft-trust">
              <div className="ft-trust-item">✔ 7 days full access</div>
              <div className="ft-trust-item">✔ Zero payment required</div>
              <div className="ft-trust-item">✔ Cancel anytime</div>
              <div className="ft-trust-item">✔ Instant activation</div>
              <div className="ft-trust-item">✔ One trial per account only</div>
            </div>
          </div>

          <div className="ft-form-right">
            <form className="ft-form" onSubmit={handleSubmit}>

              <div className="ft-field">
                <label>Full Name *</label>
                <input type="text" name="name" placeholder="Prabhat Shukla"
                  value={form.name} onChange={handleChange} required />
              </div>

              <div className="ft-field">
                <label>Email Address *</label>
                <input type="email" name="email" placeholder="prabhat6780@email.com"
                  value={form.email} onChange={handleChange} required />
              </div>

              <div className="ft-field">
                <label>Phone Number *</label>
                <input type="tel" name="phone" placeholder="+91 9924188433"
                  value={form.phone} onChange={handleChange} required />
              </div>

              <div className="ft-field">
                <label>Which Plan to Trial?</label>
                <select name="plan" value={form.plan} onChange={handleChange}>
                  {allPlans.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <p className="ft-field-note">
                  ⚠ You can only activate a free trial once. Choose carefully.
                </p>
              </div>

              <div className="ft-field">
                <label>Your Fitness Goal</label>
                <select name="goal" value={form.goal} onChange={handleChange}>
                  <option value="">Select a goal</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Weight Gain">Weight Gain</option>
                </select>
              </div>

              <button type="submit" className="ft-submit-btn" disabled={loading}>
                {loading ? "Activating..." : "Start My Free Trial 🚀"}
              </button>

              <p className="ft-form-note">
                By submitting you agree to our Terms. No payment collected during trial.
                One free trial per account only.
              </p>

            </form>
          </div>
        </div>

        <div className="ft-bottom-strip">
          <p>
            Already a member?{" "}
            <span onClick={() => navigate("/membership-payment")}
              style={{ color: "#ff6b00", cursor: "pointer" }}>
              Buy a plan directly →
            </span>
          </p>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default FreeTrial;
