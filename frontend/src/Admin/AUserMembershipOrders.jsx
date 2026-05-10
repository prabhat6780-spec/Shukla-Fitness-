import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AUserMembershipOrders.css";

const AdminUserMembershipOrders = () => {

  const { userId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: useCallback added
  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get(`/membership/admin/user/${userId}/orders`);
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ FIX: dependency now correct
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <AdminLayout>

      <div className="aumos-container">

        <h2>User Membership Orders</h2>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No membership orders found</p>
        ) : (
          <div className="aumos-list">

            {orders.map(o => {

              const expired = isExpired(o.endDate);

              return (
                <div
                  key={o._id}
                  className="aumos-card"
                  onClick={() =>
                    navigate(`/admin/membership-orders/${o._id}`)
                  }
                >

                  <div className="aumos-left">
                    <h3>{o.planName}</h3>
                    <p>{o.duration} months</p>
                  </div>

                  <div className="aumos-right">
                    <p>₹{o.amount}</p>
                    <span className={`aumos-badge ${expired ? "expired" : "active"}`}>
                      {expired ? "Expired" : "Active"}
                    </span>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </AdminLayout>
  );
};

export default AdminUserMembershipOrders;