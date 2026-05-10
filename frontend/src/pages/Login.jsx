import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import API from "../api";
import "../css/Login.css";
import "../css/Register.css"

const Login = () => {
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimOtp, setClaimOtp] = useState("");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showReset, setShowReset] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      let res;

      if (form.password) {
        res = await API.post("/auth/login-password", {
          email: form.email,
          password: form.password
        });
      } else if (form.otp) {
        res = await API.post("/auth/verify-otp", {
          email: form.email,
          otp: form.otp
        });

        // Admin-created user — show set password inline
        if (res.data.needsPassword) {
          setClaimEmail(form.email);
          setClaimOtp(form.otp);
          setNeedsPassword(true);
          return;
        }

      } else {
        alert("Please enter Password OR OTP");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      window.dispatchEvent(new Event("storage"));
      alert("Login Successful");

      if (res.data.role === "admin") {
        navigate("/");
      } else {
        const params = new URLSearchParams(location.search);
        const redirect = params.get("redirect");
        navigate(redirect === "checkout" ? "/checkout/address" : "/");
      }

    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Login Failed");
    }
  };

  const handleClaimAccount = async () => {
    if (!form.newPassword) {
      alert("Please enter a password");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/claim-account", {
        email: claimEmail,
        otp: claimOtp,
        password: form.newPassword
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      window.dispatchEvent(new Event("storage"));

      alert("Account activated! Welcome 💪");
      navigate("/profile");

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to activate account");
    }
  };

  const handleSendOtp = async () => {
    if (otpTimer > 0) return;

    try {
      setOtpLoading(true);
      const res = await API.post("/auth/send-otp", { email: form.email });
      alert(res.data.message);
      setOtpTimer(60);
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleForgotPassword = async () => {
    try {
      const res = await API.post("/auth/forgot-password", { email: form.email });
      alert(res.data.message);
      setShowReset(true);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await API.post("/auth/reset-password", {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword
      });
      alert(res.data.message);
      setShowReset(false);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <div className='hidden lg:block w-[40%] h-screen'>
        <img src="photos/Register/Login1.png" alt="gym"
          className='h-full w-full object-contain object-left' />
      </div>

      <div className="login-right"
        style={{ backgroundImage: "url('/photos/Register/Register2.png')" }}>

        <div className="login-logo">
          <img src="/photos/Logo5.png" alt="logo" />
        </div>

        <div className="login-form">

          <div className="login-heading">
            <h1 className="register-title">
              {needsPassword ? "Set Password" : "Login"}
            </h1>
            <p className="register-subtitle">
              {needsPassword ? "Activate Your Account" : "Access Your Account"}
            </p>
          </div>

          <div className="form-fields">

            {/* ── CLAIM ACCOUNT (admin-created user sets password) ── */}
            {needsPassword ? (
              <>
                <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "8px" }}>
                  Your account was created by the gym admin. Please set a password to activate it.
                </p>

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="register-input"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="register-input"
                />

                <button onClick={handleClaimAccount} className="login-btn">
                  Activate Account
                </button>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setNeedsPassword(false)}
                >
                  ← Back to Login
                </button>
              </>

            ) : (
              /* ── NORMAL LOGIN ── */
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="register-input"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="register-input"
                />

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="register-input"
                />

                <div className="login-buttons">
                  <button onClick={handleLogin} className="login-btn">
                    Login
                  </button>

                  <button
                    onClick={handleSendOtp}
                    className="otp-btn"
                    disabled={otpLoading || otpTimer > 0}
                  >
                    {otpLoading ? "Sending..." : otpTimer > 0 ? `Resend in ${otpTimer}s` : "Send OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>

                {showReset && (
                  <>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter Reset OTP"
                      value={form.otp}
                      onChange={handleChange}
                      className="register-input"
                    />

                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="register-input"
                    />

                    <button onClick={handleResetPassword} className="register-button">
                      Reset Password
                    </button>
                  </>
                )}

                <div className="google-login">
                  <div className="or-divider"><span>OR</span></div>
                  <button className="google-btn" onClick={handleGoogleLogin}>
                    <img src="/photos/Register/Google.jpeg" alt="google" />
                    Continue with Google
                  </button>
                </div>

                <p className="login-text">
                  New User?{" "}
                  <span style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
                    Register Here
                  </span>
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
