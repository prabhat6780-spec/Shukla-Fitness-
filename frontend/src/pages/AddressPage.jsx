import React, { useEffect, useState } from "react";
import API from "../api";
import "../css/AddressPage.css";
import CheckoutHeader from "../components/CheckoutHeader";
import { useNavigate, useLocation } from "react-router-dom";
import PriceSummary from "../components/PriceSummary";


const AddressPage = () => {
    const navigate= useNavigate();
    const location = useLocation();
    const totalMRP = location.state?.totalMRP || 0;
const totalDiscount = location.state?.totalDiscount || 0;
    
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    pincode: "",
    house: "",
    area: "",
    locality: "",
    city: "",
    state: ""
  });

  // ✅ FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      const res = await API.get("/shop/address");
      setAddresses(res.data || []);
    } catch (err) {
  console.error(err.response?.data || err.message);
  alert(err.response?.data?.message || "Failed ❌");
}
  };
useEffect(() => {
  const init = async () => {
    await fetchAddresses();
  };

  init();
}, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SAVE ADDRESS
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/shop/address/${editingId}`, form);
      } else {
        await API.post("/shop/address", form);
      }

      alert("Address saved ✅");

      setShowForm(false);
      setEditingId(null);

      setForm({
        name: "",
        mobile: "",
        pincode: "",
        house: "",
        area: "",
        locality: "",
        city: "",
        state: ""
      });

      fetchAddresses();

    } catch (err) {
        console.error(err);
      alert("Failed ❌");
    }
  };

  // ✅ EDIT
  const handleEdit = (addr) => {
    setForm(addr);
    setEditingId(addr._id);
    setShowForm(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/shop/address/${id}`);
      fetchAddresses();
    } catch (err) {
        console.error(err);
      alert("Delete failed ❌");
    }
  };

  // ✅ SET DEFAULT
  const setDefault = async (id) => {
    try {
      await API.put(`/shop/address/default/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <CheckoutHeader step="address" />

      <div className="addr-wrapper">
        <div className="addr-left">
            <div className= "addr-container">
  <div className="addr-header">

  {/* LEFT */}
  <div>
    <h2 className="addr-title">Select Delivery Address</h2>
    <p className="addr-subtitle">DEFAULT ADDRESS</p>
  </div>

  {/* RIGHT BUTTON */}
<button
  className="add-address-btn"
  onClick={() => setShowForm(prev => !prev)}
>
  {showForm ? "CANCEL" : "ADD NEW ADDRESS"}
</button>

</div>

        {/* ✅ ADDRESS LIST */}
       {/* ✅ ADDRESS LIST */}
{addresses.length > 0 ? (
  <div className="addr-list">
    {addresses.map((addr) => (
      <div
  className={`addr-card ${
    selectedAddress?._id === addr._id ? "active" : ""
  }`}
  key={addr._id}
>

        {/* 🔝 TOP */}
        <div className="addr-top">
          <div className="addr-radio" />

          <h4>{addr.name}</h4>

          {addr.isDefault && (
            <span className="addr-tag">HOME</span>
          )}
        </div>

        {/* 📍 ADDRESS */}
        <p>
          {addr.house}, {addr.area}, {addr.locality}
        </p>

        <p>
          {addr.city}, {addr.state} - {addr.pincode}
        </p>

        {/* 📞 MOBILE */}
        <p className="addr-mobile">
          Mobile: <b>{addr.mobile}</b>
        </p>

        {/* 🚚 COD */}
        <p className="addr-cod">• Pay on Delivery available</p>

        {/* 🔘 BUTTONS */}
        <div className="addr-actions">

          <button
            className="deliver-btn"
            onClick={() => {
  setSelectedAddress(addr);   // ✅ select for checkout
  setDefault(addr._id);       // (optional) mark as default in DB
}}
          >
            Deliver Here
          </button>

          <button
            className="outline-btn"
            onClick={() => handleEdit(addr)}
          >
            Edit
          </button>

          <button
            className="danger-btn"
            onClick={() => handleDelete(addr._id)}
          >
            Remove
          </button>

        </div>

      </div>
    ))}
  </div>
) : (
  <p>No address found</p>
)}

        {/* ➕ ADD NEW */}
      <button
  className="add-new-btn"
  onClick={() => {
    setShowForm(prev => !prev);

    if (!showForm) {
      setEditingId(null);
    }
  }}
>
  {showForm ? "Cancel" : "+ Add New Address"}
</button>

        {/* 📝 FORM */}
        {showForm && (
          <form className="addr-form" onSubmit={handleSave}>
            <h3>{editingId ? "Edit Address" : "Add Address"}</h3>

            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
            <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />

            <input name="house" placeholder="House / Flat" value={form.house} onChange={handleChange} />
            <input name="area" placeholder="Street / Area" value={form.area} onChange={handleChange} />
            <input name="locality" placeholder="Locality" value={form.locality} onChange={handleChange} />

            <div className="addr-row">
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
            </div>

            <button type="submit" className="save-btn">
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </form>
        )}
      </div>
    </div>
    <div className="addr-right">
<PriceSummary
  totalMRP={totalMRP}
  totalDiscount={totalDiscount}
  onCheckout={() => {
    if (!selectedAddress) {
      alert("Please select address ❗");
      return;
    }

    navigate("/checkout/payment", {
      state: {
        totalMRP,
        totalDiscount,
        address: selectedAddress
      }
    });
  }}
  buttonText="CONTINUE"
/>
</div>


    </div>
    <div className="addr-footer">
        <div className="addr-payments">
  {[
 "ssl.png",
    "Visa.jpeg",
    "MasterCard.png",
    "amex.png",
    "Dinears.png",
    "net.png",
    "COD.jpg",
    "Rupay.png",
    "Paypal.png",
    "BHIM.png"
    ].map((img, i) => (
    <div className="payment-box" key={i}>
      <img src={`/payments/${img}`} alt="payment" />
    </div>
  ))}
</div>
</div>
    </div>
  );
};

export default AddressPage;