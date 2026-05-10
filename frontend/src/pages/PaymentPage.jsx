import React, { useState } from "react";
import "../css/PaymentPage.css";
import CheckoutHeader from "../components/CheckoutHeader";
import PriceSummary from "../components/PriceSummary";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Wallet, Banknote, Truck } from "lucide-react";
import API from "../api";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const totalMRP = location.state?.totalMRP || 0;
  const totalDiscount = location.state?.totalDiscount || 0;
 

  const [method, setMethod] = useState(null);       // sidebar
const [selectedPayment, setSelectedPayment] = useState(null); // radio
  
  const cleanAddress = (addr) => ({
    name: addr?.name,
    house: addr?.house,
    area: addr?.area,
    city: addr?.city,
    state: addr?.state,
    pincode: addr?.pincode,
    mobile: addr?.mobile
  });

const handlePlaceOrder = async () => {
  try {
     const addr = location.state?.address;

// 🔥 CLEAN OBJECT
const cleanedAddr = cleanAddress(addr);

const payload = {
  deliveryAddress: cleanedAddr,
  payment_method: selectedPayment
};

// ✅ CORRECT LOG
console.log("FINAL CLEAN ADDRESS:", cleanedAddr);
    const res = await API.post("/shop/orders/create", payload);
    const finalAmount = res.data.amount; // ✅ ALWAYS USE BACKEND VALUE

    // ✅ COD FLOW
    if (selectedPayment === "cod") {
      navigate("/order-success", {
        replace:true,
        state: {
          orderId: res.data.order_id,
          amount: finalAmount,
          address: payload.deliveryAddress, 
          items: res.data.order?.items 
        }
        
      });
      return;
      
    }

    // 💳 ONLINE FLOW
    const options = {
      key: res.data.razorpay.key,
      amount: res.data.razorpay.amount,
      currency: res.data.razorpay.currency,
      order_id: res.data.razorpay.order_id,

      handler: async function (response) {
        await API.post("/shop/orders/verify-payment", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });

        navigate("/order-success", {
          state: {
            orderId: res.data.order_id,
            amount: finalAmount,
            address: location.state?.address,
            items: res.data.order?.items || []
          }
        });
      }
    };

    new window.Razorpay(options).open();

  } catch (err) {
    alert(err.response?.data?.message || "Order failed ❌");
  }
};


  return (
    <div>
      <CheckoutHeader step="payment" />

      <div className="pay-container">

        {/* LEFT SIDE */}
        <div className="pay-left">

          <h2>Choose Payment Mode</h2>

          <div className="pay-box">

            {/* SIDEBAR */}
            <div className="pay-sidebar">

              <div
                className={`pay-option ${method === "cod" ? "active" : ""}`}
               onClick={() => {
  setMethod("cod");
  setSelectedPayment(null); // reset
}}
              >
                <Truck size={18} />
                Cash On Delivery
              </div>

              <div
                className={`pay-option ${method === "upi" ? "active" : ""}`}
                onClick={() => {
  setMethod("upi");
  setSelectedPayment(null);
}}
              >
                <Wallet size={18} />
                UPI
              </div>

              <div
                className={`pay-option ${method === "card" ? "active" : ""}`}
                onClick={() => {
  setMethod("card");
  setSelectedPayment(null);
}}
              >
                <CreditCard size={18} />
                Card Payment
              </div>

              <div
                className={`pay-option ${method === "netbanking" ? "active" : ""}`}
                onClick={() => {
  setMethod("netbanking");
  setSelectedPayment(null);
}}
              >
                <Banknote size={18} />
                Net Banking
              </div>

            </div>

            {/* RIGHT CONTENT */}
            <div className="pay-content">

{method === "cod" && (
  <div className="pay-cod-box">

    <h3 className="pay-cod-title">
      Cash On Delivery (Cash/UPI)
    </h3>

    {/* RADIO ROW */}
    <div
      className="pay-cod-option"
      onClick={() => setSelectedPayment("cod")}
    >
      <input
        type="radio"
        checked={selectedPayment === "cod"}
        readOnly
      />

      <div className="pay-cod-text">
        <p className="pay-cod-main">
          Cash on Delivery (Cash/UPI)
        </p>

        {/* ✅ SHOW ONLY WHEN SELECTED */}
        {selectedPayment === "cod" && (
          <p className="pay-cod-sub">
            Pay at your doorstep using Cash or UPI
          </p>
        )}
      </div>

      <div className="pay-cod-icon">₹</div>
    </div>

    {/* ✅ BUTTON ONLY AFTER SELECT */}
    {selectedPayment === "cod" && (
      <button
        className="pay-cod-btn"
        disabled={!selectedPayment}
        onClick={handlePlaceOrder}
      >
        Pay ₹{totalMRP - totalDiscount + 19}
      </button>
    )}

  </div>
)}

              {method === "upi" && (
  <div className="pay-cod-box">

    <h3 className="pay-cod-title">
      UPI (Pay via any App)
    </h3>

    {/* RADIO */}
    <div
      className="pay-cod-option"
      onClick={() => setSelectedPayment("upi")}
    >
      <input
        type="radio"
        checked={selectedPayment === "upi"}
        readOnly
      />

      <div className="pay-cod-text">
        <p className="pay-cod-main">
         Pay using UPI
        </p>
          {selectedPayment === "upi" && (
          <p className="pay-cod-sub">
            Pay securely via Google Pay, PhonePe, Paytm etc.
          </p>
        )}
      </div>
    </div>

    {/* ✅ BUTTON ONLY AFTER SELECT */}
   {selectedPayment === "upi" && (
  <button
    className="pay-cod-btn"
    onClick={handlePlaceOrder}
  >
    Pay ₹{totalMRP - totalDiscount + 19}
  </button>
)}

  </div>
)}

              {method === "card" && (
  <div className="pay-cod-box">

    <h3 className="pay-cod-title">
      Card Payment
    </h3>

    <div
      className="pay-cod-option"
      onClick={() => setSelectedPayment("card")}
    >
      <input
        type="radio"
        checked={selectedPayment === "card"}
        readOnly
      />

      <div className="pay-cod-text">
        <p className="pay-cod-main">
          Debit / Credit Card
        </p>
        {selectedPayment === "card" && (
          <p className="pay-cod-sub">
            Secure payment via Razorpay
          </p>
        )}
      </div>
    </div>

    {selectedPayment === "card" && (
      <button
        className="pay-cod-btn"
        onClick={handlePlaceOrder}
      >
        Pay ₹{totalMRP - totalDiscount + 19}
      </button>
    )}

  </div>
)}

             {method === "netbanking" && (
  <div className="pay-cod-box">

    <h3 className="pay-cod-title">Net Banking</h3>

    {/* SELECT OPTION */}
    <div
      className="pay-cod-option"
      onClick={() => setSelectedPayment("netbanking")}
    >
      <input
        type="radio"
        checked={selectedPayment === "netbanking"}
        readOnly
      />

      <div className="pay-cod-text">
        <p className="pay-cod-main">Pay using Net Banking</p>

        {selectedPayment === "netbanking" && (
          <p className="pay-cod-sub">
            Choose your bank securely via Razorpay
          </p>
        )}
      </div>
    </div>

    {/* BUTTON */}
    {selectedPayment === "netbanking" && (
      <button
        className="pay-cod-btn"
        onClick={handlePlaceOrder}
      >
        Pay ₹{totalMRP - totalDiscount + 19}
      </button>
    )}

  </div>
)}

            </div>

          </div>

          {/* GIFT CARD */}
          <div className="pay-gift">
            <span>Have a Gift Card?</span>
            <button>APPLY</button>
          </div>

        </div>

        {/* RIGHT SIDE (PRICE SUMMARY) */}
        <PriceSummary
          totalMRP={totalMRP}
          totalDiscount={totalDiscount}
        />

      </div>

      {/* PAYMENT ICONS */}
          <div className="addr-footer">
        <div className="addr-payments">
  {[
 "ssl.png",
    "Visa.jpeg",
    "MasterCard.png",
    "amex.png",
    "Dinears.png",
    "net.png",
    "COD.jpg",
    "Rupay.png",
    "Paypal.png",
    "BHIM.png"
    ].map((img, i) => (
    <div className="payment-box" key={i}>
      <img src={`/payments/${img}`} alt="payment" />
    </div>
  ))}
</div>
</div>

    </div>
  );
};

export default PaymentPage;