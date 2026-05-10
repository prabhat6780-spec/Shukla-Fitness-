import "../css/Frontpage.css";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";


const Frontpage = () => {
  const [showWelcome, setShowWelcome] = useState(true);
     const membershipRef = useRef(null);

  const scrollToMembership = () => {
    membershipRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const navigate = useNavigate();

const goToMembership = () => {
  navigate("/membership");
};
if (showWelcome) {
  return <Welcome onFinish={() => setShowWelcome(false)} />;
}
  return (
    
   <div>
<Navbar showMenu showIcons dark />
  <div className="frontpage">

    <video autoPlay loop muted playsInline className="background-video">
      <source src="/videos/front3.mp4" type="video/mp4" />
    </video>

    <div className="overlay"></div>
        {/* Hero Text */}
        <div className="hero-text animate-fadeSlideLeft">

          <h2 className="hero-line gray">TRAIN WITH</h2>

          <h2 className="hero-line white1">SHUKLA'S</h2>

          <h2 className="hero-small orange1">
            BUILDING STRENGTH.<br /> DEFINING YOU.
          </h2>

        </div>

        {/* Membership Button */}
        <button className="membership-btn" onClick={goToMembership}>
  GET MEMBERSHIP
</button>

        {/* Down Arrow */}
        <div className="scroll-arrow" onClick={scrollToMembership}>
          <span></span>
        </div>

      </div>

      {/* MEMBERSHIP SECTION */}
<div className="membership-section" ref={membershipRef}>

  <div className="membership-content">

      <div className="membership-gallery">

  <div className="card card1">
    <img src="/photos/frontimage1.png" alt="gym"/>
  </div>

  <div className="card card2">
    <img src="/photos/frontimage2.png" alt="gym"/>
  </div>

  <div className="card card3">
    <img src="/photos/frontimage3.png" alt="gym"/>
  </div>

  <div className="card card4">
    <img src="/photos/frontimage4.png" alt="gym"/>
  </div>

  <div className="card card5">
    <img src="/photos/frontimage5.png" alt="gym"/>
  </div>
  </div>
  <div className="app-banner">
    <img 
      src="/photos/app-banner.png"   // ⭐ put your image in public/photos
      alt="Shukla Fitness App"
      className="app-banner-img"
    />
  </div>
</div>

</div>
    <Footer/>

    </div>
  );
};

export default Frontpage;