import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import "../css/ProductDetails.css";
import ShopNavbar from "../components/ShopNavbar";
import CategoryNavbar from "../components/CategoryNavbar";
import Footer from "../components/Footer";
import Recommendation from "../components/Recommendation";
import { Truck, RotateCcw, Repeat, MapPin, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ProductDetails = () => {
  const { productId } = useParams();
const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  // ✅ FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/shop/products/${productId}`);
        const data = res.data.product;

        setProduct(data);
        setSelectedImage(data.images?.[0]?.url || "");

        // default size
        // ✅ NO DEFAULT SIZE
setSelectedSize("");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  const variant = product.variants?.[selectedVariant];

  // ✅ ADD TO CART
const handleAddToCart = async () => {

  const token = localStorage.getItem("token");

  // 🔥 NOT LOGGED IN
  if (!token) {
    alert("Please login first 🔐");

    navigate("/login", {
      state: { from: window.location.pathname }
    });

    return;
  }

  try {
    if (!product || !product._id) {
      alert("Product not found ❌");
      return;
    }

    // ❗ SIZE CHECK
    if (hasSize() && !selectedSize) {
      alert("Please select size ❗");
      return;
    }

    const payload = {
      product_id: product._id,
      quantity: quantity || 1,
      size: selectedSize || null,
      color: variant?.color || null
    };

    await API.post("/shop/cart/add", payload);

    alert("Added to cart ✅");

    // 🔥 cart animation update
    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed ❌");
  }
};

  const checkPincode = async () => {
    if (pincode.length !== 6) {
      setDeliveryMsg("Enter valid pincode ❌");
      return;
    }

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0].Status === "Success") {
        setDeliveryMsg("Delivery available ✅");
      } else {
        setDeliveryMsg("Not serviceable ❌");
      }
    } catch (err) {
      console.error(err);
      setDeliveryMsg("Error checking ❌");
    }
  };
// ✅ GET SIZES
const getSizes = () => {
  return product?.variants?.[selectedVariant]?.size;
};

// ✅ CHECK SIZE EXISTS
const hasSize = () => {
  const sizes = getSizes();
  return sizes && sizes.toString().trim() !== "";
};

  return (
    <div>
      <ShopNavbar />
      <CategoryNavbar />
      <div className="pd-container">
        {/* 🔥 LEFT SIDE */}
        <div className="pd-left">
          <img src={selectedImage} alt="product" className="pd-main-image" />

          <div className="pd-thumbnails">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                className="pd-thumb"
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="pd-right">
          <div className="pd-header">
            <h2 className="pd-title">{product.name}</h2>

            <button
              className="pd-share-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied 🔗");
              }}
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* 💰 PRICE */}
          <div className="pd-price-box">
            <span className="pd-new">
              ₹{product.discountPrice || product.price}
            </span>

            {product.discountPrice && product.discountPrice < product.price && (
              <>
                <span className="pd-old">₹{product.price}</span>
                <span className="pd-off">
                  {Math.round(
                    ((product.price - product.discountPrice) / product.price) *
                      100,
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          {/* 🎨 COLOR */}
          {product.variants?.length > 1 && (
            <div className="pd-section">
              <p>Color:</p>
              <div className="pd-colors">
                {product.variants.map((v, i) => (
                  <span
                    key={i}
                    className={`pd-color ${selectedVariant === i ? "active" : ""}`}
                    style={{ backgroundColor: v.color || "#ccc" }}
                    title={v.color}
                    onClick={() => {
                      setSelectedVariant(i);
                      setSelectedSize(v.size?.[0] || "");
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 📏 SIZE */}
{/* 📏 SIZE */}
{hasSize() && (
  <div className="pd-sizes">
    {getSizes()
      .toString()
      .split(",")
      .map((s, i) => {
        const size = s.trim();

        return (
          <span
            key={i}
            className={`pd-size-box ${
              selectedSize === size ? "active" : ""
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </span>
        );
      })}
  </div>
)}
          {/* 🔢 QUANTITY */}
          <div className="pd-section">
            <p>Quantity:</p>
            <div className="pd-quantity-box">
              <button
                className="pd-qty-btn"
                disabled={quantity === 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>

              <div className="pd-qty-value">{quantity}</div>

              <button
                className="pd-qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* 🛒 BUTTON */}
    <button
  className="pd-add-btn"
  disabled={hasSize() && !selectedSize}
  onClick={handleAddToCart}
>
  {hasSize()
    ? selectedSize
      ? "Add to Cart"
      : "Select Size"
    : "Add to Cart"}
</button>
          <div className="pd-delivery">
            <h3 className="pd-delivery-title">Delivery & Services</h3>
            {/* PINCODE CHECKER */}
            <div className="pd-pincode">
              <MapPin size={18} />
              <input
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button onClick={checkPincode}>Check</button>
            </div>

            {deliveryMsg && <p className="pd-delivery-msg">{deliveryMsg}</p>}
            {/* NEXT DAY DELIVERY */}
            <div className="pd-delivery-box ">
              <div className="pd-icon">
                <Truck size={18} />
              </div>
              <div>
                <b>Next day delivery</b> might be available
              </div>
            </div>

            {/* RETURN */}
            <div className="pd-delivery-item">
              <div className="pd-icon">
                <RotateCcw size={18} />
              </div>
              Easy 15 days return available
            </div>

            {/* EXCHANGE */}
            <div className="pd-delivery-item">
              <div className="pd-icon">
                <Repeat size={18} />
              </div>
              Easy 15 days exchange available
            </div>
            <div className="pd-delivery-item">
              <div className="pd-icon">
                <MapPin size={18} />
              </div>
              Delivery to your location might be available. Check with pincode.
            </div>
            <div className="pd-delivery-item">
              <div className="pd-icon">
                <MapPin size={18} />
              </div>
              COD available
            </div>
          </div>
          <div className="pd-accordion">
            {/* HEADER */}
            <div
              className="pd-accordion-header"
              onClick={() => setShowDescription((prev) => !prev)}
            >
              <span>Description</span>
              <span className="pd-plus">{showDescription ? "−" : "+"}</span>
            </div>

            {/* CONTENT */}
            {showDescription && (
              <div className="pd-accordion-content">
                {product.description || "No description available"}
              </div>
            )}
          </div>
        </div>
      </div>
<Recommendation productId={productId} />
      <Footer />
    </div>
  );
};

export default ProductDetails;
