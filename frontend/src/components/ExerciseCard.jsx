import { useState, useEffect, useRef } from "react";
import "../css/ExerciseCard.css";

const ExerciseCard = ({ exercise }) => {
const totalSets =
  exercise.defaultSets !== undefined
    ? Number(exercise.defaultSets)
    : 3;

const exerciseTime =
  exercise.defaultDurationSeconds !== undefined
    ? Number(exercise.defaultDurationSeconds)
    : 30;

const restTime =
  exercise.restSeconds !== undefined
    ? Number(exercise.restSeconds)
    : 60;

  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState("exercise"); // exercise | rest | done
  const [timeLeft, setTimeLeft] = useState(exerciseTime);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);

  // ⏱ TIMER LOGIC
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1) return prev - 1;

        clearInterval(intervalRef.current);

        // 🔁 PHASE SWITCH
        if (phase === "exercise") {
          if (currentSet < totalSets) {
            setPhase("rest");
            return restTime;
          }
          setPhase("done");
          setRunning(false);
          return 0;
        }

        if (phase === "rest") {
          setCurrentSet(s => s + 1);
          setPhase("exercise");
          return exerciseTime;
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, phase, currentSet, totalSets, exerciseTime, restTime]);

  // 🔄 RESET
  const reset = () => {
    clearInterval(intervalRef.current);
    setCurrentSet(1);
    setPhase("exercise");
    setTimeLeft(exerciseTime);
    setRunning(false);
  };

  // ⏱ FORMAT TIME
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  // 🔵 PROGRESS RING
  const totalTime = phase === "exercise" ? exerciseTime : restTime;
  const progress = totalTime ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (progress / 100) * circumference;

  const phaseColor =
    phase === "done"
      ? "#2d7a3a"
      : phase === "rest"
      ? "#1a73e8"
      : "#ff6b00";
const handleSkip = () => {
  clearInterval(intervalRef.current);

  if (phase === "exercise") {
    if (currentSet < totalSets) {
      setPhase("rest");
      setTimeLeft(restTime);
    } else {
      setPhase("done");
      setRunning(false);
      setTimeLeft(0);
    }
  } else if (phase === "rest") {
    if (currentSet < totalSets) {
      setCurrentSet(s => s + 1);
      setPhase("exercise");
      setTimeLeft(exerciseTime);
    } else {
      setPhase("done");
      setRunning(false);
      setTimeLeft(0);
    }
  }
};


  return (
    <div className="xcard">

      {/* GIF */}
      <div className="xcard__gif">
        {exercise.media && exercise.media.length > 0 ? (
  exercise.media[0].type === "video" ? (
    <video
      src={exercise.media[0].url}
      className="xcard__gif-img"
      autoPlay
      loop
      muted
      playsInline
    />
  ) : (
    <img
      src={exercise.media[0].url}
      alt={exercise.name}
      className="xcard__gif-img"
    />
  )
) : (
  <div className="xcard__gif-empty">No Media</div>
)}

        {exercise.difficulty && (
          <span className={`xcard__badge xcard__badge--${exercise.difficulty}`}>
            {exercise.difficulty}
          </span>
        )}
      </div>

      {/* BODY */}
      <div className="xcard__body">

        <h3 className="xcard__name">{exercise.name}</h3>

        <div className="xcard__tags">
          {[exercise.muscleGroup, exercise.category]
            .filter(Boolean)
            .map((tag, i) => (
              <span key={i} className="xcard__tag">{tag}</span>
            ))}
        </div>

        {/* SETS */}
        <div className="xcard__sets">
          {Array.from({ length: totalSets }).map((_, i) => (
            <div
              key={i}
              className={`xcard__dot ${
                i < currentSet - 1
                  ? "xcard__dot--done"
                  : i === currentSet - 1 && phase !== "done"
                  ? "xcard__dot--active"
                  : ""
              }`}
            />
          ))}
          <span className="xcard__set-label">
            {phase === "done"
              ? "Complete!"
              : `Set ${currentSet} / ${totalSets}`}
          </span>
        </div>

        {/* TIMER */}
        <div className="xcard__timer">
        <svg width="180" height="180" className="xcard__ring">
  <circle
    cx="90"
    cy="90"
    r={radius}
    fill="none"
    stroke="#1e1e1e"
    strokeWidth="8"
  />
  <circle
    cx="90"
    cy="90"
    r={radius}
    fill="none"
    stroke={phaseColor}
    strokeWidth="8"
    strokeLinecap="round"
    strokeDasharray={`${strokeDash} ${circumference}`}
    transform="rotate(-90 90 90)"   // 🔥 FIXED CENTER
  />
</svg>

          <div className="xcard__timer-inner">
            <span className="xcard__phase" style={{ color: phaseColor }}>
              {phase === "done" ? "Done!" : phase === "rest" ? "Rest" : "Go!"}
            </span>

            {phase !== "done" && (
              <span className="xcard__time">
                {mins}:{secs}
              </span>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="xcard__controls">
          {phase !== "done" ? (
            <>
              <button
                className="xcard__btn-start"
                style={{ background: running ? "#444" : "#ff6b00" }}
                onClick={() => setRunning(r => !r)}
              >
                {running ? "Pause" : "Start"}
              </button>

              <button className="xcard__btn-reset" onClick={reset}>
                Reset
              </button>
               <button className="xcard__btn-skip" onClick={handleSkip}>
        Skip ⏭
      </button>
            </>
          ) : (
            <button
              className="xcard__btn-start"
              style={{ background: "#2d7a3a", flex: 1 }}
              onClick={reset}
            >
              Restart
            </button>
          )}
        </div>

        {exercise.instructions && (
          <p className="xcard__instructions">{exercise.instructions}</p>
        )}

      </div>
    </div>
  );
};

export default ExerciseCard;