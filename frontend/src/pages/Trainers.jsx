import React from "react";
import "../css/Trainers.css";

const Trainers = () => {
  return (
    <div>
    <div className="trainers-page">

      <div className="trainers-content">

        <h1>
          <span>About</span> Our Trainers
        </h1>

        <p className="trainers-desc">
          At Shukla's Fitness, our trainers are experienced, certified and<br/>
          passionate about helping you reach your fitness goals safely and<br/> effectively.
        </p>

        {/* SINGLE TRAINERS IMAGE */}
       <div className="trainers-image-section">

  <img
    src="/photos/trainers.png"
    className="trainers-main-img"
    alt="trainers"
  />

  {/* BLACK TRANSITION */}
  <div className="black-transition"></div>

  {/* FEATURES */}
  <div className="trainer-features">

    <div className="feature">
      <img src="/photos/star.png" />
      <h3>Certified Fitness <br/> Experts</h3>
    </div>

    <div className="feature">
      <img src="/photos/ai.png" />
      <h3>Specialized Training<br/> Programs</h3>
    </div>

    <div className="feature">
      <img src="/photos/support.png" />
      <h3>Personalized<br/> Support</h3>
    </div>

  </div>

</div>
    </div>
   </div>
      <div className="trainers-section">
        <h1 className="trainers-main-heading">
  Meet Our Trainers – <span>Shukla Fitness</span>
</h1>

        {/* Trainer 1 */}
        <div className="trainer-row">
          <img src="/photos/TrainerM2.png" className="trainer-photo" alt="" />

          <div className="trainer-info">
            <h2>Bhardwaj Pisupati</h2>
            <h4>Strength & Muscle Gain Coach</h4>
             <p>
      <strong>Specialization:</strong> Strength Training & Muscle Gain <br/>
      <strong>Experience:</strong> 6+ Years <br/>
      <strong>Previous Gym:</strong> SnapFit Gym, Vadodara
    </p>
       <p>
      Bhardwaj is a certified strength coach who helps members build muscle,
      improve endurance and achieve peak physical performance. He focuses on
      progressive overload techniques and functional training methods.
    </p>

    <ul>
      <li>Weight Training</li>
      <li>Body Transformation</li>
      <li>Powerlifting Basics</li>
      <li>Injury Prevention</li>
    </ul>
          </div>
        </div>

        {/* Trainer 2 */}
        <div className="trainer-row reverse">
          <img src="/photos/TrainerM1.png" className="trainer-photo" alt="" />

          <div className="trainer-info">
            <h2>Dhariya Mehta</h2>
            <h4>Fat Loss & Functional Fitness Coach</h4>
            <p>
      <strong>Specialization:</strong> Fat Loss & Functional Fitness <br/>
      <strong>Experience:</strong> 3+ Years <br/>
      <strong>Previous Gym:</strong> Health Plex, GSFC University, Vadodara
    </p>

    <p>
      Dhairya specializes in fat loss programs and high-intensity interval
      training. His workouts are designed to improve stamina, burn calories
      efficiently and enhance overall mobility.
    </p>

    <ul>
      <li>HIIT Workouts</li>
      <li>Fat Loss Programs</li>
      <li>Core Strength Training</li>
      <li>Mobility & Flexibility</li>
    </ul>
          </div>
        </div>

        {/* Trainer 3 */}
        <div className="trainer-row">
          <img src="/photos/TrainerF1.png" className="trainer-photo" alt="" />

          <div className="trainer-info">
            <h2>Neha Kapoor</h2>
            <h4>Yoga, Cardio & Nutrition Coach</h4>

    <p>
      <strong>Specialization:</strong> Yoga, Cardio & Nutrition Guidance <br/>
      <strong>Experience:</strong> 4+ Years <br/>
      <strong>Previous Gym:</strong> Mayuri Fitness, Bharuch
    </p>

    <p>
      Neha focuses on holistic fitness by combining yoga practices, cardio
      routines and personalized diet guidance. She helps clients improve
      posture, flexibility and mental wellness.
    </p>

    <ul>
      <li>Yoga & Meditation</li>
      <li>Cardio Conditioning</li>
      <li>Posture Correction</li>
      <li>Diet Planning</li>
    </ul>
          </div>
        </div>

        {/* Trainer 4 */}
        <div className="trainer-row reverse">
          <img src="/photos/TrainerF2.png" className="trainer-photo" alt="" />

          <div className="trainer-info">
            <h2>Sneha Shah</h2>
             <h4>Functional Strength & Conditioning Coach</h4>

    <p>
      <strong>Specialization:</strong> Functional Training & Athletic Conditioning <br/>
      <strong>Experience:</strong> 5+ Years <br/>
      <strong>Previous Gym:</strong> V4 Fitness, Bharuch
    </p>

    <p>
      Karan is known for designing performance-based training programs that
      improve agility, strength and endurance. He works with beginners as well
      as athletes to enhance physical performance and injury resilience.
    </p>

    <ul>
      <li>Functional Strength Training</li>
      <li>Athletic Conditioning</li>
      <li>Endurance Development</li>
      <li>Rehabilitation Exercises</li>
    </ul>
          </div>
        </div>
{/* ===== ZUMBA SECTION ===== */}

<h1 className="zumba-heading">
  Meet Our Zumba Instructors – <span>Shukla Fitness</span>
</h1>

<div className="trainer-row">

  <img src="/photos/Zumba1.png" className="zumba-photo" />

  <div className="trainer-info">
    <h2>Mitanshu Mishra</h2>
    <h4>Zumba Instructor</h4>

    <p>
     Professional Zumba coach specializing in high-energy dance fitness,
      stamina improvement and fat-burn transformation programs.
    </p>

    <ul>
      <li>💃 Latin Dance Fitness</li>
      <li>🔥 Fat Burn Sessions</li>
      <li>⚡ Energy Boost Training</li>
    </ul>
  </div>

</div>

{/* Zumba Instructor 2 */}
<div className="trainer-row reverse">

  <img src="/photos/Zumba2.png" className="zumba-photo" />

  <div className="trainer-info">
    <h2>Riya Shah</h2>
    <h4>Zumba Coach</h4>

    <p>
      Passionate dance fitness expert focusing on beginner-friendly routines,
      rhythm coordination and fun cardio workouts.
    </p>

    <ul>
      <li>🎵 Beginner Friendly Steps</li>
      <li>❤️ Cardio Fitness</li>
      <li>😊 Stress Relief Dance</li>
    </ul>
  </div>

</div>
      </div>
    </div>
  );
};

export default Trainers;