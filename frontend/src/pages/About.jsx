import React from "react";
import "../css/About.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const About = () => {
  return (
    <div className="about-page">
<Navbar showMenu showIcons dark />
      {/* HERO SECTION */}
      <div className="about-hero">

        <div className="about-left">

          <h4>About</h4>
          <h1>Shukla’s Fitness</h1>

          <p>
            Shukla’s Fitness is a modern fitness platform dedicated to helping
            people build strength, improve health, and achieve their fitness goals.
          </p>

          <p>
            We combine professional gym training, personalized workout plans,
            nutrition guidance, and AI-based fitness recommendations to create
            a complete fitness experience.
          </p>

          <p>
            Our mission is to make fitness simple, 
            accessible, and motivating for everyone.
          </p>
          <p>Whether you are a beginner or an advanced athlete,
            Shukla's Fitness provides the right environment, expert guidance, and 
            innovative tools to support your fitness journey.
          </p>

          <button className="join-btn">Join ShuklaPass</button>

        </div>

      </div>
         {/* ===== VIDEO SECTION ===== */}
      <section className="video-section">

        <h2 className="video-title">Experience Our Gym</h2>
        <video
          src="/videos/Gym_Video.mp4"
          className="gym-video"
          controls
          loop
        />

      </section>
      {/* SECOND VIDEO */}
<section className="video-section">

  <video
    src="/videos/Gym_Video_2.mp4"
    className="gym-video"
    controls
    loop
  />

</section>

      {/* VISION SECTION */}
      <div className="vision-section">

        <h2>Our Vision</h2>
        <p>
          To build a strong fitness community where technology, training,
          and motivation come together to transform lives.
        </p>

        <div className="vision-grid">

          <div className="vision-card">
            <img src="/photos/dumbbell.png" />
            <h3>Modern Gym Equipment</h3>
          </div>

          <div className="vision-card">
            <img src="/photos/ai.png" />
            <h3>AI Fitness Planner</h3>
          </div>

          <div className="vision-card">
            <img src="/photos/Certified Trainer.png" />
            <h3>Certified Trainers</h3>
          </div>

          <div className="vision-card">
            <img src="/photos/diet.png" />
            <h3>Personal Diet Plans</h3>
          </div>

        </div>

      </div>
<Footer/>
    </div>
  );
};

export default About;