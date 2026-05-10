import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api";

import "../css/ShopNavbar.css";

const ShopNavbar = () => {
  const navigate = useNavigate();

const [cartCount, setCartCount] = useState(0);
const [animate, setAnimate] = useState(false);
useEffect(() => {
  const fetchCartCount = async () => {
    try {
      const res = await API.get("/shop/cart");
      const items = res.data.items || [];

      const totalQty = items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      setCartCount(totalQty);

      // 🔥 trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);

    } catch (err) {
      console.error(err);
    }
  };

  // initial load
  fetchCartCount();

  // 🔥 LISTEN FOR ADD TO CART EVENT
  const handleCartUpdate = () => {
    fetchCartCount();
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, []);
  const token = localStorage.getItem("token");

  // 👤 USER
  const handleUserClick = () => {
    if (token) navigate("/profile");
    else navigate("/login");
  };

  // 🛒 CART
  const handleCartClick = () => {
    navigate("/cart");
  };


  return (
    <div className="shop-nav">

      {/* LOGO */}
      <div className="shop-nav-left">
        <img
          src="/photos/Logo6.png"
          alt="Shukla Fitness"
          className="shop-logo-img"
          onClick={() => navigate("/")}
        />
      </div>

      {/* RIGHT */}
      <div className="shop-nav-right">

        {/* SEARCH */}
        

        {/* USER */}
        <FaUser
          className="shop-nav-icon"
          onClick={handleUserClick}
        />

        {/* CART */}
       <div className={`cart-icon-wrapper ${animate ? "bounce" : ""}`} onClick={handleCartClick}>
  <FaShoppingCart className="shop-nav-icon" />

  {cartCount > 0 && (
    <span className="cart-badge">
      {cartCount}
    </span>
  )}
</div>

      </div>
    </div>
  );
};

export default ShopNavbar;