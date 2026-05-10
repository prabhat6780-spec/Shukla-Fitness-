import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipTabs from "../components/MembershipTabs";
import "../css/Membership.css";

const Membership = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      bgClass: "basic-bg",
      title: "BASIC Plan",
      price: "₹699 / Month*",
      path: "/basic",
      badge: null,
      features: [
        { text: "Access to 1 Home Gym Center", included: true },
        { text: "Gym Floor & All Equipment", included: true },
        { text: "Selected Group Classes", included: true },
        { text: "Locker & Changing Room", included: true },
        { text: "Basic Diet Tips", included: true },
        { text: "Mobile App Access", included: false },
        { text: "Multi-city Access", included: false },
        { text: "Personal Trainer", included: false },
      ]
    },
    {
      id: "pro",
      bgClass: "pro",
      title: "PRO Plan",
      price: "₹1199 / Month*",
      path: "/pro",
      badge: null,
      features: [
        { text: "All PRO Gym Centers (City-wide)", included: true },
        { text: "Advanced Strength & Cardio Machines", included: true },
        { text: "Monthly Workout Plan", included: true },
        { text: "Fitness Progress Tracking", included: true },
        { text: "Basic Yoga / Zumba / HIIT", included: true },
        { text: "Mobile App Access", included: true },
        { text: "Multi-city Access", included: false },
        { text: "Personal Trainer", included: false },
      ]
    },
    {
      id: "elite",
      bgClass: "elite",
      title: "ELITE Plan",
      price: "₹1865 / Month*",
      path: "/elite",
      badge: null,
      features: [
        { text: "Unlimited Access — All Centers", included: true },
        { text: "Full Classes (Yoga / Zumba / HIIT)", included: true },
        { text: "Home Workout Video Library", included: true },
        { text: "Monthly Workout Plan & Tracking", included: true },
        { text: "Monthly Fitness Assessment", included: true },
        { text: "Mobile App Access", included: true },
        { text: "Multi-city Access", included: false },
        { text: "Personal Trainer", included: false },
      ]
    },
    {
      id: "unlimited",
      bgClass: "unlimited",
      title: "UNLIMITED Plan",
      price: "₹2699 / Month*",
      path: "/unlimited",
      badge: "PREMIUM",
      features: [
        { text: "All Gyms & Premium Centers", included: true },
        { text: "Dedicated Personal Trainer", included: true },
        { text: "Customized Diet Plan", included: true },
        { text: "Full Classes + Home Videos", included: true },
        { text: "Monthly Fitness Assessment", included: true },
        { text: "Mobile App Access", included: true },
        { text: "Multi-city Access", included: false },
        { text: "VIP Check-in & Priority Support", included: false },
      ]
    }
  ];

  return (
    <div>
      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      <div className="membership-page">

        <h1 className="membership-title">
          Choose Your <span>ShuklaPass</span>
        </h1>
        <div className="membership-video-section">
          <video
            src="/videos/membership1.mp4"
            controls
            autoPlay
            muted
            loop
            className="membership-video"
          />
        </div>


        <div className="plans-container">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.bgClass}`}>

              {/* ⭐ PREMIUM BADGE */}
              {plan.badge && (
                <div className="tag1">{plan.badge}</div>
              )}

              <div>
                <h2>{plan.title}</h2>
                <h3>{plan.price}</h3>

                <ul>
                  {plan.features.map((f, i) => (
                    <li key={i} className={f.included ? "" : "cross"}>
                      {f.included ? "✓" : "✗"} {f.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={() => navigate(plan.path)}>
                Join Now
              </button>

            </div>
          ))}
        </div>

        {/* ⭐ TRIAL BOX */}
        <div className="trial-box">
          <p>Not sure yet? Try <span>7 days free</span> — no credit card needed.</p>
          <button className="big-btn" onClick={() => navigate("/free-trail")}>
            Start Free Trial
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Membership;
