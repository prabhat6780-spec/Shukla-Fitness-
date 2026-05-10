import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipTabs from "../components/MembershipTabs";
import "./Membership_payment.css";

const Membership_payment = () => {

  const navigate = useNavigate();
  const location = useLocation();

  /* ⭐ PLAN DATA FROM PREVIOUS PAGE */
  const {
    planType = "Basic",
    planName = "Basic",
    month = 12,
    price = "₹8388",
    image = "/photos/Paymentphotomembership2.png"
  } = location.state || {};

  const [startDate, setStartDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  /* ⭐ ALWAYS OPEN PAGE FROM TOP */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ⭐ FEATURES PER PLAN TYPE */
  const planFeatures = {
    Basic: [
      "Access sessions at your home gym center",
      "Selected group fitness classes",
      "Locker & changing room facility"
    ],
    Pro: [
      "Access to all PRO gym centers",
      "Advanced workout machines",
      "Monthly workout plan & progress tracking"
    ],
    Elite: [
      "Unlimited access to all gym centers",
      "Group classes (Yoga, Zumba, HIIT)",
      "Home workout video library",
      "Monthly fitness assessment"
    ],
    Unlimited: [
      "Unlimited access to all gyms & premium centers",
      "Dedicated personal trainer support",
      "Customized diet & workout planning",
      "Priority support & VIP check-in"
    ]
  };

  const features = planFeatures[planType] || planFeatures["Basic"];

  return (
    <div>

      <Navbar showMenu showIcons dark />
      <MembershipTabs />

      <div className="payment-page">

        <div className="payment-container">

          {/* ⭐ LEFT STATIC IMAGE */}
          <div className="payment-left">
            <img src={image} alt="membership" />
          </div>

          {/* ⭐ RIGHT CONTENT */}
          <div className="payment-right">

            <p className="breadcrumb">
              Home &gt; Membership &gt; {planType} &gt; Payment
            </p>

            <h1>
              {month} Month ShuklaPass <span>{planName}</span>
            </h1>

            <div className="price-box">
              <span className="new">{price}</span>
            </div>

            {/* ⭐ START DATE */}
            <div className="start-date-box">

              <div
                className="date-info clickable"
                onClick={() =>
                  document.getElementById("datePicker").showPicker()
                }
              >
                <span>Starts on</span>

                {startDate ? (
                  <h4>
                    📅{" "}
                    {new Date(startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </h4>
                ) : (
                  <h4 className="placeholder">Pick a start date</h4>
                )}
              </div>

              <button
  className="date-btn"
  onClick={() => {

    const token = localStorage.getItem("token");

    // 🔥 NOT LOGGED IN
    if (!token) {
      alert("Please login first 🔐");

      navigate("/login", {
        state: { from: "/membership-payment" }
      });

      return;
    }

    // 🔥 DATE VALIDATION
    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    // ✅ PROCEED
    navigate("/order-summary", {
      state: {
        planType,
        planName,
        duration: month,
        price,
        date: startDate,
        image
      }
    });

  }}
>
  Get pack
</button>

              {/* ⭐ Hidden Date Input */}
              <input
                type="date"
                id="datePicker"
                min={today}
                style={{ display: "none" }}
                onChange={(e) => setStartDate(e.target.value)}
              />

            </div>

            <hr />

            <h2>Offer</h2>
            <p>Extra ₹500 OFF applied</p>

            <h2>About this pack</h2>
            <ul>
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <h2>How it works</h2>
            <p className="desc">
              Book unlimited classes anytime. Visit gym or attend classes
              using your mobile check-in and start workout.
            </p>

            {/* ⭐ WORKOUT SECTION */}
            <div className="workout-section">

              <h2>Workouts</h2>

              <div className="workout-grid">
                <div className="workout-card">
                  <img src="/photos/Yoga.png" alt="Yoga" />
                  <p>Yoga</p>
                </div>
                <div className="workout-card">
                  <img src="/photos/sc.png" alt="S&C" />
                  <p>S&C</p>
                </div>
                <div className="workout-card">
                  <img src="/photos/one8.png" alt="HRX" />
                  <p>HRX Workout</p>
                </div>
                <div className="workout-card">
                  <img src="/photos/Shukla-run.png" alt="Run" />
                  <p>Cult Run</p>
                </div>
                <div className="workout-card">
                  <img src="/photos/dance.png" alt="Dance" />
                  <p>Dance Fitness</p>
                </div>
                <div className="workout-card">
                  <img src="/photos/boxing.png" alt="Boxing" />
                  <p>Boxing Bag Workout</p>
                </div>
              </div>

            </div>

            <div style={{ height: "100px" }}></div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Membership_payment;
