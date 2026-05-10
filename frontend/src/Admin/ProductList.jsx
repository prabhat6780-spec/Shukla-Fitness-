import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "../css/ProductList.css";
import { FaSearch, FaTimes, FaEdit, FaTrash  } from "react-icons/fa";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await API.get("/shop/admin/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  loadProducts();
}, []);

  // 🔍 Filter
  const filtered = products.filter(p =>
   p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this product?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/shop/admin/products/${id}`);
    alert("Deleted ✅");

    // refresh list
    setProducts(prev => prev.filter(p => p._id !== id));

  } catch (err) {
    console.error(err);
    alert("Error deleting ❌");
  }
};

  return (
    <AdminLayout>
<div className="products-list-page">
<div className="products-list-header">
  <h2 className="products-list-title">All Products</h2>

  <button
    className="add-product-btn"
    onClick={() => navigate("/add-product")}
  >
    + Add Product
  </button>
</div>
<div className="products-list-search-wrapper">

  <FaSearch className="search-icon3" />

  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="products-list-search"
  />

  {search && (
    <FaTimes
      className="clear-icon3"
      onClick={() => setSearch("")}
    />
  )}

</div>
  <div className="products-list-grid">
    {filtered.map(p => (
     <div
  key={p._id}
  className="products-list-card"
>
  <div className="products-list-img-box">

    <img
      src={p.images?.[0]?.url}
      className="products-list-img"
      alt={p.name}
    />

    {/* 🔥 OVERLAY */}
    <div className="products-list-overlay">

      <button
        className="edit-btn"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/products-list/${p._id}`);
        }}
      >
        <FaEdit />
      </button>

      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(p._id);
        }}
      >
        <FaTrash />
      </button>

    </div>
  </div>

  <div className="products-list-name">{p.name}</div>
  <div className="products-list-price">₹{p.price}</div>
</div>
    ))}
  </div>

</div>
    </AdminLayout>
  );
};

export default ProductList;
