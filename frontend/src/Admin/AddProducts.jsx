import React, { useState } from "react";
import AdminLayout from "../components/Admin/AdminLayout";
import API from "../api";
import "../css/AddProducts.css";
import { FaUpload } from "react-icons/fa";
import {
  FaTag,
  FaAlignLeft,
  FaRupeeSign,
  FaBoxes,
  FaCloudUploadAlt,
  FaWeightHanging,
  FaTshirt,
  FaIndustry,
  FaTags,
  FaCheckCircle, FaPalette, FaLayerGroup, FaRulerCombined,
} from "react-icons/fa";

const AddProducts = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "supplements",
    subCategory: "",
    productType: "",
    isAvailable: true,
    weight: "",
    brand: "",
    tags: "",
  });

  const [variants, setVariants] = useState([]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔥 VARIANT FUNCTIONS
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        style: "",
        size: "",
        stock: 0,
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // 🔥 IMAGE UPLOAD
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => {
      const updated = [...prev, ...files];
      if (updated.length > 5) {
        alert("Max 5 images allowed ⚠️");
        return prev;
      }
      return updated;
    });

    setPreview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const data = new FormData();

    // form fields
    Object.keys(form).forEach((key) => {
      let value = form[key];

      if (value === "" || value === "null") value = null;

      data.append(key, value);
    });

    // 🔥 VARIANTS
    data.append("variants", JSON.stringify(variants));

    // images
    images.forEach((img) => data.append("images", img));

    try {
      await API.post("/shop/admin/products", data);

      alert("Product Added ✅");

      // reset
      setForm({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "supplements",
        subCategory: "",
        productType: "",
        isAvailable: true,
        weight: "",
        brand: "",
        tags: "",
      });

      setVariants([]);
      setImages([]);
      setPreview([]);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="add-product-page-bg">
        <div className="add-product-container">

          <h2 className="add-product-title">
            <FaBoxes /> Add New Product
          </h2>

          <form className="add-product-form" onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="form-group">
              <label><FaTag /> Name:</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label><FaAlignLeft /> Description:</label>
              <textarea name="description" value={form.description} onChange={handleChange} />
            </div>

            {/* PRICE */}
            <div className="form-group">
              <label><FaRupeeSign /> Price:</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><FaRupeeSign /> Discount:</label>
              <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} />
            </div>

            {/* CATEGORY */}
            <div className="form-group">
              <label><FaBoxes /> Category:</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="supplements">Supplements</option>
                <option value="equipment">Equipment</option>
                <option value="accessories">Accessories</option>
                <option value="apparel">Apparel</option>
                <option value="footwear">Footwear</option>
              </select>
            </div>

            {/* SUBCATEGORY */}
            <div className="form-group">
              <label><FaTag /> Sub Category:</label>
              <select name="subCategory" value={form.subCategory} onChange={handleChange}>
                <option value="">None</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="both">Both</option>
                <option value="Weighing_scale">Weighing Scale</option>
              </select>
            </div>

            {/* PRODUCT TYPE */}
            <div className="form-group">
              <label><FaTshirt /> Product Type:</label>

              <select name="productType" value={form.productType} onChange={handleChange}>
                <option value="">None</option>

                <option value="tshirt">T-Shirt</option>
                <option value="shorts">Shorts</option>
                <option value="joggers">Joggers</option>
                <option value="set">Set</option>
                <option value="compression">Compression</option>
                 <option value="Sport Bra">Sport Bra</option>

                <option value="bag">Bag</option>
                <option value="shaker">Shaker</option>
                <option value="gloves">Gloves</option>
                <option value="gym_mat">Gym Mat</option>
                <option value="cap">Cap</option>
                <option value="grip-strengthener">Grip Strengthener</option>

                <option value="creatine">Creatine</option>
                <option value="protein">Protein</option>

                <option value="shoes">Shoes</option>
                 <option value="shoes">Socks</option>
              </select>
            </div>
            

<div className="form-group">

  <label>
    <FaLayerGroup /> Variants:
  </label>

  <button
    type="button"
    className="add-variant-btn"
    onClick={addVariant}
  >
    ➕ Add Variant
  </button>

  <div className="variant-stack">

    {variants.map((v, i) => (
      <div key={i} className="variant-card-full">

        {/* COLOR */}
        <div className="variant-field-row">
          <span className="variant-label">
            <FaPalette /> Color:
          </span>
          <input
            placeholder="Color"
            value={v.color}
            onChange={(e) =>
              handleVariantChange(i, "color", e.target.value)
            }
          />
        </div>

        {/* STYLE */}
        <div className="variant-field-row">
          <span className="variant-label">
            <FaLayerGroup /> Style:
          </span>
          <input
            placeholder="Style"
            value={v.style}
            onChange={(e) =>
              handleVariantChange(i, "style", e.target.value)
            }
          />
        </div>

        {/* SIZE */}
        <div className="variant-field-row">
          <span className="variant-label">
            <FaRulerCombined /> Size:
          </span>
          <input
            placeholder="size"
            value={v.size}
            onChange={(e) =>
              handleVariantChange(i, "size", e.target.value)
            }
          />
        </div>

        {/* STOCK */}
        <div className="variant-field-row">
          <span className="variant-label">
            <FaBoxes /> Stock:
          </span>
          <input
            type="number"
            placeholder="Stock"
            value={v.stock}
            onChange={(e) =>
              handleVariantChange(i, "stock", e.target.value)
            }
          />
        </div>

        {/* REMOVE */}
        <button
          type="button"
          className="remove-variant-btn"
          onClick={() => removeVariant(i)}
        >
          ❌ Remove Variant
        </button>

      </div>
    ))}

  </div>
</div>
          
          <div className="form-group">
              <label><FaWeightHanging /> Weight:</label>
              <input name="weight" value={form.weight} onChange={handleChange} />
            </div>

            {/* BRAND */}
            <div className="form-group">
              <label><FaIndustry /> Brand:</label>
              <input name="brand" value={form.brand} onChange={handleChange} />
            </div>

            {/* TAGS */}
            <div className="form-group">
              <label><FaTags /> Tags:</label>
              <input name="tags" value={form.tags} onChange={handleChange} />
            </div>

            {/* AVAILABLE */}
            <div className="form-group checkbox-group">
              <label><FaCheckCircle /> Available:</label>
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="form-group">
              <label><FaCloudUploadAlt /> Upload Images:</label>

              <label className="file-upload-box">
                <FaUpload size={24} />
                <p>Click or Drag Images</p>
                <input type="file" multiple onChange={handleImageChange} />
              </label>
            </div>

            {/* PREVIEW */}
            <div className="preview-container">
              {preview.map((img, i) => (
                <div key={i} className="img-box">
                  <img src={img} className="preview-img" />
                  <button onClick={() => removeImage(i)}>❌</button>
                </div>
              ))}
            </div>

            <button className="submit-btn5" disabled={loading}>
              {loading ? "Uploading..." : "Add Product"}
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProducts;