import React from "react";
import "../css/PriceSummary.css";

const PriceSummary = ({
  totalMRP = 0,
  totalDiscount = 0,
  platformFee = 19,
  totalAmount: propTotalAmount,
  onCheckout,
  buttonText,
  showHeader = true
}) => {

  const totalAmount = propTotalAmount || totalMRP - totalDiscount + platformFee;

  return (
    <div className="ps-box">

      {showHeader && <h3 className="ps-title">PRICE DETAILS</h3>}

      <div className="ps-row">
        <span>Total MRP</span>
        <span>₹{totalMRP}</span>
      </div>

      <div className="ps-row ps-discount">
        <span>Discount</span>
        <span>-₹{totalDiscount}</span>
      </div>

      <div className="ps-row">
        <span>
          Platform Fee <span className="ps-know">Know More</span>
        </span>
        <span>₹{platformFee}</span>
      </div>

      <hr />

      <div className="ps-row ps-total">
        <span>Total Amount</span>
        <span>₹{totalAmount}</span>
      </div>

      <p className="ps-terms">
        By placing the order, you agree to our{" "}
        <span>Terms of Use</span> and{" "}
        <span>Privacy Policy</span>
      </p>

     {buttonText ? (
  <button
    className="ps-btn"
    onClick={onCheckout}
  >
    {buttonText}
  </button>
) : null}

    </div>
  );
};

export default PriceSummary;