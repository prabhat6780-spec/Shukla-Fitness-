import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipTabs from "../components/MembershipTabs";
import "../css/HomeWorkout.css";
import { useNavigate } from "react-router-dom";


const HomeWorkout = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      {/* 🔥 HERO */}
      <section className="hero">

        <img
          src="/photos/HomeWorkout.png"
          alt="workout"
          className="hero-bg"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <h1>
            BUILD YOUR <span>STRONGEST</span><br />
            VERSION
          </h1>

          <p>
            Smart workouts. Real results. Train at home like a pro.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Start Workout</button>
            <button className="secondary-btn" onClick={() => navigate("/home-workout-plans")}>Explore Plans</button>
          </div>

        </div>

        {/* 🔥 SCROLL INDICATOR */}
        <div className="scroll-indicator">
          <span></span>
        </div>

      </section>

      {/* 🔥 STATS STRIP */}
      <section className="stats">

        <div className="stat-box">
          <h2>10K+</h2>
          <p>Active Users</p>
        </div>

        <div className="stat-box">
          <h2>500+</h2>
          <p>Workouts</p>
        </div>

        <div className="stat-box">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>

      </section>

      {/* 🔥 FEATURES */}
      <section className="features">

        <div className="feature-card">
          <h3>🏋️ AI Trainer</h3>
          <p>Personalized workouts powered by AI</p>
        </div>

        <div className="feature-card">
          <h3>🔥 Fat Burn</h3>
          <p>HIIT sessions for fast results</p>
        </div>

        <div className="feature-card">
          <h3>📊 Progress</h3>
          <p>Track your daily improvement</p>
        </div>

      </section>
{/* 🔥 WORKOUT VIDEO SECTION */}
<section className="workout-video">

  <h2>Watch & Train</h2>
  <p>Follow guided workouts anytime at home</p>

  <div className="video-container">
    <video
      src="/videos/HomeWorkout.mp4"   // 👈 your video path
      controls
      autoPlay
      muted
      loop
      className="video-player"
    />
  </div>

</section>
      <Footer />

    </div>
  );
};

export default HomeWorkout;