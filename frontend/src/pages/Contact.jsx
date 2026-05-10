import React,{useState} from 'react'
import "../css/Contact.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import API from '../api';
const Contact = () => {
    // ✅ STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      return alert("Please fill required fields");
    }

    try {
      setLoading(true);

      await API.post("/contact", form);

      alert("Message sent successfully ✅");

      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });

    } catch (err) {
      console.log(err);
      alert("Failed to send ❌");
    } finally {
      setLoading(false);
    }
  };
  return (
<div>
  <Navbar showMenu showIcons dark />
<Sidebar/>
  <div className="contact-page">

    {/* ⭐ HERO SECTION */}
    <div className="contact-hero">

      {/* LEFT CONTACT */}
    <div className="contact-left">
<div className="contact-wrapper">
  <h1 className="contact-title">CONTACT US</h1>

  <div className="contact-horizontal">

    {/* LEFT DETAILS */}
   <div className="contact-details-box">

  <div className="contact-item">
    <FaMapMarkerAlt className="contact-icon"/>
    <span>Bharuch, Gujarat</span>
  </div>

  <div className="contact-item">
    <FaPhoneAlt className="contact-icon"/>
    <span>+91 9924188433</span>
  </div>

  <div className="contact-item">
    <FaEnvelope className="contact-icon"/>
    <span>shuklafitness@gmail.com</span>
  </div>

</div>
    {/* RIGHT FORM */}
    <div className="contact-form-box">
      <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                  />

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                  />

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                  />

                  <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
    </div>

  </div>
</div>
</div>

{/* ⭐ RIGHT GYM IMAGE */}
<div className="contact-right">

  <div className="gym-hero">
    <img src="/photos/Gym_contact2.png" alt="gym"/>
  </div>

</div>
    </div>


    {/* ⭐ GYM STRIP AT BOTTOM */}
    <div className="gym-strip">
<div className="gym-layout gym-layout-1">
      <div className="gym-card">
        <img src="/photos/Location.png" />
        <span>Location</span>
      </div>

      <div className="gym-card">
        <img src="/photos/Cardio.png" />
        <span>Cardio Area</span>
      </div>
      </div>
<div className="gym-layout gym-layout-2">
      <div className="gym-card">
        <img src="/photos/Interior2.png" />
        <span>Workout Zone</span>
      </div>
      
       <div className="gym-card">
        <img src="/photos/Fitness2.png" />
        <span>Fitness</span>
      </div>
</div>
<div className="gym-layout gym-layout-3">
      <div className="gym-card">
        <img src="/photos/CafeArea.png" />
        <span>Cafe Area</span>
      </div>
<div className="gym-card">
        <img src="/photos/Zumba Class.png" />
        <span>Zumba Class</span>
      </div>
    </div>
</div>
  </div>

  <Footer/>
</div>
)
}

export default Contact
