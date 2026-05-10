import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../css/Orders.css";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ FIRST useEffect (order)
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await API.get(`/shop/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [id]);

  // ✅ SECOND useEffect (user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ RETURN AFTER ALL HOOKS
  if (!order) return <p className="od-loading">Loading...</p>;
console.log(order.deliveryAddress);
  return (
    <>
      <Navbar showMenu showIcons dark />

      <div className="od-layout">

        {/* Sidebar */}
      <Sidebar user={user} />

        {/* Main Content */}
        <div className="od-content">

          {/* Title */}
          <h2 className="od-title">Order Details</h2>

          {/* Order Info */}
          <div className="od-box od-header">
            <p><strong>Order ID:</strong> {order._id}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`od-status ${order.status}`}>
                {order.status}
              </span>
            </p>

            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          </div>

          {/* Products */}
          <div className="od-box od-products">
            {order.items?.map((item, index) => (
              <div className="od-product" key={index}>

                <img
                  className="od-img"
                  src={item.product_id?.images?.[0]?.url}
                  alt={item.product_id?.name}
                />

                <div className="od-info">
                  <h4>{item.product_id?.name}</h4>

                  <p>Qty: {item.quantity}</p>

                  {item.size && <p>Size: {item.size}</p>}

                  {item.color && (
                    <p>
                      Color:
                      <span
                        className="od-color-box"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.color}
                    </p>
                  )}

                  <p className="od-price">₹{item.price}</p>
                </div>

              </div>
            ))}
          </div>

          {/* Address */}
          <div className="od-box od-address">
            <h4>Delivery Address</h4>
            <p>{order.deliveryAddress?.name}</p>
            <p>{order.deliveryAddress?.house}, {order.deliveryAddress?.area}</p>
            <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
            <p>{order.deliveryAddress?.pincode}</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderDetails;