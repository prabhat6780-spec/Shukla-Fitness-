import React from "react";
import "../css/Register.css";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
const [form, setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value});
  };

  const handleRegister = async () => {
    try {

      const res = await API.post("/auth/register", form);

      alert(res.data.message);

      navigate("/login");

    } catch(err){
   
    alert(
      err?.response?.data?.message ||
      "Register Failed"
    );

  }

};
  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
{/* LEFT IMAGE */}
<div className="hidden lg:block w-[40%] h-screen">
  <img
    src="/photos/Register/Register1.png"
    alt="gym"
    className="h-full w-full object-contain object-left"
  />
</div>

{/* RIGHT IMAGE + FORM */}
<div
  className="register-right "
  style={{ backgroundImage: "url('/photos/Register/Register2.png')" }}
>
  {/* Logos */}
<div className="logo-wrapper">

  <img
    src="/photos/Logo5.png"
    alt="logo icon"
    className="logo-icon"
  />

</div>

 <div className="register-form">

    <div className="mb-7 text-center">
      <h1 className="register-title">REGISTER</h1>
      <p className="register-subtitle">Create Your Account</p>
    </div>

    <div className="form-fields">

  <input
    type="text"
    name="name"
    placeholder="Full Name"
    onChange={handleChange}
    className="register-input"
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    className="register-input"
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    className="register-input"
  />

  <button onClick={handleRegister} className="register-button">
    REGISTER
  </button>

<div className="google-login">

  <div className="or-divider">
    <span>OR</span>
  </div>

  <button className="google-btn">
    <img src="/photos/Register/Google.jpeg" alt="google"/>
    Continue with Google
  </button>

</div>

<p className="login-text">
  Already have an account?  
  <span
    style={{cursor:"pointer"}}
    onClick={() => navigate("/login")}
  >
    Login here
  </span>
</p>


</div>

  </div>

</div>
</div>
  );
}
export default Register;