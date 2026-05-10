import { useNavigate } from "react-router-dom";
import "../css/Store.css";
import ShopNavbar from "../components/ShopNavbar";
import CategoryNavbar from "../components/CategoryNavbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import API from "../api";

const Store = () => {
  const navigate = useNavigate();

const banners = [
  {
    img: "/photos/S1.png",
    link: "/shop?category=accessories"
  },
  {
    img: "/photos/S2.png",
    link: "/shop?category=footwear"
  },
  {
    img: "/photos/S3.png",
    link: "/shop?category=apparel"
  }
];

// STATES
const [currentSlide, setCurrentSlide] = useState(0);
const [noTransition, setNoTransition] = useState(false);
const [startX, setStartX] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const [isInteracting, setIsInteracting] = useState(false);

// 🔁 INTERACTION (pause auto-slide for 3 sec)
const triggerInteraction = () => {
  setIsInteracting(true);

  setTimeout(() => {
    setIsInteracting(false);
  }, 3000);
};

// ➡️ NEXT
const handleNext = () => {
  triggerInteraction();
  setCurrentSlide(prev => prev + 1);
};

// ⬅️ PREV
const handlePrev = () => {
  triggerInteraction();

  if (currentSlide === 0) {
    setNoTransition(true);
    setCurrentSlide(banners.length);

    setTimeout(() => {
      setNoTransition(false);
      setCurrentSlide(banners.length - 1);
    }, 50);
  } else {
    setCurrentSlide(prev => prev - 1);
  }
};

// 🔁 AUTO SLIDE
useEffect(() => {
  if (isInteracting) return;

  const interval = setInterval(() => {
    setCurrentSlide(prev => prev + 1);
  }, 3000);

  return () => clearInterval(interval);
}, [isInteracting]);

// 🔁 LOOP RESET (clone fix)
useEffect(() => {
  if (currentSlide === banners.length) {
    setTimeout(() => {
      setNoTransition(true);
      setCurrentSlide(0);

      setTimeout(() => setNoTransition(false), 50);
    }, 600);
  }
}, [currentSlide, banners.length]);

// 📱 TOUCH SWIPE
const handleTouchStart = (e) => {
  setStartX(e.touches[0].clientX);
  setIsDragging(true);
};

const handleTouchEnd = (e) => {
  if (!isDragging) return;

  const diff = startX - e.changedTouches[0].clientX;

  if (diff > 50) handleNext();
  else if (diff < -50) handlePrev();

  setIsDragging(false);
};

// 🖱️ MOUSE DRAG
const handleMouseDown = (e) => {
  setStartX(e.clientX);
  setIsDragging(true);
};

const handleMouseUp = (e) => {
  if (!isDragging) return;

  const diff = startX - e.clientX;

  if (diff > 50) handleNext();
  else if (diff < -50) handlePrev();

  setIsDragging(false);
};
const [menNew, setMenNew] = useState([]);
const [menTshirts, setMenTshirts] = useState([]);
const [menShorts, setMenShorts] = useState([]);

const [womenNew, setWomenNew] = useState([]);
const [womenTshirts, setWomenTshirts] = useState([]);
const [womenShorts, setWomenShorts] = useState([]);

const [accessories, setAccessories] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      // 🔥 MEN
      const menNew = await API.get("/shop/products", {
        params: { category: "apparel", subCategory: "men", new: true }
      });

      const menT = await API.get("/shop/products", {
        params: { category: "apparel", subCategory: "men", productType: "tshirt" }
      });

      const menS = await API.get("/shop/products", {
        params: { category: "apparel", subCategory: "men", productType: "shorts" }
      });

      // 🔥 WOMEN
      const womenNew = await API.get("/shop/products", {
        params: { category: "apparel", subCategory: "women", new: true }
      });

      const womenT = await API.get("/shop/products", {
        params: { category: "apparel", subCategory: "women", productType: "tshirt" }
      });

      const womenS = await API.get("/shop/products", {
        params: { category: "apparel", subCategory: "women", productType: "shorts" }
      });

      // 🔥 ACCESSORIES
      const acc = await API.get("/shop/products", {
        params: { category: "accessories" }
      });

      // SET DATA
      setMenNew(menNew.data.products);
      setMenTshirts(menT.data.products);
      setMenShorts(menS.data.products);

      setWomenNew(womenNew.data.products);
      setWomenTshirts(womenT.data.products);
      setWomenShorts(womenS.data.products);

      setAccessories(acc.data.products);

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);
  return (
    <div>
      <ShopNavbar />
        <CategoryNavbar />

      <div className="store-page">
<div className="store-slider">

  <div
    className={`slider-track ${noTransition ? "no-transition" : ""}`}
    style={{
      transform: `translateX(-${currentSlide * 100}%)`
    }}
      onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}

  onMouseDown={handleMouseDown}
  onMouseUp={handleMouseUp}
  >
    {/* REAL SLIDES */}
    {banners.map((banner, index) => (
  <img
    key={index}
    src={banner.img}
    className="slide"
    onClick={() => navigate(banner.link)}
    style={{ cursor: "pointer" }}
  />
))}

    {/* 🔥 CLONE FIRST */}
    {banners.map((banner, index) => (
  <img
    key={index}
    src={banner.img}
    className="slide"
    onClick={() => navigate(banner.link)}
    style={{ cursor: "pointer" }}
  />
))}
  </div>

  {/* ⬅️ */}
  <button className="slider-btn1 left" onClick={handlePrev}>
    ❮
  </button>

  {/* ➡️ */}
  <button className="slider-btn1 right" onClick={handleNext}>
    ❯
  </button>

