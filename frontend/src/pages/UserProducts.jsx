import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import "../css/UserProducts.css";
import { FaSearch } from "react-icons/fa";

import ShopNavbar from "../components/ShopNavbar";
import CategoryNavbar from "../components/CategoryNavbar";
import Footer from "../components/Footer";

const UserProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalProducts, setTotalProducts] = useState(0);
const [selectedVariant, setSelectedVariant] = useState({});
const [selectedSize, setSelectedSize] = useState({});
const [quantity, setQuantity] = useState({});

  // ✅ FILTER STATE
  const [filters, setFilters] = useState({
    category: [],
    subCategory: [],
    minPrice: "",
    maxPrice: ""
  });

  // ✅ GET URL PARAMS
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "";
  const subCategory = params.get("subCategory") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  

  // ✅ FETCH PRODUCTS

const fetchProducts = useCallback(async () => {
  try {
    const res = await API.get("/shop/products", {
      params: { category, subCategory, minPrice, maxPrice, sort, page, search }
    });

    setProducts(res.data.products);
    setTotalPages(res.data.totalPages);
    setTotalProducts(res.data.total);
  } catch (err) {
    console.error(err);
  }
}, [category, subCategory, minPrice, maxPrice, sort, page, search]);;

useEffect(() => {
  const delay = setTimeout(() => {
    fetchProducts();
  }, 400);

  return () => clearTimeout(delay);
}, [fetchProducts]); // ✅ clean

  // ✅ SEARCH FILTER

  // ✅ HANDLE CHECKBOX
  const handleCheckbox = (type, value) => {
    setFilters(prev => {
      const exists = prev[type].includes(value);

      return {
        ...prev,
        [type]: exists
          ? prev[type].filter(v => v !== value)
          : [...prev[type], value]
      };
    });
  };

  // ✅ APPLY FILTERS
  const applyFilters = () => {
    const query = new URLSearchParams();

   filters.category.forEach(cat => {
  query.append("category", cat);
});

filters.subCategory.forEach(sub => {
  query.append("subCategory", sub);
});

    if (filters.minPrice) query.append("minPrice", filters.minPrice);
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

    setPage(1); // reset to first page on filter apply

    navigate(`/shop?${query.toString()}`);
  };


  const activeFilterCount =
  filters.category.length +
  filters.subCategory.length +
  (filters.minPrice || filters.maxPrice ? 1 : 0);

const getPageNumbers = () => {
  const pages = [];

  if (totalPages <= 7) {
    return [...Array(totalPages)].map((_, i) => i + 1);
  }

  pages.push(1);

  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (page < totalPages - 2) pages.push("...");

  pages.push(totalPages);

  return pages;
};
const handleAddToCart = async (product) => {
  try {
    const variantIndex = selectedVariant[product._id] || 0;
    const qty = quantity[product._id] || 1;

    const selected = product.variants?.[variantIndex];
    const size = getSelectedSize(product);

    // ❌ block only if size exists
    if (hasSize(product) && !size) {
      alert("Please select size ❗");
      return;
    }

    await API.post("/shop/cart/add", {
      product_id: product._id,
      quantity: qty,
      color: selected?.color || null,
      size: size || null
    });
    // 🔥 trigger animation
window.dispatchEvent(new Event("cartUpdated"));

    alert("Added to cart ✅");

  } catch (err) {
    console.error(err);
  }
};

// ✅ GET SIZES
const getSizes = (product) => {
  return product.variants?.[
    selectedVariant[product._id] || 0
  ]?.size;
};

// ✅ CHECK IF SIZE EXISTS
const hasSize = (product) => {
  const sizes = getSizes(product);
  return sizes && sizes.toString().trim() !== "";
};

