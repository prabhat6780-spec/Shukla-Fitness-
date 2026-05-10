import { useNavigate, useLocation } from "react-router-dom"
import { useState, useRef, useMemo } from "react"
import FitnessChatWidget from "../components/FitnessChatWidget "
import "../css/AIResult.css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

function AIResult() {

  const nav = useNavigate()
  const { state } = useLocation()

  const [plan, setPlan] = useState(state)
  const [isBaunaPlan, setIsBaunaPlan] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const planRef = useRef(null)

  // ⭐ get plan text
  const getPlanText = () => {
    if (!isBaunaPlan) return state?.plan || ""
    if (typeof plan === "string") return plan
    if (plan?.plan) return plan.plan
    return ""
  }

  const planText = getPlanText()

  // ⭐ FULL WEEK BLOCK PARSER (IMPORTANT)
const pages = useMemo(() => {

  if (!planText) return []

  const lines = planText.split("\n")

  const result = []
  let currentBlock = ""
  let currentWeekNumber = null

  lines.forEach(line => {

    const match = line.match(/Week\s*(\d+)/i)

    if (match) {

      const weekNum = match[1]

      // ⭐ if new week number starts → push previous block
      if (currentWeekNumber && weekNum !== currentWeekNumber) {
        result.push(currentBlock)
        currentBlock = ""
      }

      currentWeekNumber = weekNum
    }

    currentBlock += line + "\n"

  })

  // push last block
  if (currentBlock) result.push(currentBlock)

  return result

}, [planText])

  // ⭐ navigation
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1)
      planRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
      planRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // ⭐ update from chat
  const handlePlanUpdate = (updatedPlan) => {
    setPlan(updatedPlan)
    setIsBaunaPlan(true)
    setCurrentPage(0)
  }

  // ⭐ PDF
  const downloadPDF = async () => {
    const input = document.getElementById("ai-plan-pdf")
    const canvas = await html2canvas(input, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = canvas.height * imgWidth / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save("AI_Fitness_Plan.pdf")
  }

  if (!state) {
    return (
      <div className="ai-page2">
        <h2 style={{ color: "white", textAlign: "center", marginTop: "150px" }}>
          No AI Plan Generated Yet
        </h2>
      </div>
    )
  }

  return (
    <div className="ai-page2">

      <img src="/photos/Logo2.png" className="ai-logo2" alt="logo" />

      <div className="ai-result-card">

        <h1 className="ai-title2">
          Your <span>AI Fitness Plan</span>
        </h1>

        {/* ⭐ STATS */}
        <div className="ai-stats">
          <div className="stat-box">
            <h3>BMI</h3>
            <p>{state.bmi}</p>
          </div>

          <div className="stat-box">
            <h3>Maintenance Calories</h3>
            <p>{state.maintenanceCalories}</p>
          </div>

          <div className="stat-box">
            <h3>Target Calories</h3>
            <p>{state.targetCalories}</p>
          </div>

          <div className="stat-box">
            <h3>Body Fat</h3>
            <p>{state.bodyFat}%</p>
          </div>
        </div>

        {/* ⭐ PLAN PAGE */}
        <div className="plan-box" id="ai-plan-pdf" ref={planRef}>

          <h2 className="plan-main-title">
            Week {pages.length === 0 ? 0 : currentPage + 1}
          </h2>

          <div className="plan-content">
            {pages.length > 0 ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {pages[currentPage]}
              </ReactMarkdown>
            ) : (
              <p style={{ color: "#ff3c00", textAlign: "center" }}>
                Generating Plan...
              </p>
            )}
          </div>

          {/* ⭐ SLIDER BELOW FULL PLAN */}
          {pages.length > 1 && (
            <div className="week-slider-bottom">
              <button onClick={prevPage} className="week-btn">&lt;</button>
              <span className="week-count">
                {currentPage + 1} / {pages.length}
              </span>
              <button onClick={nextPage} className="week-btn">&gt;</button>
            </div>
          )}

        </div>

        {/* ⭐ BUTTONS */}
        <div className="btn-row">
          <button className="ai-btn2" onClick={() => nav("/aiform")}>
            Back
          </button>

          <button className="ai-btn" onClick={()=>
          nav("/exercise", {state:plan})}
          style={{
            background:"#ff6b00",
            fontSize:"17px",
            fontWeight:"800",
            letterSpacing:"1px",
            boxShadow:"0 8px 25px rgba(255,107,0,0.45)",
            border:"none"
          }}>
          Start Training
          </button>

          <button className="ai-btn2" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>

      </div>

      <img src="/photos/aiformleft.png" className="ai-right-img2" alt="gym" />

      <FitnessChatWidget plan={plan} onPlanUpdate={handlePlanUpdate} />

    </div>
  )
}

export default AIResult