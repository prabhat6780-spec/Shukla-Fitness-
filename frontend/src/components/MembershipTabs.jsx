import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/MembershipTabs.css";

const MembershipTabs = () => {

  const navigate = useNavigate();
  const location = useLocation();   // ⭐ important

  const tabs = [
    { name: "Basic", path: "/basic" },
    { name: "Pro", path: "/pro" },
    { name: "Elite", path: "/elite" },
    { name: "Unlimited", path: "/unlimited" },
    { name: "Home Workout", path: "/home-workout" },
    { name: "Personal Trainer", path: "/personal-trainer" }
  ];

  return (
    <div className="membership-strip">

      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`membership-tab ${
            location.pathname === tab.path ? "active" : ""
          }`}
          onClick={() => navigate(tab.path)}
        >
          {tab.name}
        </div>
      ))}

    </div>
  );
};

export default MembershipTabs;