import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AMOrderDetails.css";

const AdminMembershipOrderDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await
API.get(`/membership/admin/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  // 🔥 PDF DOWNLOAD
  const downloadInvoice = () => {
    const content = `
      Shukla Fitness - Invoice

      Order ID: ${order._id}
      Name: ${order.userId?.name}
      Email: ${order.userId?.email}

      Plan: ${order.planName}
      Duration: ${order.duration} months
      Amount: ₹${order.amount}

      Start: ${new Date(order.startDate).toDateString()}
      End: ${new Date(order.endDate).toDateString()}

      Status: ${order.status}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "membership_invoice.txt";
    a.click();
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  if (!order) return <AdminLayout>Order not found</AdminLayout>;

  const expired = isExpired(order.endDate);

  return (
    <AdminLayout>

      <div className="amod-container">

        {/* BACK */}
        <button className="amod-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Membership Order Details</h2>

        {/* USER */}
        <div className="amod-card">
          <h3>User Info</h3>
          <p><b>Name:</b> {order.userId?.name}</p>
          <p><b>Email:</b> {order.userId?.email}</p>
          <p><b>Phone:</b> {order.userId?.phone}</p>
        </div>

        {/* PLAN */}
        <div className="amod-card">
          <h3>Plan Info</h3>
          <p><b>Plan:</b> {order.planName}</p>
          <p><b>Duration:</b> {order.duration} months</p>
          <p><b>Amount:</b> ₹{order.amount}</p>
        </div>

        {/* DATES */}
        <div className="amod-card">
          <h3>Dates</h3>
          <p><b>Start:</b> {new Date(order.startDate).toDateString()}</p>
          <p><b>End:</b> {new Date(order.endDate).toDateString()}</p>
          <p><b>Days Left:</b> {getDaysLeft(order.endDate)}</p>
        </div>

        {/* STATUS */}
        <div className="amod-card">
          <h3>Status</h3>
          <span className={`amod-badge ${expired ? "expired" : "active"}`}>
            {expired ? "Expired" : "Active"}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="amod-actions">
          <button onClick={downloadInvoice}>
            Download Invoice
          </button>
        </div>

      </div>

    </AdminLayout>
  );
};

export default AdminMembershipOrderDetails;