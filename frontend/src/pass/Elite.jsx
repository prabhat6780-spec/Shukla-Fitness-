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

const Elite = () => {
  const navigate = useNavigate();
  const { hasTrial, trialPlan } = useTrial();
  const { hasMembership, membership } = useMembership();
  const { isAdmin } = useRole();
  const [activePlan, setActivePlan] = useState("plus");

  const handleComparisonBuy = (planName, price) => {
    navigate("/membership-payment", {
      state: {
        planType: "Elite",
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
    { month: 12, price: "₹28450", per: "2371 per month*" },
    { month: 6,  price: "₹20590", per: "3431 per month*" },
    { month: 3,  price: "₹14350", per: "4783 per month*" },
    { month: 1,  price: "₹5499",  per: "-" },
    { month: 24, price: "₹52190", per: "2174 per month*" }
  ];

  const basicPlans = [
    { month: 12, price: "₹22388", per: "1865 per month*" },
    { month: 6,  price: "₹12594", per: "2099 per month*" },
    { month: 3,  price: "₹6597",  per: "2199 per month*" },
    { month: 1,  price: "₹2599",  per: "-" },
    { month: 24, price: "₹38376", per: "1599 per month*" }
  ];

  return (
    <div>
      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      <div className="basic-hero">
        <div className="basic-left">
          <h1>ShuklaPass <span>ELITE</span></h1>
          <ul>
            <li>Unlimited access to ALL gym centers</li>
            <li>Full group classes — Yoga, Zumba, HIIT</li>
            <li>Home workout video library</li>
            <li>Monthly fitness assessment</li>
            <li>Monthly workout plan + progress tracking</li>
          </ul>
          <h2>Starting at ₹1865 / month*</h2>
          <div className="basic-buttons">

  {/* 🔥 TRIAL */}
  {(() => {
    const isTrialActive =
      hasTrial && trialPlan === "Elite";

    if (isTrialActive && !isAdmin) {
      return <span className="trial-used-badge">✔ Trial Active</span>;
    }

    if (isAdmin || (!hasTrial && !hasMembership)) {
      return (
        <button
          className="trial-btn"
          onClick={() =>
            navigate("/free-trial", { state: { plan: "Elite" } })
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
      membership?.planName?.includes("Elite");

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
          <img src="/photos/EliteMembership.png" alt="elite" />
        </div>
      </div>

      <div className="basic-banner">
        <img src="/photos/eliteph.png" alt="elite banner" />
      </div>

      <div className="duration-section" id="plans">
        <h2>Choose your ShuklaPass</h2>
        <p>Flexible plans to suit your fitness needs</p>

        <div className="duration-cards">
          <div className="duration-card"><h3>12 MONTHS</h3><span>₹1865/MO*</span></div>
          <div className="duration-card"><h3>6 MONTHS</h3><span>₹2099/MO*</span></div>
          <div className="duration-card"><h3>3 MONTHS</h3><span>₹2199/MO*</span></div>
          <div className="duration-card"><h3>24 MONTHS</h3><span>₹1599/MO*</span></div>
          <div className="duration-card"><h3>1 MONTH</h3><span>₹2599/MO*</span></div>
          <p className="effective-note">*Effective Monthly Pricing including Extension, if any</p>
        </div>

        {/* ⭐ COMPARISON — ELITE vs ELITE PLUS */}
        <div className="comparison-section">
          <h2 className="compare-title">Compare Elite Plans</h2>
          <div className="compare-table">

            <div className="compare-features">
              <div className="empty"></div>
              <div className="empty"></div>
              <div>Gym Access</div>
              <div>Full Group Classes</div>
              <div>Home Workout Videos</div>
              <div>Monthly Workout Plan</div>
              <div>Fitness Assessment</div>
              <div>Multi-city Access</div>
              <div>Trainer Sessions</div>
              <div>Priority Support</div>
              <div className="total-label">Total Payable (12M)</div>
            </div>

            {/* ELITE — all centers, full classes, home videos, assessment. No multi-city, no trainer */}
            <div className="compare-plan">
              <h3>ELITE</h3>
              <span className="price">₹1865/MO*</span>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <h4>₹22388</h4>
             {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Elite" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Elite", "₹22388")}>
        BUY
      </button>
    );
  }

  return null;
})()}
            </div>

            {/* ELITE PLUS — adds multi-city + 2 trainer sessions + priority support */}
            <div className="compare-plan">
              <h3>ELITE PLUS</h3>
              <span className="price">₹2371/MO*</span>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div style={{fontSize:"12px"}}>2 / month</div>
              <div>✔</div>
              <h4>₹28450</h4>
             {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Elite Plus" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Elite Plus", "₹28450")}>
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
              <h3>ELITE PLUS</h3>
              <p>Multi-city + Trainer + Priority</p>
            </div>
            <div
              className={`toggle-card ${activePlan === "basic" ? "active" : ""}`}
              onClick={() => setActivePlan("basic")}
            >
              <h3>ELITE</h3>
              <p>All Centers + Classes + Videos</p>
            </div>
          </div>
        </div>

       <PlanSlider
  activePlan={activePlan}
  plusPlans={plusPlans}
  basicPlans={basicPlans}
  membershipType="Elite"
  hasMembership={hasMembership}
  membership={membership}
/>
      </div>

      <Footer />
    </div>
  );
};

export default Elite;
