import React from "react";
import "../css/CheckoutHeader.css";
import { ShieldCheck } from "lucide-react";

const CheckoutHeader = ({ step = "bag" }) => {
  return (
    <div className="chk-header">

      {/* LOGO */}
      <div className="chk-logo">
        <img src="/photos/Logo6.png" alt="logo" />
      </div>

      {/* STEPS */}
      <div className="chk-steps">

        <div className={`chk-step ${step === "bag" ? "active" : ""}`}>
          BAG
        </div>

        <div className="chk-line"></div>

        <div className={`chk-step ${step === "address" ? "active" : ""}`}>
          ADDRESS
        </div>

        <div className="chk-line"></div>

        <div className={`chk-step ${step === "payment" ? "active" : ""}`}>
          PAYMENT
        </div>

      </div>

      {/* SECURITY */}
      <div className="chk-secure">
        <ShieldCheck size={18} />
        <span>100% SECURE</span>
      </div>

    </div>
  );
};

export default CheckoutHeader;