import React, { useEffect, useState } from "react";
import "../css/Welcome.css";
import logo from "/photos/Logo2.png";

const Welcome = ({ onFinish }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHide(true);
      setTimeout(onFinish, 400);
    }, 1500);
  }, [onFinish]);

  return (
    <div className={`shukla-welcome-container ${hide ? "fade" : ""}`}>
<video autoPlay loop muted className="welcome-video">
  <source src="/videos/front3.mp4" type="video/mp4" />
</video>
  {/* ⭐ Blurred Frontpage Background */}
  <div className="welcome-bg"></div>

  {/* ⭐ Dark Overlay */}
  <div className="shukla-overlay"></div>

  <div className="shukla-content">
      <img src={logo} alt="logo" className="shukla-logo" />

      <h1 className="shukla-title-orange">SHUKLA’S</h1>
      <h1 className="shukla-title-white">FITNESS</h1>

      <p className="shukla-tagline">
        Building Strength. Defining You
      </p>

      <div className="shukla-loader"></div>
  </div>

</div>
  );
};

export default Welcome;