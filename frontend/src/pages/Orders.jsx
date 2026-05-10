import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import "../css/Orders.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ FETCH BOTH PRODUCT + MEMBERSHIP ORDERS
  const fetchOrders = useCallback(async () => {
    try {
      const [shopRes, membershipRes] = await Promise.all([
        API.get("/shop/orders"),
        API.get("/membership/orders")
      ]);

      // 🛒 Product Orders
      const shopOrders = shopRes.data.orders.map((o) => ({
        ...o,
        type: "product"
      }));

      // 💳 Membership Orders
      const membershipOrders = membershipRes.data.orders.map((o) => ({
        ...o,
        type: "membership"
      }));

      // 🔥 Merge + Sort (latest first)
      const allOrders = [...shopOrders, ...membershipOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(allOrders);

    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ USER PROFILE
  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
    fetchUser();
  }, [fetchOrders, fetchUser]);

  return (
    <>
      <Navbar showMenu showIcons dark />

      <div className="orders-layout">

        {user && <Sidebar user={user} />}

        <div className="orders-content">
          <div className="orders-container">

            <h2 className="orders-title">My Orders</h2>

            <p className="orders-count">
              Total Orders: <span>{orders.length}</span>
            </p>

            {loading ? (
              <p className="orders-loading">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="orders-empty">No orders found</p>
            ) : (
              <div className="orders-list">

                {orders.map((order) => {
                  return (
                    <div
                      className="orders-card"
                      key={order._id}
                      onClick={() => {
                        if (order.type === "membership") {
                          navigate(`/membership-orders/${order._id}`);
                        } else {
                          navigate(`/orders/${order._id}`);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >

                      {/* HEADER */}
                      <div className="orders-header">
                        <p><strong>ID:</strong> {order._id}</p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <span className={`orders-status ${order.status}`}>
                          {order.status}
                        </span>

                        {/* 🔥 TYPE BADGE */}
                        <span className="order-type">
                          {order.type === "membership" ? "Membership" : "Product"}
                        </span>
                      </div>

                      {/* PRODUCTS / MEMBERSHIP */}
                      <div className="orders-products">

                        {/* 🛒 PRODUCT ORDER */}
                        {order.type !== "membership" &&
                          order.items?.map((item, index) => (
                            <div className="orders-product" key={index}>

                              <img
                                className="orders-img"
                                src={item.product_id?.images?.[0]?.url}
                                alt={item.product_id?.name}
                              />

                              <div className="orders-info">
                                <h4 className="product-title">
                                  {item.product_id?.name}
                                </h4>

                                <p className="product-qty">
                                  Qty: {item.quantity}
                                </p>

                                {item.size && (
                                  <p className="product-meta">
                                    Size: <span>{item.size}</span>
                                  </p>
                                )}

                                {item.color && (
                                  <p className="product-meta">
                                    Color:
                                    <span
                                      className="color-box"
                                      style={{ backgroundColor: item.color }}
                                    ></span>
                                    <span>{item.color}</span>
                                  </p>
                                )}

                                <p className="orders-price">
                                  ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}

                        {/* 💳 MEMBERSHIP ORDER */}
                        {order.type === "membership" && (
                          <div className="orders-product">

                            <img
                              className="orders-img"
                              src={order.image}
                              alt={order.planName}
                            />

                            <div className="orders-info">
                              <h4 className="product-title">
                                {order.planName} Membership
                              </h4>

                              <p className="product-meta">
                                Duration:{" "}
                                <span>{order.duration} Months</span>
                              </p>

                              <p className="product-meta">
                                Start:{" "}
                                <span>
                                  {new Date(order.startDate).toDateString()}
                                </span>
                              </p>

                              <p className="orders-price">
                                ₹{order.amount}
                              </p>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* FOOTER */}
                      <div className="orders-footer">
                        Total: ₹
                        {order.type === "membership"
                          ? order.amount
                          : order.totalAmount}
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;