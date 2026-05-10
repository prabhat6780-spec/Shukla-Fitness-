// pages/Exercise.jsx
import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import API from "../api"
import ExerciseCard from "../components/ExerciseCard"
import Navbar from "../components/Navbar"
import "../css/Exercise.css"

const Exercise = () => {
  const { state } = useLocation()
  const nav = useNavigate()

  const [exerciseMap, setExerciseMap] = useState({})
  const [currentWeek, setCurrentWeek] = useState(0)
  const [currentDay, setCurrentDay] = useState(0)
  const [loading, setLoading] = useState(true)

  // ✅ Get plan text
  const planText = useMemo(() => {
    if (!state) return ""
    if (typeof state === "string") return state
    if (state?.plan) return state.plan
    return ""
  }, [state])

  // ✅ Split into weeks
  const weeks = useMemo(() => {
    if (!planText) return []
    const lines = planText.split("\n")
    const result = []
    let currentBlock = []
    let currentWeekNum = null

    lines.forEach(line => {
      const match = line.match(/Week\s*(\d+)/i)
      if (match) {
        const weekNum = match[1]
        if (currentWeekNum && weekNum !== currentWeekNum) {
          result.push(currentBlock)
          currentBlock = []
        }
        currentWeekNum = weekNum
      }
      currentBlock.push(line)
    })

    if (currentBlock.length > 0) result.push(currentBlock)
    return result
  }, [planText])

  // ✅ Parse days from current week only
  const days = useMemo(() => {
    const weekLines = weeks[currentWeek] || []
    const result = []
    let inWorkoutTable = false

    weekLines.forEach(line => {
      const lower = line.toLowerCase()

      if (lower.includes("workout") && lower.includes("table")) {
        inWorkoutTable = true
        return
      }

      if (inWorkoutTable && (
        lower.includes("diet table") ||
        lower.includes("health tips")
      )) {
        inWorkoutTable = false
        return
      }

      if (inWorkoutTable) {
        const cols = line.split("|").map(c => c.trim()).filter(Boolean)

        if (
          cols.length >= 3 &&
          !cols[0]?.toLowerCase().includes("day") &&
          !cols[0]?.includes("---") &&
          cols[1]
        ) {
          const dayName = cols[0]
          const intensity = cols[2] || ""
          const duration = cols[3] || ""

             const exerciseName = cols[1]
          .split(",")
          .map(n => n.trim())
          .filter(Boolean)

          const existing = result.find(d =>
            d.day.toLowerCase() === dayName.toLowerCase()
          )
        exerciseName.forEach(exerciseName => {
          if (existing) {
            const alreadyExists = existing.exercises.find(
              e => e.name.toLowerCase() === exerciseName.toLowerCase()
            )
            if (!alreadyExists) {
              existing.exercises.push({ name: exerciseName, intensity, duration })
            }
          } else {
            // Only create the day once — for first exercise
            const dayEntry = result.find(d =>
              d.day.toLowerCase() === dayName.toLowerCase()
            )
            if (dayEntry) {
              dayEntry.exercises.push({ name: exerciseName, intensity, duration })
            } else {
              result.push({
                day: dayName,
                exercises: [{ name: exerciseName, intensity, duration }]
              })
            }
          }
        })
      }
    }
  })

  return result
}, [weeks, currentWeek])

  // ✅ All unique exercise names
// ✅ after
// ✅ update cleanName
const cleanName = (n) =>
  n
    .replace(/\(\d+x\d+\)/gi, "")
    .replace(/\(.*?sets.*?\)/gi, "")
    .replace(/\(.*?reps.*?\)/gi, "")
    .replace(/\s+/g, " ")   // ← collapse multiple spaces
    .trim()                  // ← trim edges

const allExerciseNames = useMemo(() => {
  const names = days.flatMap(d =>
    d.exercises.flatMap(e =>
      e.name.split(",").map(n => cleanName(n))
    )
  )
  return [...new Set(names.filter(Boolean))]
}, [days])

  // ✅ Fetch exercises
useEffect(() => {
  if (allExerciseNames.length === 0) return;

  // In fetchAll — store under BOTH cleaned name AND original
const fetchAll = async () => {
  setLoading(true)
  const map = {}

  await Promise.all(
    allExerciseNames.map(async (name) => {
      try {
        // Try 1 — full cleaned name: "Cardio (Jogging)"
        let res = await API.get(`/exercises/search?name=${encodeURIComponent(name)}`)

        // Try 2 — strip parentheses content: "Cardio"
        if (res.data.length === 0) {
          const withoutParens = name.replace(/\(.*?\)/g, "").trim()
          res = await API.get(`/exercises/search?name=${encodeURIComponent(withoutParens)}`)
        }

        // Try 3 — content inside parentheses only: "Jogging"
        if (res.data.length === 0) {
          const insideParens = (name.match(/\((.*?)\)/) || [])[1]
          if (insideParens) {
            res = await API.get(`/exercises/search?name=${encodeURIComponent(insideParens)}`)
          }
        }

        // Try 4 — first word only: "Cardio"
        if (res.data.length === 0) {
          const firstWord = name.split(" ")[0]
          res = await API.get(`/exercises/search?name=${encodeURIComponent(firstWord)}`)
        }

        if (res.data.length > 0) {
          map[name] = res.data
        } else {
          console.log("❌ NO MATCH →", name)
        }

      } catch (err) {
        console.log("Fetch failed →", name, err)
      }
    })
  )

  setExerciseMap(map)
  setLoading(false)
}

  fetchAll();
}, [allExerciseNames]);

const safeCurrentDay = days.length > 0
  ? Math.min(currentDay, days.length - 1)
  : 0;
const currentDayData = days[safeCurrentDay]

// ✅ after
const matchedExercises = (currentDayData?.exercises || [])
  .flatMap(e => {
    const key = cleanName(e.name)
    return exerciseMap[key]
      ? exerciseMap[key].map(ex => ({
          ...ex,
          intensity: e.intensity,
          duration: e.duration
        }))
      : []
  })|| []
// ✅ after
const REST_KEYWORDS = ["rest", "recovery", "light yoga", "stretching", "walk"]

const unmatchedExercises = currentDayData?.exercises
  .filter(e => {
    const key = cleanName(e.name)
    return !exerciseMap[key] &&
      !REST_KEYWORDS.some(k => e.name.toLowerCase().includes(k))
  }) || []

  if (!state) {
    return (
      <div className="xpage">
        <Navbar showMenu showIcons dark />
        <div className="xpage__empty">
          <h2>No plan found. Please generate a plan first.</h2>
          <button onClick={() => nav("/aiform")} className="xpage__back">
            Go to AI Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="xpage">
      <Navbar showMenu showIcons dark />

      <div className="xpage__content">

        {/* HEADER */}
        <div className="xpage__header">
         <h1 className="xpage__title">
  <span>START</span> <span>TRAINING</span>
</h1>
          <p className="xpage__subtitle">Follow your AI generated workout plan</p>
        </div>

        {/* WEEK SELECTOR */}
        {weeks.length > 1 && (
          <div className="xpage__week-row">
            {weeks.map((_, i) => (
              <button
                key={i}
                className={`xpage__week-btn ${currentWeek === i ? "xpage__week-btn--active" : ""}`}
                onClick={() => {
  setCurrentWeek(i);
  setCurrentDay(0);   // ✅ allowed (not inside effect)
}}
              >
                Week {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* DAY TABS */}
        <div className="xpage__tabs">
          {days.map((d, i) => (
            <button
              key={i}
              className={`xpage__tab ${safeCurrentDay === i ? "xpage__tab--active" : ""}`}
              onClick={() => setCurrentDay(i)}
            >
              {d.day}
            </button>
          ))}
        </div>

        {/* DAY HEADER */}
        {currentDayData && (
          <div className="xpage__day-header">
            <h2 className="xpage__day-title">{currentDayData.day}</h2>
            <span className="xpage__count-badge">
              {currentDayData.exercises.length} exercises
            </span>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="xpage__loading">
            <div className="xpage__spinner" />
            <p>Loading exercises...</p>
          </div>
        ) : (
          <>
            {/* MATCHED EXERCISES */}
            {matchedExercises.length > 0 && (
              <div className="xpage__grid">
                {matchedExercises.map((exercise, i) => (
                  <div key={i} className="xpage__card-wrap">
                    <div className="xpage__pills">
                      {exercise.intensity && (
                        <span className="xpage__pill xpage__pill--intensity">
                          {exercise.intensity}
                        </span>
                      )}
                      {exercise.duration && (
                        <span className="xpage__pill xpage__pill--duration">
                          {exercise.duration}
                        </span>
                      )}
                    </div>
                    <ExerciseCard key={exercise._id} exercise={exercise} />
                  </div>
                ))}
              </div>
            )}

            {/* UNMATCHED EXERCISES */}
            {unmatchedExercises.length > 0 && (
              <div className="xpage__unmatched">
                <h3 className="xpage__unmatched-title">Also in today's plan</h3>
                <div className="xpage__unmatched-list">
                  {unmatchedExercises.map((e, i) => (
                    <div key={i} className="xpage__unmatched-item">
                      <span className="xpage__unmatched-name">{e.name}</span>
                      <div className="xpage__unmatched-meta">
                        {e.intensity && (
                          <span className="xpage__pill xpage__pill--intensity">
                            {e.intensity}
                          </span>
                        )}
                        {e.duration && (
                          <span className="xpage__pill xpage__pill--duration">
                            {e.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REST DAY */}
            {matchedExercises.length === 0 && unmatchedExercises.length === 0 && (
              <div className="xpage__rest">
                <span className="xpage__rest-icon">🛌</span>
                <h3>Rest Day</h3>
                <p>Recovery is part of your training. Rest well!</p>
              </div>
            )}
          </>
        )}

        {/* DAY NAV */}
        <div className="xpage__nav">
          <button
            className="xpage__nav-btn"
            onClick={() => setCurrentDay(p => Math.max(0, p - 1))}
            disabled={safeCurrentDay === 0}
          >
            ← Prev Day
          </button>
          <span className="xpage__nav-count">
            Day {safeCurrentDay + 1} / {days.length}
          </span>
          <button
            className="xpage__nav-btn"
            onClick={() => setCurrentDay(p => Math.min(days.length - 1, p + 1))}
            disabled={safeCurrentDay === days.length - 1}
          >
            Next Day →
          </button>
        </div>

        <button className="xpage__back" onClick={() => nav(-1)}>
          ← Back to Plan
        </button>

      </div>
    </div>
  )
}

export default Exercise