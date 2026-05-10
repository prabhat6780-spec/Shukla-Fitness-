import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipTabs from "../components/MembershipTabs";
import useTrial from "../hooks/useTrial";
import useMembership from "../hooks/useMembership";
import useRole from "../hooks/useRole";

import "../css/HomeWorkoutPlans.css";
import { useNavigate } from "react-router-dom";

const HomeWorkoutPlans = () => {

  const navigate = useNavigate();
  const { hasTrial, trialPlan } = useTrial();
  const { hasMembership, membership } = useMembership();
  const { isAdmin } = useRole();

  const [selectedPlan, setSelectedPlan] = useState("7days");
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: "7days", title: "7 days",    price: "Free",  duration: 7  },
    { id: "24m",   title: "24 Months", price: "₹2779", duration: 24 },
    { id: "12m",   title: "12 Months", price: "₹1859", duration: 12 },
    { id: "6m",    title: "6 Months",  price: "₹1429", duration: 6  },
    { id: "3m",    title: "3 Months",  price: "₹1029", duration: 3  }
  ];

  // 🔥 HANDLE BUTTON CLICK
const handleAction = async () => {

  const selected = plans.find(p => p.id === selectedPlan);

  // 🔒 BLOCK if already has membership
  if (hasMembership) {
    alert("You already have an active membership.");
    return;
  }

  // ✅ FREE TRIAL
  if (selectedPlan === "7days") {

    if (hasTrial) {
      alert(
        `You have already used your free trial for "${trialPlan}". ` +
        `Only one free trial is allowed per account.`
      );
      setSelectedPlan("12m");
      return;
    }

    navigate("/free-trial", { state: { plan: "Home Workout" } });
    return;
  }

  // 💰 PAID
  setLoading(true);
  try {
    navigate("/membership-payment", {
      state: {
        planType: "Home Workout",
        planName: selected.title,
        month: selected.duration,
        price: selected.price,
        image: "/photos/HomeWorkout1.png"
      }
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="hw-page">

      <Navbar showMenu showIcons dark />

      <div className="hw-container">

        {/* LEFT IMAGE */}
        <div className="hw-left">
          <img
            src="/photos/HomeWorkout1.png"
            alt="home workout"
            className="hw-image"
          />

          <div className="hw-overlay"></div>

          <div className="hw-text">
            <h2>TRAIN AT HOME</h2>
            <p>Mindfulness • Strength • Yoga</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hw-right">

          <h1 className="hw-title">ShuklaPass HOME</h1>
          <h3 className="hw-subtitle">Choose subscription plan</h3>

          <div className="hw-plan-list">

            {plans.map((plan) => {

              // ⭐ Disable 7-day row if trial already used
              const isDisabled = plan.id === "7days" && hasTrial;

              return (
                <div
                  key={plan.id}
                  className={`hw-plan-item ${selectedPlan === plan.id ? "hw-active" : ""} ${isDisabled ? "hw-disabled" : ""}`}
                  onClick={() => !isDisabled && setSelectedPlan(plan.id)}
                >
                  <div className="hw-plan-left">
                    <input
                      type="radio"
                      checked={selectedPlan === plan.id}
                      readOnly
                      disabled={isDisabled}
                    />
                    <span>
                      {plan.title}
                      {isDisabled && (
                        <span className="hw-trial-used-tag">Already Used</span>
                      )}
                    </span>
                  </div>

                  <div className="hw-price">
                    {plan.old && <span className="hw-old">{plan.old}</span>}
                    <span>{plan.price}</span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* 🔥 BUTTON */}
      {(() => {

  const isActive =
    hasMembership &&
    membership?.plan?.toLowerCase() === "home workout";

  // ✅ SHOW ACTIVE
  if (isActive) {
    return (
      <div className="active-badge">
        ✔ Active Membership
      </div>
    );
  }

  // ❌ HIDE BUTTON IF HAS OTHER MEMBERSHIP
  if (hasMembership&& !isAdmin) return null;

  // ✅ SHOW BUTTON FOR NORMAL USERS
  return (
    <button
      className="hw-btn"
      onClick={handleAction}
      disabled={
        loading ||
        (selectedPlan === "7days" && hasTrial)
      }
    >
      {loading
        ? "Processing..."
        : selectedPlan === "7days"
        ? hasTrial
          ? "Trial Already Used"
          : "ACTIVATE FREE TRIAL"
        : `PAY ${plans.find(p => p.id === selectedPlan)?.price}`}
    </button>
  );

})()}

          <div className="hw-offer">
            Buy now, you won't lose out! Your membership will start after trial.
          </div>

        </div>

      </div>

      {/* FEATURES + HOW (UNCHANGED) */}
      <div className="hw-features">
        <h1>Unlimited access to</h1>
        <div className="hw-grid">
          <div className="hw-card"><img src="/photos/H1.png" /><p>Fitness, Dance & Meditation</p></div>
          <div className="hw-card"><img src="/photos/H2.png" /><p>Celebrity Masterclasses</p></div>
          <div className="hw-card"><img src="/photos/H3.png" /><p>Live leaderboard</p></div>
          <div className="hw-card"><img src="/photos/H4.png" /><p>Workout with friends</p></div>
        </div>
      </div>

      <div className="hw-how">
        <h2>How it works</h2>
        <div className="hw-steps">
          <div className="hw-step"><span>📲</span><p>Sign up for a Live session</p></div>
          <div className="hw-step"><span>📍</span><p>Pick a comfortable place</p></div>
          <div className="hw-step"><span>⏱️</span><p>Join before start time</p></div>
          <div className="hw-step"><span>⚙️</span><p>Setup your device</p></div>
          <div className="hw-step"><span>😊</span><p>Enjoy workout</p></div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomeWorkoutPlans;
