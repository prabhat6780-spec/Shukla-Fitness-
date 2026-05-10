import { useEffect, useState } from "react";
import API from "../../api";
import "./UserSpending.css";

const AdminUserSpending = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSpending = async () => {
      try {
        const res = await API.get(`/membership/admin/user/${userId}/spending`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchSpending();
  }, [userId]);

  if (!data) return null;

  return (
    <div className="aus-card">
      <h3>💰 Total Spending</h3>

      <div className="aus-grid">

  <div className="aus-box total">
    <span>Total</span>
    <h2>₹{data.total}</h2>
  </div>

  <div className="aus-box membership">
    <span>Membership</span>
    <h3>₹{data.membershipTotal}</h3>
  </div>

  {/* 🔥 NEW */}
  <div className="aus-box orders">
    <span>Orders</span>
    <h3>₹{data.ordersTotal}</h3>
  </div>

</div>
    </div>
  );
};

export default AdminUserSpending;