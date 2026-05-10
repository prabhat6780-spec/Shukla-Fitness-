import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRole from "../hooks/useRole";
const PlanSlider = ({
  activePlan,
  plusPlans = [],
  basicPlans = [],
  membershipType = "Basic",
  hasMembership = false,
  membership = null
}) => {

  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const [slideIndex, setSlideIndex] = useState(0);

  const plans = activePlan === "plus" ? plusPlans : basicPlans;

  // exact plan name
  const thisPlanName =
    activePlan === "plus"
      ? `${membershipType} Plus`
      : membershipType;

  // check exact match
  const isThisPlanActive = (plan) => {
    if (!hasMembership || !membership) return false;

    return (
      membership.planName === thisPlanName &&
      membership.duration === plan.month
    );
  };

  const handleBuy = (plan) => {
    if (hasMembership) {
      alert("You already have an active membership.");
      return;
    }

    navigate("/membership-payment", {
      state: {
        planType: membershipType,
        planName: thisPlanName,
        month: plan.month,
        price: plan.price,
        image: "/photos/Paymentphotomembership2.png"
      }
    });

    window.scrollTo(0, 0);
  };

  const renderCard = (p, i) => {
    const active = isThisPlanActive(p);

    return (
      <div
        key={i}
        className={`plan-card1 ${activePlan === "plus" ? "purple" : "yellow"}`}
      >
        <h1>{p.month}</h1>
        <span>{p.month === 1 ? "MONTH" : "MONTHS"}</span>
        <h2>{p.price}</h2>
        <p>{p.per}</p>

       {active ? (
  <div className="active-badge">✔ Active Plan</div>
) : !hasMembership  || isAdmin? (
  <button onClick={() => handleBuy(p)}>BUY NOW</button>
) : null}
      </div>
    );
  };

  return (
    <div className="plan-slider">

      <button
        className={`slider-btn left ${slideIndex === 0 ? "disabled" : ""}`}
        onClick={() => setSlideIndex(0)}
      >
        ❮
      </button>

      <div className="slider-container">
        {slideIndex === 0 &&
          plans.slice(0, 3).map((p, i) => renderCard(p, i))}

        {slideIndex === 1 &&
          plans.slice(3).map((p, i) => renderCard(p, i))}
      </div>

      <button
        className={`slider-btn right ${slideIndex === 1 ? "disabled" : ""}`}
        onClick={() => setSlideIndex(1)}
      >
        ❯
      </button>

    </div>
  );
};

export default PlanSlider;