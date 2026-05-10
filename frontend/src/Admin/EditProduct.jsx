import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "../css/EditProduct.css";

import {
  FaTag, FaAlignLeft, FaRupeeSign, FaBoxes,
  FaWeightHanging, FaTshirt, FaIndustry, FaTags,
  FaCheckCircle, FaCloudUploadAlt, FaLayerGroup, FaPalette, FaRulerCombined
} from "react-icons/fa";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    tags: ""
  });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  const fileInputRef = useRef();

  // 🔥 LOAD PRODUCT
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await API.get(`/shop/products/${id}`);
        const p = res.data.product;

        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          discountPrice: p.discountPrice || "",
          category: p.category || "supplements",
          subCategory: p.subCategory || "",
          productType: p.productType || "",
          isAvailable: p.isAvailable ?? true,
          weight: p.weight || "",
          brand: p.brand || "",
          tags: p.tags?.join(", ") || ""
        });
        
        setVariants(p.variants || []);
        setExistingImages(p.images || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadProduct();
  }, [id]);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", style: "", size: "", stock: 0 }
    ]);
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // 🔥 NEW IMAGES
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  setImages(prev => {
    const updated = [...prev, ...files];

    if (updated.length > 5) {
      alert("Max 5 images allowed ⚠️");
      return prev;
    }

    return updated;
  });

  e.target.value = null;
};
  // 🔥 REMOVE EXISTING IMAGE
  const handleRemoveImage = (public_id) => {
    setRemoveImages(prev => [...prev, public_id]);

    setExistingImages(prev =>
      prev.filter(img => img.public_id !== public_id)
    );
  };

  const removeNewImage = (index) => {
  setImages(prev => prev.filter((_, i) => i !== index));
};
const handleDrop = (e) => {
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);

  setImages(prev => {
    const updated = [...prev, ...files];

    if (updated.length > 5) {
      alert("Max 5 images allowed ⚠️");
      return prev;
    }

    return updated;
  });
};

const handleDragOver = (e) => e.preventDefault();
  



// 🔥 SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return; // 🔥 prevent double click

  setLoading(true);

  const data = new FormData();

 const allowedFields = [
  'name', 'description', 'price', 'discountPrice',
  'category', 'subCategory', 
  'isAvailable', 'weight',  'brand', 'tags', 'productType'
];

allowedFields.forEach(key => {
  let value = form[key];

  // 🔥 FIX null issue
  if (value === "" || value === "null") {
    value = null;
  }

  data.append(key, value);
});
 data.append("variants", JSON.stringify(variants));

  if (form.size) {
    data.set("size", form.size.split(",").map(s => s.trim()));
  }

  if (form.tags) {
    data.set("tags", form.tags.split(",").map(t => t.trim()));
  }

  images.forEach(img => data.append("images", img));

  data.append("removeImages", JSON.stringify(removeImages));

  try {
    await API.put(`/shop/admin/products/${id}`, data);
alert("Updated ✅");

// 🔥 redirect to product list
navigate("/products-list");   // ✅ your product list route

// optional reset (not needed because leaving page)
fileInputRef.current.value = "";
setImages([]);
setRemoveImages([]);

  } catch (err) {
    console.error(err);
    alert("Error ❌");
  } finally {
    setLoading(false); // 🔥 always reset
  }
};

  return (
    <AdminLayout>
      <div className="edit-product-container">

        <h2 className="edit-product-title">
          <FaBoxes /> Edit Product
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label><FaTag /> Name:</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><FaAlignLeft /> Description:</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><FaRupeeSign /> Price:</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><FaRupeeSign /> Discount:</label>
            <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} />
          </div>

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
<div className="form-group">
  <label>  <FaTshirt /> Product Type:
</label>

  <select
    name="productType"
    value={form.productType}
    onChange={handleChange}
  >
    <option value="">Select Type</option>

    {/* Apparel */}
    <option value="tshirt">T-Shirt</option>
    <option value="shorts">Shorts</option>
    <option value="joggers">Joggers</option>
    <option value="set">Set (Top + Bottom)</option>
    <option value="compression">Compression</option>
    <option value="Sport Bra">Sport Bra</option>

    {/* Accessories */}
    <option value="bag">Bag</option>
    <option value="shaker">Shaker</option>
    <option value="gloves">Gloves</option>
    <option value="gym_mat">Gym Mat</option>
    <option value="cap">Cap</option>
    <option value="socks">Socks</option>
      <option value="grip-strengthener">Grip Strengthener</option>

    {/* Supplements */}
    <option value="creatine">Creatine</option>

    {/* Footwear */}
    <option value="shoes">Shoes</option>

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

        <div className="variant-field-row">
          <span className="variant-label">
            <FaPalette /> Color:
          </span>
          <input
            value={v.color}
            onChange={(e) =>
              handleVariantChange(i, "color", e.target.value)
            }
          />
        </div>

        <div className="variant-field-row">
          <span className="variant-label">
            <FaLayerGroup /> Style:
          </span>
          <input
            value={v.style}
            onChange={(e) =>
              handleVariantChange(i, "style", e.target.value)
            }
          />
        </div>

        <div className="variant-field-row">
          <span className="variant-label">
            <FaRulerCombined /> Size:
          </span>
          <input
            value={v.size}
            onChange={(e) =>
              handleVariantChange(i, "size", e.target.value)
            }
          />
        </div>

        <div className="variant-field-row">
          <span className="variant-label">
            <FaBoxes /> Stock:
          </span>
          <input
            type="number"
            value={v.stock}
            onChange={(e) =>
              handleVariantChange(i, "stock", e.target.value)
            }
          />
        </div>

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


          <div className="form-group">
            <label><FaIndustry /> Brand:</label>
            <input name="brand" value={form.brand} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><FaTags /> Tags:</label>
            <input name="tags" value={form.tags} onChange={handleChange} />
          </div>

          <div className="form-group checkbox-group">
            <label><FaCheckCircle /> Available:</label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
          </div>

          {/* EXISTING IMAGES */}
        {/* EXISTING IMAGES */}
<h4>Images</h4>

<div className="edit-product-images">

  {/* OLD IMAGES */}
  {existingImages.map(img => (
    <div key={img.public_id} className="img-box1">
      <img src={img.url} />
      <button onClick={() => handleRemoveImage(img.public_id)}>❌</button>
    </div>
  ))}

  {/* NEW IMAGES */}
  {images.map((img, i) => (
    <div key={i} className="img-box1">
      <img src={URL.createObjectURL(img)} />
      <button onClick={() => removeNewImage(i)}>❌</button>
    </div>
  ))}

</div>

{/* UPLOAD BOX */}
<div
  className="file-upload-box"
  onClick={() => fileInputRef.current.click()}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>

  <FaCloudUploadAlt size={30} />
  <p>Drag & Drop or Click to Upload</p>
  <small>Max 5 images</small>

  <input
    type="file"
    multiple
    ref={fileInputRef}
    onChange={handleImageChange}
    hidden
  />
</div>

          <button 
  className="submit-btn4"
  disabled={loading}
>
  {loading ? "Updating..." : "Update Product"}
</button>

        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProduct;