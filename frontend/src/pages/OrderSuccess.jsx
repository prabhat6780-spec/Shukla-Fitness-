import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;
  const amount = location.state?.amount;
  const address = location.state?.address;
  const items = location.state?.items || [];

  // ✅ NEW (membership support)
  const isMembership = location.state?.type === "membership";
  const membership = location.state?.membership || null;

  console.log("SUCCESS PAGE ITEMS:", items);
  console.log("MEMBERSHIP DATA:", membership);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      navigate("/shop");
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  return (
    <div className="success-container">

      {/* LOGO */}
      <img src="/photos/Logo6.png" className="success-logo" />

      {/* SUCCESS ICON */}
      <div className="success-icon">✔</div>

      {/* TITLE */}
      <h1>
        {isMembership
          ? "Membership Activated Successfully! 🎉"
          : "Order Placed Successfully! 🎉"}
      </h1>

      <p>
        {isMembership
          ? "Your membership is now active."
          : "Your order is confirmed and will be delivered soon."}
      </p>

      {/* MAIN CARD */}
      <div className="success-card">

        {/* LEFT IMAGE */}
        <div className="success-left">
          {isMembership ? (
            <img
              src={membership?.image}
              alt="membership"
            />
          ) : (
            <img
              src={items[0]?.product_id?.images?.[0]?.url}
              alt="product"
            />
          )}
        </div>

        {/* RIGHT DETAILS */}
        <div className="success-right">

          <h3>
            {isMembership ? "Membership ID:" : "Order ID:"}{" "}
            <span>{orderId}</span>
          </h3>

          <h2>Total Amount: ₹{amount}</h2>

          <hr />

          {/* 🔥 PRODUCT ADDRESS (unchanged) */}
          {!isMembership && (
            <div className="success-address">
              <h4>Delivery Address</h4>
              <p>{address?.name}</p>
              <p>{address?.house}, {address?.area}</p>
              <p>{address?.city}, {address?.state}</p>
              <p>{address?.pincode}</p>
            </div>
          )}

          {/* 🔥 MEMBERSHIP DETAILS */}
          {isMembership && (
            <div className="success-address">
              <h4>Membership Details</h4>
              <p><b>Plan:</b> {membership?.planName}</p>
              <p><b>Duration:</b> {membership?.duration} Months</p>
              <p><b>Start Date:</b> {new Date(membership?.startDate).toDateString()}</p>
              <p><b>Status:</b> Active ✅</p>
            </div>
          )}

          <hr />

          <p className="delivery-msg">
            {isMembership
              ? "Enjoy your fitness journey 💪"
              : "Estimated Delivery: 3-5 days 🚚"}
          </p>

        </div>
      </div>

      {/* BUTTONS */}
      <div className="success-actions">
        <button onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>

        <button
          onClick={() =>
            navigate(isMembership ? "/orders" : "/orders")
          }
        >
          {isMembership ? "View Membership" : "View Orders"}
        </button>
      </div>

      {/* FOOTER */}
      <div className="success-footer">
        <span>✔ 100% Secure Payment</span>
        <span>🔒 256-bit SSL</span>
        <span>🏦 Net Banking</span>
      </div>
    </div>
  );
};

export default OrderSuccess;