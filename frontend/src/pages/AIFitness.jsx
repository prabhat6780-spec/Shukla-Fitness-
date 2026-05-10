import React from 'react'
import "../css/AIFitness.css";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AIFitness = () => {
  const nav=useNavigate()
  return (
    <div><Navbar showMenu showIcons dark />
  <div className="ai-page">
      {/* ===== HERO ===== */}
  <div className="ai-hero">
  <div className="ai-content">
    <h1 className="ai-title">
      TRANSFORM YOUR BODY <br />
      <span>WITH AI FITNESS TRAINING</span>
    </h1>

    <p>
      Experience personalized fitness plans powered by AI to help you
      achieve your goals faster with smarter workouts and guidance.
    </p>
  </div>

</div>

      {/* ===== VIDEO SECTION ===== */}
      <section className="ai-video-section">

        <video
          src="/videos/Ai2.mp4"
          controls
          loop
          className="ai-video"
        />

        <button onClick={()=>nav("/aiform")}className="ai-btn">Start Your Journey</button>

      </section>
      </div>
<Footer/>
    </div>
  );
};

export default AIFitness