// ✅ GET SELECTED SIZE
const getSelectedSize = (product) => {
  return selectedSize[product._id];
};
  
  return (
    <div>
      <ShopNavbar />
      <CategoryNavbar />

      <div className="shop-products-page">

        <div className="shop-products-layout">

          {/* 🔥 SIDEBAR */}
         <div className="shop-sidebar">
       {/* 🔍 SEARCH */}
<div className="sidebar-search">
  <FaSearch />
  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => {
  setSearch(e.target.value);
  setPage(1); // ✅ IMPORTANT (reset pagination on search)
}}
  />
</div>

{/* 📊 TOTAL PRODUCTS */}
<div className="total-products">
  {totalProducts} Products
</div>

  {/* HEADER */}
  <div className="filter-header">
    <div className="filter-title-left">
      ⚙️ Filters
    </div>
    <div className="filter-count">
      {activeFilterCount}
    </div>
  </div>

  {/* GENDER */}
  <div className="filter-box">
    <div
      onClick={() => setOpenSection(openSection === "gender" ? null : "gender")}
      className="filter-title"
    >
      Gender
      <span className={`arrow ${openSection === "gender" ? "open" : ""}`}>⌄</span>
    </div>

    {openSection === "gender" && (
      <div className="filter-options">
        <label>
          <input type="checkbox"   checked={filters.subCategory.includes("men")} onChange={() => handleCheckbox("subCategory", "men")} />
          Men
        </label>

        <label>
          <input type="checkbox"   checked={filters.subCategory.includes("women")} onChange={() => handleCheckbox("subCategory", "women")} />
          Women
        </label>
      </div>
    )}
  </div>

  {/* CATEGORY */}
  <div className="filter-box">
    <div
      onClick={() => setOpenSection(openSection === "category" ? null : "category")}
      className="filter-title"
    >
      Category
      <span className={`arrow ${openSection === "category" ? "open" : ""}`}>⌄</span>
    </div>

    {openSection === "category" && (
      <div className="filter-options">
        <label><input type="checkbox" checked={filters.category.includes("apparel")} onChange={() => handleCheckbox("category", "apparel")} /> Apparel</label>
        <label><input type="checkbox" checked={filters.category.includes("footwear")} onChange={() => handleCheckbox("category", "footwear")} /> Footwear</label>
        <label><input type="checkbox" checked={filters.category.includes("equipment")} onChange={() => handleCheckbox("category", "equipment")} /> Equipment</label>
        <label><input type="checkbox" checked={filters.category.includes("supplements")} onChange={() => handleCheckbox("category", "supplements")} /> Supplements</label>
      </div>
    )}
  </div>

  {/* PRICE */}
  <div className="filter-box">
    <div
      onClick={() => setOpenSection(openSection === "price" ? null : "price")}
      className="filter-title"
    >
      Price
      <span className={`arrow ${openSection === "price" ? "open" : ""}`}>⌄</span>
    </div>

    {openSection === "price" && (
      <div className="filter-options">
        <label>
          <input type="radio" name="price" checked={filters.minPrice === "" && filters.maxPrice === 1000}
            onChange={() => setFilters(prev => ({ ...prev, minPrice: "", maxPrice: 1000 }))} />
          Below ₹1000
        </label>

        <label>
          <input type="radio" name="price" checked={filters.minPrice === 1000 && filters.maxPrice === 3000}
            onChange={() => setFilters(prev => ({ ...prev, minPrice: 1000, maxPrice: 3000 }))} />
          ₹1000 - ₹3000
        </label>

        <label>
          <input type="radio" name="price" checked={filters.minPrice === 3000 && filters.maxPrice === ""}

            onChange={() => setFilters(prev => ({ ...prev, minPrice: 3000, maxPrice: "" }))} />
          Above ₹3000
        </label>
      </div>
    )}
  </div>

  {/* APPLY BUTTON */}
 <button className="apply-btn" onClick={applyFilters}>
    Apply Filters
  </button>

<button
  className="clear-btn"
  onClick={() => {
    setFilters({
      category: [],
      subCategory: [],
      minPrice: "",
      maxPrice: ""
    });

    navigate("/shop");
  }}
