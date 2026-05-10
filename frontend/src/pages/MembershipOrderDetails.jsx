import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../css/MembershipDetail.css";

const MembershipOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Fetch membership order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/membership/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  // ✅ Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (!order) return <p className="md2-loading">Loading...</p>;

  const isExpired = new Date(order.endDate) < new Date();

  return (
    <>
      <Navbar showMenu showIcons dark />

      <div className="md2-layout">

        <Sidebar user={user} />

        <div className="md2-content">

          <h2 className="md2-title">Membership Details</h2>

          {/* HEADER */}
          <div className="md2-box md2-header">
            <p><strong>Membership ID:</strong> {order._id}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`md2-status ${isExpired ? "expired" : "active"}`}>
                {isExpired ? "Expired" : "Active"}
              </span>
            </p>

            <p><strong>Total:</strong> ₹{order.amount}</p>
          </div>

          {/* PLAN */}
          <div className="md2-box md2-plan">

            <div className="md2-product">

              <img
                className="md2-img"
                src={order.image}
                alt={order.planName}
              />

              <div className="md2-info">
                <h4>{order.planName}</h4>

                <p>Duration: {order.duration} Months</p>

                <p>
                  Start: {new Date(order.startDate).toDateString()}
                </p>

                <p>
                  End: {new Date(order.endDate).toDateString()}
                </p>

                <p className="md2-price">₹{order.amount}</p>
              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="md2-box md2-actions">

            <button
              className="md2-btn renew"
              onClick={() => window.location.href = "/membership"}
            >
              🔄 Renew Membership
            </button>

            <button
              className="md2-btn invoice"
              onClick={() => window.print()}
            >
              🧾 Download Invoice
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default MembershipOrderDetail;