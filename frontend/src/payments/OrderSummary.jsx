import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api"; // ✅ USING AXIOS INSTANCE
import "./OrderSummary.css";

const OrderSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  // Extract numeric amount
  const amount =
    Number(state?.price?.replace(/[^\d]/g, "")) || 0;

  // Format date
  const formattedDate = state?.date
    ? new Date(state.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const handlePay = async () => {
    setPaying(true);

    try {
      // ✅ STEP 1 — Create Razorpay Order (Axios)
      const { data: orderData } = await API.post(
        "/membership/create-order",
        { amount }
      );

      // ✅ STEP 2 — Open Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "ShuklaPass",
        description: `${state.planName} — ${state.duration} Month${
          state.duration > 1 ? "s" : ""
        }`,
        order_id: orderData.orderId,

        handler: async (response) => {
          try {
            // ✅ STEP 3 — Verify Payment
            const { data: verifyData } = await API.post(
              "/membership/verify",
              {
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
                planType: state.planType,
                planName: state.planName,
                duration: state.duration,
                amount,
                startDate: state.date,
                image: state.image,
              }
            );

            // ✅ SUCCESS → Navigate to order page
           navigate("/order-success", {
  state: {
    type: "membership", // 🔥 IMPORTANT
    orderId: verifyData.orderId,
    amount,
    membership: verifyData.order
  }
});
          } catch (err) {
            console.error(err);
            alert(
              err?.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        prefill: {
          name:
            localStorage.getItem("userName") || "",
          email:
            localStorage.getItem("userEmail") || "",
        },

        theme: { color: "#ff6b00" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp) => {
        alert(
          "Payment failed: " +
            resp.error.description
        );
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Server error. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="order-page">
      <Navbar showMenu showIcons dark />

      <div className="order-container">
        {/* LEFT */}
        <div className="order-left">
          <h2>Order Summary</h2>

          <div className="order-pack">
            <img
              src={state?.image}
              alt="plan"
            />

            <div>
              <p className="plan-name">
                {state?.planName}
              </p>

              <p>
                Duration: {state?.duration} Month
                {state?.duration > 1 ? "s" : ""}
              </p>

              <h3>{state?.price}</h3>
            </div>
          </div>

          <hr />
        </div>

        {/* RIGHT */}
        <div className="order-right">
          <div className="order-info">
            <h3>Starting {formattedDate}</h3>
            <p>
              Access to your ShuklaPass{" "}
              {state?.planName} plan begins from{" "}
              {formattedDate}.
            </p>
          </div>

          <hr />

          <div className="order-info">
            <h4>Preferred Center</h4>
            <p>ShuklaFit — HSR 19th Main</p>
          </div>

          <hr />

          <div className="order-info">
            <h4>What Else You Get</h4>
            <p>• Extra ₹500 OFF Applied</p>
            <p>• Free 7-day trial included</p>
          </div>

          <hr />

          <div className="price-box">
            <h2>
              Total Payable{" "}
              <span>{state?.price}</span>
            </h2>
          </div>

          <button
            className="pay-btn"
            onClick={handlePay}
            disabled={paying}
          >
            {paying
              ? "Processing..."
              : "Proceed to Pay"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSummary;