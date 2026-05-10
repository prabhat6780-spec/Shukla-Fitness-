import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipTabs from "../components/MembershipTabs";
import useTrial from "../hooks/useTrial";
import useMembership from "../hooks/useMembership";
import useRole from "../hooks/useRole";
import PlanSlider from "./PlanSlider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Basic.css";

const Basic = () => {
  const navigate = useNavigate();
 const { hasTrial, trialPlan } = useTrial();
 const { hasMembership, membership } = useMembership();
 const { isAdmin } = useRole();
  const [activePlan, setActivePlan] = useState("plus");

  const handleComparisonBuy = (planName, price) => {
    navigate("/membership-payment", {
      state: {
        planType: "Basic",
        planName,
        month: 12,
        price,
        image: "/photos/Paymentphotomembership2.png"
      }
    });
    window.scrollTo(0, 0);
  };

  const scrollToPlans = () => {
    const section = document.getElementById("plans");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  /* ⭐ PLAN DATA */
  const plusPlans = [
    { month: 12, price: "₹15450", per: "1288 per month*" },
    { month: 6,  price: "₹12590", per: "2098 per month*" },
    { month: 3,  price: "₹9350",  per: "3117 per month*" },
    { month: 1,  price: "₹7255",  per: "-" },
    { month: 24, price: "₹26190", per: "1091 per month*" }
  ];

  const basicPlans = [
    { month: 12, price: "₹8388",  per: "699 per month*" },
    { month: 6,  price: "₹5094",  per: "849 per month*" },
    { month: 3,  price: "₹3297",  per: "1099 per month*" },
    { month: 1,  price: "₹1299",  per: "-" },
    { month: 24, price: "₹14376", per: "599 per month*" }
  ];

  return (
    <div>
      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      {/* ⭐ HERO */}
      <div className="basic-hero">
        <div className="basic-left">
          <h1>ShuklaPass <span>BASIC</span></h1>
          <ul>
            <li>Access to 1 home gym center</li>
            <li>Gym floor & all equipment</li>
            <li>Selected group fitness classes</li>
            <li>Locker & changing room facility</li>
            <li>Basic diet tips & guidance</li>
          </ul>
          <h2>Starting at ₹699 / month*</h2>
          {/* ⭐ HERO BUTTONS */}
<div className="basic-buttons">

  {/* 🔥 TRIAL */}
  {(() => {
    const isTrialActive =
      hasTrial && trialPlan === "Basic";

    // ✅ SHOW ACTIVE
    if (isTrialActive && !isAdmin) {
      return <span className="trial-used-badge">✔ Trial Active</span>;
    }

    // ✅ ADMIN ALWAYS CAN USE TRIAL
    if (isAdmin) {
      return (
        <button
          className="trial-btn"
          onClick={() =>
            navigate("/free-trial", { state: { plan: "Basic" } })
          }
        >
          TRY FOR FREE
        </button>
      );
    }

    // ✅ NORMAL USER (NO TRIAL + NO MEMBERSHIP)
    if (!hasTrial && !hasMembership) {
      return (
        <button
          className="trial-btn"
          onClick={() =>
            navigate("/free-trial", { state: { plan: "Basic" } })
          }
        >
          TRY FOR FREE
        </button>
      );
    }

    return null;
  })()}

  {/* 🔥 BUY NOW */}
  {(() => {
    const isMembershipActive =
      hasMembership &&
      membership?.planName?.includes("Basic");

    // ✅ ACTIVE PLAN
    if (isMembershipActive && !isAdmin) {
      return (
        <span className="trial-used-badge">
          ✔ Membership Active
        </span>
      );
    }

    // ✅ ADMIN ALWAYS CAN BUY
    if (isAdmin) {
      return (
        <button className="buy-btn" onClick={scrollToPlans}>
          BUY NOW
        </button>
      );
    }

    // ✅ NORMAL USER
    if (!hasMembership) {
      return (
        <button className="buy-btn" onClick={scrollToPlans}>
          BUY NOW
        </button>
      );
    }

    return null;
  })()}

</div>
          <p className="note">*Effective monthly pricing including extension if any</p>
        </div>
        <div className="basic-right">
          <img src="/photos/BasicMembership.png" alt="basic membership" />
        </div>
      </div>

      {/* ⭐ BANNER */}
      <div className="basic-banner">
        <img src="/photos/basicph.png" alt="basicph" />
      </div>

      {/* ⭐ DURATION */}
      <div className="duration-section" id="plans">
        <h2>Choose your ShuklaPass</h2>
        <p>Flexible plans to suit your fitness needs</p>

        <div className="duration-cards">
          <div className="duration-card"><h3>12 MONTHS</h3><span>₹699/MO*</span></div>
          <div className="duration-card"><h3>6 MONTHS</h3><span>₹849/MO*</span></div>
          <div className="duration-card"><h3>3 MONTHS</h3><span>₹1099/MO*</span></div>
          <div className="duration-card"><h3>24 MONTHS</h3><span>₹599/MO*</span></div>
          <div className="duration-card"><h3>1 MONTH</h3><span>₹1299/MO*</span></div>
          <p className="effective-note">*Effective Monthly Pricing including Extension, if any</p>
        </div>

        {/* ⭐ COMPARISON */}
        <div className="comparison-section">
          <h2 className="compare-title">Compare Basic Plans</h2>
          <div className="compare-table">

            <div className="compare-features">
              <div className="empty"></div>
              <div className="empty"></div>
              <div>Gym Access</div>
              <div>No. of Centers</div>
              <div>Selected Classes</div>
              <div>Locker Facility</div>
              <div>Basic Diet Tips</div>
              <div>Mobile App Access</div>
              <div>Multi-city Access</div>
              <div>Personal Trainer</div>
              <div className="total-label">Total Payable (12M)</div>
            </div>

            {/* BASIC */}
            <div className="compare-plan">
              <h3>BASIC</h3>
              <span className="price">₹699/MO*</span>
              <div>✔</div>
              <div style={{fontSize:"12px"}}>1 Center</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <h4>₹8388</h4>
            {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Basic" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Basic", "₹8388")}>
        BUY
      </button>
    );
  }

  return null;
})()}
            </div>

            {/* BASIC PLUS */}
            <div className="compare-plan">
              <h3>BASIC PLUS</h3>
              <span className="price">₹1288/MO*</span>
              <div>✔</div>
              <div style={{fontSize:"12px"}}>City-wide</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <h4>₹15450</h4>
           {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Basic Plus" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Basic Plus", "₹15450")}>
        BUY
      </button>
    );
  }

  return null;
})()}
            </div>

          </div>
        </div>

        {/* ⭐ TOGGLE */}
        <div className="plan-toggle-section">
          <div className="plan-toggle-container">
            <div
              className={`toggle-card ${activePlan === "plus" ? "active" : ""}`}
              onClick={() => setActivePlan("plus")}
            >
              <h3>BASIC PLUS</h3>
              <p>City-wide Centers + Mobile App</p>
            </div>
            <div
              className={`toggle-card ${activePlan === "basic" ? "active" : ""}`}
              onClick={() => setActivePlan("basic")}
            >
              <h3>BASIC</h3>
              <p>Single Center Access</p>
            </div>
          </div>
        </div>

        {/* ⭐ SLIDER */}
        <PlanSlider
          activePlan={activePlan}
          plusPlans={plusPlans}
          basicPlans={basicPlans}
          membershipType="Basic"
           hasMembership={hasMembership}
  membership={membership}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Basic;