>
  Clear Filters
</button>
</div>

          {/* 🔥 RIGHT SIDE */}
          <div className="shop-products-content">

 <div className="shop-top-row">

<h2 className="shop-products-title">
  SHOP FITNESS PRODUCTS
</h2>

  <div className="sort-box">
    <select onChange={(e) => setSort(e.target.value)}>
      <option value="">Sort</option>
      <option value="price_asc">Price: Low → High</option>
      <option value="price_desc">Price: High → Low</option>
    </select>
  </div>

</div>
            {/* PRODUCTS */}
            <div className="shop-products-grid">

  {products.length > 0 ? (
    products.map(p => ( 
      
        // ✅ FIXED
      <div key={p._id} className="shop-product-card">

        <img
          src={p.images?.[0]?.url}
          alt={p.name}
          className="shop-product-img"
          onClick={() => navigate(`/store/${p._id}`)}
        />

        <div className="shop-product-name">{p.name}</div>
<div className="product-bottom">

  {/* PRICE */}
  <div className="shop-product-price-box">
    <span className="new-price">₹{p.discountPrice || p.price}</span>

    {p.discountPrice && p.discountPrice < p.price && (
      <>
        <span className="old-price">₹{p.price}</span>
        <span className="discount">
          {Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF
        </span>
      </>
    )}
  </div>

  {/* 🎨 COLORS */}
  {p.variants?.length > 1 && (
    <div className="variant-colors">
      {p.variants.map((v, i) => (
        <span
          key={i}
          className={`color-dot ${
            (selectedVariant[p._id] ?? 0) === i ? "active" : ""
          }`}
          style={{ backgroundColor: v.color || "#ccc" }}
          title={v.color}
          onClick={() =>
            setSelectedVariant(prev => ({ ...prev, [p._id]: i }))
          }
        />
      ))}
    </div>
  )}
    {/* 🔥 📏 SIZE SELECTOR (ADD HERE) */}
  {hasSize(p) && (
  <div className="shop-sizes">
    {getSizes(p)
      .toString()
      .split(",")
      .map((s, i) => {
        const size = s.trim();

        return (
          <span
            key={i}
            className={`shop-size ${
              getSelectedSize(p) === size ? "active" : ""
            }`}
            onClick={() =>
              setSelectedSize(prev => ({
                ...prev,
                [p._id]: size
              }))
            }
          >
            {size}
          </span>
        );
      })}
  </div>
)}

  {/* 🔢 QUANTITY */}
  <div className="quantity-box">
    <button
      onClick={() =>
        setQuantity(prev => ({
          ...prev,
          [p._id]: Math.max(1, (prev[p._id] || 1) - 1)
        }))
      }
    >
      -
    </button>

    <span>{quantity[p._id] || 1}</span>

    <button
      onClick={() =>
        setQuantity(prev => ({
          ...prev,
          [p._id]: (prev[p._id] || 1) + 1
        }))
      }
    >
      +
    </button>
  </div>

  {/* 🛒 BUTTON */}
  <button
    className="add-to-cart-btn"
    onClick={() => handleAddToCart(p)} 
  >
    Add to Cart
  </button>

</div>
      </div>
    ))
  ) : (
    <p>No products found 😔</p>
  )}

</div>
<div className="pagination">

  {/* PREV */}
  <button
    disabled={page === 1}
    onClick={() => setPage(prev => prev - 1)}
  >
    ⬅
  </button>

  {/* PAGE NUMBERS */}
  {getPageNumbers().map((p, i) => (
    <button
      key={i}
      className={page === p ? "active" : ""}
      onClick={() => p !== "..." && setPage(p)}
      disabled={p === "..."}
    >
      {p}
    </button>
  ))}

  {/* NEXT */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage(prev => prev + 1)}
  >
    ➡
  </button>

</div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default UserProducts;