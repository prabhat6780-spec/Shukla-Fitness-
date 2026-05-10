import { useNavigate } from "react-router-dom";
import "../css/CategoryNavbar.css";

const categories = [
  "New Arrivals",
  "Men",
  "Women",
  "Apparel",
  "Footwear",
  "Equipment",
  "Accessories",
  "Supplements"
];

const CategoryNavbar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {

    if (cat === "New Arrivals") {
      navigate("/shop");
    }

    // 👕 MEN
    else if (cat === "Men") {
      navigate("/shop?category=apparel&subCategory=men");
    }

    // 👕 WOMEN
    else if (cat === "Women") {
      navigate("/shop?category=apparel&subCategory=women");
    }

    // 👕 APPAREL
    else if (cat === "Apparel") {
      navigate("/shop?category=apparel");
    }

    // 👟 FOOTWEAR
    else if (cat === "Footwear") {
      navigate("/shop?category=footwear");
    }

    // 🏋 EQUIPMENT
    else if (cat === "Equipment") {
      navigate("/shop?category=equipment");
    }

     if (cat === "Weighing Scale") {
    navigate("/shop?category=accessories&subCategory=weighing_scale");
    return;
  }

    // 🎒 ACCESSORIES
    else if (cat === "Accessories") {
      navigate("/shop?category=accessories");
    }

    // 💊 SUPPLEMENTS
    else if (cat === "Supplements") {
      navigate("/shop?category=supplements");
    }
  };

  return (
    <div className="shop-category-nav">
      {categories.map((cat, index) => (
        <span
          key={index}
          className="shop-category-item"
          onClick={() => handleCategoryClick(cat)}
        >
          {cat}
        </span>
      ))}
    </div>
  );
};

export default CategoryNavbar;