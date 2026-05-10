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

const Unlimited = () => {
  const navigate = useNavigate();
  const { hasTrial, trialPlan } = useTrial();
  const { hasMembership, membership } = useMembership();
const { isAdmin } = useRole();
  const [activePlan, setActivePlan] = useState("plus");

  const handleComparisonBuy = (planName, price) => {
    navigate("/membership-payment", {
      state: {
        planType: "Unlimited",
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
    { month: 12, price: "₹38450", per: "3204 per month*" },
    { month: 6,  price: "₹30590", per: "5098 per month*" },
    { month: 3,  price: "₹21350", per: "7117 per month*" },
    { month: 1,  price: "₹7499",  per: "-" },
    { month: 24, price: "₹68190", per: "2841 per month*" }
  ];

  const basicPlans = [
    { month: 12, price: "₹32388", per: "2699 per month*" },
    { month: 6,  price: "₹18594", per: "3099 per month*" },
    { month: 3,  price: "₹9597",  per: "3199 per month*" },
    { month: 1,  price: "₹3499",  per: "-" },
    { month: 24, price: "₹50376", per: "2099 per month*" }
  ];

  return (
    <div>
      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      <div className="basic-hero">
        <div className="basic-left">
          <h1>ShuklaPass <span>UNLIMITED</span></h1>
          <ul>
            <li>Unlimited access to all gyms & premium centers</li>
            <li>Dedicated personal trainer (assigned to you)</li>
            <li>Customized diet plan + workout programming</li>
            <li>Monthly fitness assessment</li>
            <li>Full group classes + home workout videos</li>
          </ul>
          <h2>Starting at ₹2699 / month*</h2>
         <div className="basic-buttons">

  {/* 🔥 TRIAL */}
  {(() => {
    const isTrialActive =
      hasTrial && trialPlan === "Unlimited";

    if (isTrialActive && !isAdmin) {
      return <span className="trial-used-badge">✔ Trial Active</span>;
    }

    if (isAdmin || (!hasTrial && !hasMembership)) {
      return (
        <button
          className="trial-btn"
          onClick={() =>
            navigate("/free-trial", { state: { plan: "Unlimited" } })
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
      membership?.planName?.includes("Unlimited");

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
          <img src="/photos/UnlimitedMembership.png" alt="unlimited" />
        </div>
      </div>

      <div className="basic-banner">
        <img src="/photos/unlimitedph.png" alt="unlimited banner" />
      </div>

      <div className="duration-section" id="plans">
        <h2>Choose your ShuklaPass</h2>
        <p>Flexible plans to suit your fitness needs</p>

        <div className="duration-cards">
          <div className="duration-card"><h3>12 MONTHS</h3><span>₹2699/MO*</span></div>
          <div className="duration-card"><h3>6 MONTHS</h3><span>₹3099/MO*</span></div>
          <div className="duration-card"><h3>3 MONTHS</h3><span>₹3199/MO*</span></div>
          <div className="duration-card"><h3>24 MONTHS</h3><span>₹2099/MO*</span></div>
          <div className="duration-card"><h3>1 MONTH</h3><span>₹3499/MO*</span></div>
          <p className="effective-note">*Effective Monthly Pricing including Extension, if any</p>
        </div>

        {/* ⭐ COMPARISON — UNLIMITED vs UNLIMITED PLUS */}
        <div className="comparison-section">
          <h2 className="compare-title">Compare Unlimited Plans</h2>
          <div className="compare-table">

            <div className="compare-features">
              <div className="empty"></div>
              <div className="empty"></div>
              <div>Gym Access</div>
              <div>Full Group Classes</div>
              <div>Customized Diet Plan</div>
              <div>Dedicated Trainer</div>
              <div>Fitness Assessment</div>
              <div>Multi-city Access</div>
              <div>Priority Support</div>
              <div>VIP Check-in</div>
              <div className="total-label">Total Payable (12M)</div>
            </div>

            {/* UNLIMITED — all features including dedicated trainer + diet + assessment. No VIP / multi-city */}
            <div className="compare-plan">
              <h3>UNLIMITED</h3>
              <span className="price">₹2699/MO*</span>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <div className="cross">✖</div>
              <h4>₹32388</h4>
             {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Unlimited" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Unlimited", "₹32388")}>
        BUY
      </button>
    );
  }

  return null;
})()}
            </div>

            {/* UNLIMITED PLUS — adds multi-city + priority support + VIP check-in */}
            <div className="compare-plan">
              <h3>UNLIMITED PLUS</h3>
              <span className="price">₹3204/MO*</span>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <div>✔</div>
              <h4>₹38450</h4>
             {(() => {
  const isActive =
    hasMembership &&
    membership?.planName === "Unlimited Plus" &&
    membership?.duration === 12;

  if (isActive) {
    return <span className="active-badge">✔ Active Plan</span>;
  }

  if (!hasMembership || isAdmin) {
    return (
      <button onClick={() => handleComparisonBuy("Unlimited Plus", "₹38450")}>
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
              <h3>UNLIMITED PLUS</h3>
              <p>Multi-city + VIP Check-in + Priority</p>
            </div>
            <div
              className={`toggle-card ${activePlan === "basic" ? "active" : ""}`}
              onClick={() => setActivePlan("basic")}
            >
              <h3>UNLIMITED</h3>
              <p>Trainer + Diet + All Gyms</p>
            </div>
          </div>
        </div>

       <PlanSlider
  activePlan={activePlan}
  plusPlans={plusPlans}
  basicPlans={basicPlans}
  membershipType="Unlimited"
  hasMembership={hasMembership}
  membership={membership}
/>
      </div>

      <Footer />
    </div>
  );
};

export default Unlimited;
