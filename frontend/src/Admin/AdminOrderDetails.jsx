import { useEffect, useState,  } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminOrderDetails.css"
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBox,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const AdminOrderDetails = () => {
  const  { orderId } = useParams();
  const [order, setOrder] = useState(null);

  // ✅ FETCH FUNCTION (NORMAL)
useEffect(() => {
  if (!orderId) return;

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/shop/admin/orders/${orderId}`);
      setOrder(res.data.order);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    }
  };

  fetchOrder();

}, [orderId]);

  // ✅ STATUS UPDATE
const updateStatus = async (status) => {
  try {
    await API.put(`/shop/admin/orders/${orderId}/status`, { status });

    // refresh manually
    const res = await API.get(`/shop/admin/orders/${orderId}`);
    setOrder(res.data.order);

  } catch (err) {
    console.log(err);
    alert("Failed to update status");
  }
};
`q`
  // ✅ LOADING
  if (!order) {
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );
  }


  return (
    <AdminLayout>
 <div className="aod-page">
  <div className="aod-card">

    {/* ===== TITLE ===== */}
    <h2 className="aod-title">Order Details</h2>

    {/* ===== ORDER INFO ===== */}
    <div className="aod-section">
      <div className="aod-row"><b>Order ID:</b> {order.order_id}</div>

      <div className="aod-row">
        <b>Status:</b>
        <span className={`aod-status-badge aod-${order.status}`}>
          {order.status}
        </span>
      </div>

      <div className="aod-row"><b>Total:</b> ₹{order.totalAmount}</div>
      <div className="aod-row"><b>Payment:</b> {order.payment?.status}</div>
    </div>

    {/* ===== CUSTOMER + ADDRESS ===== */}
    <div className="aod-grid">

      {/* CUSTOMER */}
      <div className="aod-box">
        <h3 className="aod-heading"><FaUser /> Customer</h3>

        <div className="aod-row"><FaUser /> {order.user?.name}</div>
        <div className="aod-row"><MdEmail /> {order.user?.email}</div>
        <div className="aod-row"><FaPhone /> {order.user?.phone}</div>
      </div>

      {/* ADDRESS */}
      <div className="aod-box">
        <h3 className="aod-heading"><FaMapMarkerAlt /> Address</h3>

        <div className="aod-row"><b>{order.deliveryAddress?.name}</b></div>
        <div className="aod-row">{order.deliveryAddress?.house}, {order.deliveryAddress?.area}</div>
        <div className="aod-row">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</div>
        <div className="aod-row">PIN: {order.deliveryAddress?.pincode}</div>
        <div className="aod-row"><FaPhone /> {order.deliveryAddress?.mobile}</div>
      </div>

    </div>

    {/* ===== ITEMS ===== */}
    <h3 className="aod-subtitle">Items</h3>

    {order.items.map((item, i) => {

const original = item.product_id?.price;
const price = item.price;

  const discount = original
    ? Math.round(((original - price) / original) * 100)
    : 0;

  return (
    <div key={i} className="aod-item">

      <img
        src={item.product_id?.images?.[0]?.url}
        className="aod-item-img"
      />

      <div className="aod-item-details">

        <div className="aod-item-name">
          {item.product_id?.name}
        </div>

        <div className="aod-item-qty">
          Qty: {item.quantity}
        </div>

        {/* ✅ PRICE UI */}
        <div className="aod-price-box">
          <span className="aod-price">₹{price}</span>

          {original > price && (
            <>
              <span className="aod-old-price">₹{original}</span>
              <span className="aod-discount">{discount}% OFF</span>
            </>
          )}
        </div>

      </div>
    </div>
  );
})}

    {/* ===== STATUS UPDATE ===== */}
    <div className="aod-status-box">
      <h3>Update Status</h3>

      <select
        className={`aod-status-select aod-${order.status}`}
        value={order.status}
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

  </div>
</div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;