import React from 'react'
import { Youtube, Facebook,Instagram, Linkedin } from "lucide-react";
const footer = ({show=true}) => {
     if(!show) return null;
  return (
    
    <div>
        <footer className="footer">

  <div className="footer-grid">

    {/* Logo + Description */}
    <div className="footer-about">
      <img src="/photos/Logo2.png" alt="Shukla Fitness" className="footer-logo"/>

     <p>
At Shukla’s Fitness, we help people build strength, stay active, and live a healthier lifestyle.
Our goal is to make fitness simple, accessible, and motivating through modern gym training,
personalized workout plans, and supportive fitness communities.
</p>

<p className="hashtag">#Stronger Every Day</p>
    </div>

    {/* Column 1 */}
    <div className="footer-col">
      <p>Fitness programs</p>
      <p>Personal training</p>
      <p>Corporate fitness</p>
      <p>Membership plans</p>
      <p>Nutrition guidance</p>
    </div>

    {/* Column 2 */}
    <div className="footer-col">
      <p>Partner with us</p>
      <p>Blogs</p>
      <p>Fitness Guides</p>
      <p>Workout Plans</p>
      <p>Diet & Nutition Tips</p>
    </div>

    {/* Column 3 */}
    <div className="footer-col">
      <p>Contact us</p>
      <p>Privacy policy</p>
      <p>Help Center</p>
      <p>Security</p>
      <p>Terms & conditions</p>
    </div>

    {/* App + Social */}
    <div className="footer-app">
          <h3>Download the Shukla Fitness App</h3>
    <p>Track workouts, membership, and progress.</p>

      <img src="/photos/AppStore1.png" alt="App Store"/>
      <img src="/photos/PlayStore1.png" alt="Google Play"/>

      <div className="footer-social">
        <Youtube size={28}/>
        <Facebook size={28}/>
        <Instagram size={28}/>
        <Linkedin size={28}/>
      </div>

    </div>

  </div>
  <div className="footer-bottom">
    <p>© 2026 Shukla’s Fitness. All rights reserved.</p>
  </div>
</footer>
    </div>
  )
}

export default footer
