import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
      const fetchOrders = async () => {
    try {
      const res = await API.get("/shop/admin/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
    }
  };
    fetchOrders();
  }, []);



  // 🔍 FILTER LOGIC
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || o.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // 📊 STATS
  const total = orders.length;
  const delivered = orders.filter(o => o.status === "delivered").length;
  const pending = orders.filter(o => o.status === "pending").length;

  return (
    <AdminLayout>
      <div className="aop-page">

        {/* 🔥 STATS */}
        <div className="aop-stats">
          <div className="aop-stat">Total: {total}</div>
          <div className="aop-stat delivered">Delivered: {delivered}</div>
          <div className="aop-stat pending">Pending: {pending}</div>
        </div>

        {/* 🔍 FILTER BAR */}
        <div className="aop-filters">
          <input
            type="text"
            placeholder="Search order or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* 📦 TABLE */}
        <div className="aop-card">
          <table className="aop-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.order_id}>
                  <td>{o.order_id.slice(-8)}</td>
                  <td>{o.user?.name}</td>
                  <td>₹{o.totalAmount}</td>

                  <td>
                    <span className={`aop-status ${o.status}`}>
                      {o.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="aop-view-btn"
                      onClick={() => navigate(`/admin/orders/${o.order_id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminOrders;