import { Search, Scan, User, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

const Navbar = ({
  showMenu = true,
  showIcons = true,
  dark = true
}) => {

  const navigate = useNavigate();

  // ✅ Reactive token
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [cartCount, setCartCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  // ✅ Handle user click
  const handleUserClick = () => {
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // ✅ Sync token changes (important)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Fetch cart ONLY when token exists
  useEffect(() => {

    if (!token) return; // 🔥 prevents early API call

    const fetchCartCount = async () => {
      try {
        const res = await API.get("/shop/cart");
        const items = res.data.items || [];

        const totalQty = items.reduce(
          (acc, item) => acc + item.quantity,
          0
        );

        setCartCount(totalQty);

        // animation
        setAnimate(true);
        setTimeout(() => setAnimate(false), 400);

      } catch (err) {
        console.error("Cart Error:", err);
      }
    };

    fetchCartCount();

    // 🔥 Listen for cart updates
    const handleUpdate = () => fetchCartCount();

    window.addEventListener("cartUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
    };

  }, [token]);

  return (
    <div>
      <div className={`top-navbar ${dark ? "dark-nav" : "light-nav"}`}>

        {/* LEFT LOGO */}
        <div className="nav-left">
          <img src="/photos/Logo2.png" className="nav-logo" />
        </div>

        {/* CENTER MENU */}
        {showMenu && (
          <div className="nav-menu">
            <span onClick={() => navigate("/")}>HOME</span>
            <span onClick={() => navigate("/membership")}>MEMBERSHIP</span>
            <span onClick={() => navigate("/about")}>ABOUT</span>
            <span onClick={() => navigate("/ai")}>AI FITNESS</span>
            <span onClick={() => navigate("/store")}>STORE</span>
          </div>
        )}

        {/* RIGHT ICONS */}
        {showIcons && (
          <div className="nav-right">

            {/* SEARCH */}
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <Search size={22} className="search-icon" />
            </div>

            {/* SCANNER */}
            <Scan
              size={26}
              className="icon"
              onClick={() => navigate("/scanner")}
            />

            {/* USER */}
            {token ? (
              <img
                src="/photos/User1.jpg"
                className="user-avatar"
                onClick={handleUserClick}
              />
            ) : (
              <User size={26} className="icon" onClick={handleUserClick} />
            )}

            {/* CART */}
            <div
              className={`cart-icon-wrapper ${animate ? "bounce" : ""}`}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart size={26} className="icon" />

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;