</div>

        <h2 className="store-title">Everything Shukla's Fitness</h2>

        <div className="store-grid">

          {/* WOMEN */}
          <div
            className="store-card"
            onClick={() =>
              navigate("/shop?category=apparel&subCategory=women")
            }
          >
            <img src="/photos/Women.png" alt="Women" />
            <p>Women's Wear</p>
          </div>

          {/* MEN */}
          <div
            className="store-card"
            onClick={() =>
              navigate("/shop?category=apparel&subCategory=men")
            }
          >
            <img src="/photos/Men.png" alt="Men" />
            <p>Men's Wear</p>
          </div>

          {/* SHOES */}
          <div
            className="store-card"
            onClick={() =>
              navigate("/shop?category=footwear")
            }
          >
            <img src="/photos/Shoes.png" alt="Shoes" />
            <p>Shoes</p>
          </div>

          <div
  className="store-card"
  onClick={() => navigate("/shop?category=accessories")}
>
  <img src="/photos/Accessories.png" alt="Accessories" />
  <p>Accessories</p>
</div>
<div
  className="store-card"
  onClick={() =>
    navigate("/shop?category=accessories&subCategory=weighing_scale")
  }
>
  <img src="/photos/Weighting.png" alt="Weighing Scale" />
  <p>Weighing Scale</p>
</div>


        </div>
      </div>
<div className="store-section">
<h2 className="section-title">Men’s Activewear</h2>

<div className="activewear-grid">

  <div className="active-card">
    <span>New Arrivals</span>
    <img src={menNew[0]?.images?.[0]?.url} />
  </div>

  <div className="active-card">
    <span>T-Shirts</span>
    <img src={menTshirts[0]?.images?.[0]?.url} />
  </div>

  <div className="active-card">
    <span>Shorts</span>
    <img src={menShorts[0]?.images?.[0]?.url} />
  </div>

</div>


<h2 className="section-title">Women’s Activewear</h2>

<div className="activewear-grid">

  <div className="active-card">
    <span>New Arrivals</span>
    <img src={womenNew[0]?.images?.[0]?.url} />
  </div>

  <div className="active-card">
    <span>T-Shirts</span>
    <img src={womenTshirts[0]?.images?.[0]?.url} />
  </div>

  <div className="active-card">
    <span>Shorts</span>
    <img src={womenShorts[0]?.images?.[0]?.url} />
  </div>

</div>

<h2 className="section-title">Accessories</h2>

<div className="activewear-grid">
  {accessories.slice(0, 3).map(p => (
    <div key={p._id} className="active-card">
      
      <span className="active-tag">{p.name}</span>

      <img
        src={p.images?.[0]?.url}
        alt={p.name}
      />

    </div>
  ))}
</div>
</div>
      <Footer />
    </div>
  );
};

export default Store;