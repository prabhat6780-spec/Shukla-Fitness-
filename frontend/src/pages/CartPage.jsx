import React, { useEffect, useState } from "react";
import API from "../api";
import "../css/CartPage.css";
import CheckoutHeader from "../components/CheckoutHeader";
import { X } from "lucide-react";
import Recommendation from "../components/Recommendation";
import { useNavigate } from "react-router-dom";
import PriceSummary from "../components/PriceSummary";

const CartPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await API.get("/shop/cart");

      const items = (res.data.items || []).map(item => ({
        ...item,
        selected: true
      }));

      setCart(items);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ USE EFFECT
useEffect(() => {
  const init = async () => {
    await fetchCart();
  };

  init();
}, []);
useEffect(() => {
  const fetchAddress = async () => {
    try {
      const res = await API.get("/shop/address");

      // find default address
      const defaultAddr = res.data.find(addr => addr.isDefault);

      setDefaultAddress(defaultAddr || null);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAddress();
}, []);
  // ✅ SELECT / UNSELECT
  // ✅ TOGGLE SINGLE ITEM
const toggleSelect = (index) => {
  setCart(prev =>
    prev.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    )
  );
};
// ✅ CHECK IF ALL SELECTED
const allSelected = cart.length > 0 && cart.every(item => item.selected);

// ✅ TOGGLE ALL
const toggleSelectAll = () => {
  setCart(prev =>
    prev.map(item => ({
      ...item,
      selected: !allSelected
    }))
  );
};
  

  // ✅ REMOVE ITEM
const removeItem = async (item, index) => {
  const updated = [...cart];
  updated[index].removing = true;
  setCart(updated);

  setTimeout(async () => {
    try {
      await API.delete("/shop/cart/remove", {
        data: {
          product_id: item.product_id._id,
          size: item.size
        }
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  }, 300);
};

  // ✅ UPDATE QUANTITY
  const updateQty = async (item, newQty) => {
    if (newQty < 1) return;

    try {
      await API.put("/shop/cart/update", {
        product_id: item.product_id._id,
        quantity: newQty,
        size: item.size,
        color: item.color
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ONLY SELECTED ITEMS
  const selectedItems = cart.filter(item => item.selected);

  const totalMRP = selectedItems.reduce(
    (acc, item) => acc + item.product_id.price * item.quantity,
    0
  );

  const totalDiscount = selectedItems.reduce((acc, item) => {
    const price = item.product_id.price;
    const discounted = item.product_id.discountPrice || price;
    return acc + (price - discounted) * item.quantity;
  }, 0);


if (!cart.length) {
  return (
    <div>
      <CheckoutHeader step="bag" />

      <div className="empty-cart-pro">

        {/* 🛒 ICON */}
        <div className="empty-cart-icon">
          🛒
        </div>

        {/* TEXT */}
        <h2>Your cart is empty</h2>
        <p>Looks like you haven’t added anything yet</p>

        {/* BUTTON */}
        <button
          className="continue-btn"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>

      </div>

      {/* 🔥 RECOMMENDATION */}
      <Recommendation title="Popular products for you" />

    </div>
  );
}

const handleCheckout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login?redirect=checkout");
  } else {
    navigate("/checkout/address", {
      state: {
        totalMRP,
        totalDiscount
      }
    });
  }
};
  return (
    <div>
      <CheckoutHeader step="bag" />

      <div className="cart-container">

        {/* LEFT SIDE */}
        <div className="cart-left">
          {defaultAddress && (
  <div className="cart-address-box">

    <div className="cart-address-left">
      <p>
        Deliver to: <b>{defaultAddress.name}</b>, {defaultAddress.pincode}
      </p>

      <p className="cart-address-text">
        {defaultAddress.house}, {defaultAddress.area},{" "}
        {defaultAddress.locality}, {defaultAddress.city},{" "}
        {defaultAddress.state}
      </p>
    </div>

    <button
      className="change-address-btn"
      onClick={() => navigate("/checkout/address")}
    >
      CHANGE ADDRESS
    </button>

  </div>
)}

          {/* ✅ SELECT ALL HEADER */}
<div className="cart-header">

  <label className="cart-select-all">
    <input
      type="checkbox"
      checked={allSelected}
      onChange={toggleSelectAll}
    />

    <span className="cart-selected-text">
      {selectedItems.length} of {cart.length} items selected
    </span>
  </label>

</div>

         {cart.map((item, index) => (
  <div
    className={`cart-item ${item.removing ? "removing" : ""}`}
    key={item._id}
  >

              {/* ✅ CHECKBOX */}
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(index)}
              />

              <img
                src={item.product_id.images?.[0]?.url}
                className="cart-img"
              />

              <div className="cart-details">
                <h4>{item.product_id.name}</h4>

                <p>Size: {item.size}</p>

                {/* 🔥 QUANTITY */}
               <div className="cart-qty">

  {/* ➖ DECREASE */}
  <button
    onClick={() =>
      updateQty(item, item.quantity - 1)
    }
  >
    −
  </button>

  {/* 🔢 VALUE */}
  <span>{item.quantity}</span>

  {/* ➕ INCREASE */}
  <button
    onClick={() =>
      updateQty(item, item.quantity + 1)
    }
  >
    +
  </button>

</div>

                {/* 💰 PRICE */}
               <div className="cart-price-box">

  {/* NEW PRICE */}
  <span className="cart-new-price">
    ₹{item.product_id.discountPrice || item.product_id.price}
  </span>

  {/* OLD PRICE */}
  {item.product_id.discountPrice && (
    <span className="cart-old-price">
      ₹{item.product_id.price}
    </span>
  )}

  {/* DISCOUNT */}
  {item.product_id.discountPrice && (
    <span className="cart-discount">
      {Math.round(
        ((item.product_id.price - item.product_id.discountPrice) /
          item.product_id.price) *
          100
      )}
      % OFF
    </span>
  )}

</div>
              </div>

    {/* ✅ REMOVE BUTTON (ONLY THIS) */}
    <button
      className="cart-remove"
      onClick={() => removeItem(item, index)}
    >
      <X size={18} />
    </button>
            
            </div>
          ))}

        </div>

        {/* RIGHT SIDE */}

<PriceSummary
  totalMRP={totalMRP}
  totalDiscount={totalDiscount}
  onCheckout={handleCheckout}
  buttonText="PLACE ORDER"
/>

      </div>
      <Recommendation
  productId={cart?.[0]?.product_id?._id}
  title="Based on your cart"
/>
    </div>
  );
};

export default CartPage;