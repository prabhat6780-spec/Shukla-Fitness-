import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminUserOrders.css";

import { FaBoxOpen, FaEye, FaRupeeSign } from "react-icons/fa";

const AdminUserOrders = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
const filteredOrders = orders.filter((o) =>
  o._id.toLowerCase().includes(search.toLowerCase())
);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get(`/shop/admin/users/${userId}/orders`);
        setOrders(res.data.orders);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <AdminLayout>
      <div className="auo-page">
  <div className="auo-card">

    {/* HEADER */}
    <div className="auo-header">
      <h2>
        <FaBoxOpen /> User Orders
      </h2>

      <span className="auo-count">
        {filteredOrders.length} Orders
      </span>
    </div>

    {/* SEARCH */}
    <div className="auo-search-box">
      <input
        type="text"
        placeholder="Search Order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* LIST */}
    {filteredOrders.length === 0 ? (
      <p className="auo-empty">No matching orders found 😢</p>
    ) : (
      <div className="auo-list">
        {filteredOrders.map((o) => (
          <div
            key={o._id}
            className="auo-item"
            onClick={() => navigate(`/admin/orders/${o._id}`)}
          >
            {/* LEFT */}
            <div className="auo-left">
              <div className="auo-id">
                #{o._id.slice(-8)}
              </div>

              <div className="auo-date">
                {new Date(o.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* CENTER */}
            <div className="auo-center">
              <FaRupeeSign />
              {o.totalAmount}
            </div>

            {/* RIGHT */}
            <div className="auo-right">
              <span className={`auo-status ${o.status}`}>
                {o.status}
              </span>

              <FaEye className="auo-view" />
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
</div>
    </AdminLayout>
  );
};

export default AdminUserOrders;