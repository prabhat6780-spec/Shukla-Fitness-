import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipTabs from "../components/MembershipTabs";
import PlanSlider from "./PlanSlider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTrial from "../hooks/useTrial";
import useMembership from "../hooks/useMembership";
import useRole from "../hooks/useRole";
import "../css/Basic.css";

const Pro = () => {
  const navigate = useNavigate();
  const { hasTrial, trialPlan } = useTrial();
  const { hasMembership, membership } = useMembership();
  const { isAdmin } = useRole();
  const [activePlan, setActivePlan] = useState("plus");

  const handleComparisonBuy = (planName, price) => {
    navigate("/membership-payment", {
      state: {
        planType: "Pro",
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

  const plusPlans = [
    { month: 12, price: "₹20450", per: "1704 per month*" },
    { month: 6,  price: "₹15590", per: "2598 per month*" },
    { month: 3,  price: "₹11350", per: "3783 per month*" },
    { month: 1,  price: "₹3999",  per: "-" },
    { month: 24, price: "₹38190", per: "1591 per month*" }
  ];

  const basicPlans = [
    { month: 12, price: "₹14388", per: "1199 per month*" },
    { month: 6,  price: "₹7794",  per: "1299 per month*" },
    { month: 3,  price: "₹4497",  per: "1499 per month*" },
    { month: 1,  price: "₹1799",  per: "-" },
    { month: 24, price: "₹26376", per: "1099 per month*" }
  ];

  return (
    <div>
      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      <div className="basic-hero">
        <div className="basic-left">
          <h1>ShuklaPass <span>PRO</span></h1>
          <ul>
            <li>Access to all PRO gym centers (city-wide)</li>
            <li>Advanced strength & cardio machines</li>
            <li>Monthly workout plan + progress tracking</li>
            <li>Basic Yoga / Zumba / HIIT classes</li>
            <li>Mobile app access</li>
          </ul>
          <h2>Starting at ₹1199 / month*</h2>
 <div className="basic-buttons">

  {/* 🔥 TRIAL */}
  {(() => {
    const isTrialActive =
      hasTrial && trialPlan === "Pro";

    if (isTrialActive && !isAdmin) {
      return <span className="trial-used-badge">✔ Trial Active</span>;
    }

    if (isAdmin || (!hasTrial && !hasMembership)) {
      return (
        <button
          className="trial-btn"
          onClick={() =>
            navigate("/free-trial", { state: { plan: "Pro" } })
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
      membership?.planName?.includes("Pro");

    if (isMembershipActive && !isAdmin) {
      return (
        <span className="trial-used-badge">
          ✔ Membership Active
        </span>
      );
    }

    if (isAdmin || !hasMembership) {
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
          <img src="/photos/ProMembership.png" alt="pro" />
        </div>
      </div>

      <div className="basic-banner">
        <img src="/photos/Probanner.png" alt="pro banner" />
      </div>

      <div className="duration-section" id="plans">
        <h2>Choose your ShuklaPass</h2>
        <p>Flexible plans to suit your fitness needs</p>

        <div className="duration-cards">
          <div className="duration-card"><h3>12 MONTHS</h3><span>₹1199/MO*</span></div>
          <div className="duration-card"><h3>6 MONTHS</h3><span>₹1299/MO*</span></div>
          <div className="duration-card"><h3>3 MONTHS</h3><span>₹1499/MO*</span></div>
          <div className="duration-card"><h3>24 MONTHS</h3><span>₹1099/MO*</span></div>
          <div className="duration-card"><h3>1 MONTH</h3><span>₹1799/MO*</span></div>
          <p className="effective-note">*Effective Monthly Pricing including Extension, if any</p>
        </div>

        {/* ⭐ COMPARISON — PRO vs PRO PLUS */}
        <div className="comparison-section">
          <h2 className="compare-title">Compare Pro Plans</h2>
          <div className="compare-table">

            <div className="compare-features">
              <div className="empty"></div>
              <div className="empty"></div>
              <div>Gym Access</div>
              <div>Center Coverage</div>
              <div>Yoga / Zumba / HIIT</div>
              <div>Monthly Workout Plan</div>
              <div>Progress Tracking</div>
              <div>Mobile App</div>
              <div>Multi-city Access</div>
              <div>Trainer Session</div>
              <div className="total-label">Total Payable (12M)</div>
            </div>

            {/* PRO — city centers, basic classes, app, workout plan, tracking. No trainer, no multi-city */}
            <div className="compare-plan">
              <h3>PRO</h3>
              <span className="price">₹1199/MO*</span>
              <div>✔</div>
              <div style={{fontSize:"12px"}}>All PRO (city)</div>
              <div style={{fontSize:"12px"}}>Basic only</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <h4>₹14388</h4>
             {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Pro" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Pro", "₹14388")}>
        BUY
      </button>
    );
  }

  return null;
})()}
            </div>

            {/* PRO PLUS — adds multi-city + full classes + 1 trainer session/month */}
            <div className="compare-plan">
              <h3>PRO PLUS</h3>
              <span className="price">₹1704/MO*</span>
              <div>✔</div>
              <div style={{fontSize:"12px"}}>All PRO+ cities</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div style={{fontSize:"12px"}}>1 / month</div>
              <h4>₹20450</h4>
            {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Pro Plus" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Pro Plus", "₹20450")}>
        BUY
      </button>
    );
  }

  return null;
})()}
            </div>

          </div>
        </div>

        <div className="plan-toggle-section">
          <div className="plan-toggle-container">
            <div
              className={`toggle-card ${activePlan === "plus" ? "active" : ""}`}
              onClick={() => setActivePlan("plus")}
            >
              <h3>PRO PLUS</h3>
              <p>Multi-city + Trainer Session</p>
            </div>
            <div
              className={`toggle-card ${activePlan === "basic" ? "active" : ""}`}
              onClick={() => setActivePlan("basic")}
            >
              <h3>PRO</h3>
              <p>City-wide PRO Centers</p>
            </div>
          </div>
        </div>

       <PlanSlider
  activePlan={activePlan}
  plusPlans={plusPlans}
  basicPlans={basicPlans}
  membershipType="Pro"
  hasMembership={hasMembership}
  membership={membership}
/>
      </div>

      <Footer />
    </div>
  );
};

export default Pro;
