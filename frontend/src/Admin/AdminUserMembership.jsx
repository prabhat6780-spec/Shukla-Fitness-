import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminUserMembership.css"
import { FaCrown, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

const AdminUserMembership = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

 useEffect(() => {
  const fetchMembership = async () => {
    try {
      console.log("USER ID:", userId);

      const res = await API.get(`/auth/admin/users/${userId}/membership`);

      console.log("DATA:", res.data);

      setUser(res.data.user);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  fetchMembership();
}, [userId]);
const getDaysLeft = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();

  const diff = end - now;
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

const isExpired = (endDate) => {
  return new Date() > new Date(endDate);
};

  if (!user) return <AdminLayout>Loading...</AdminLayout>;

  const m = user.membership;
const handleUpdate = async (type) => {
  try {
    const order = [
      "Basic",
      "Basic Plus",
      "Pro",
      "Pro Plus",
      "Elite",
      "Elite Plus",
      "Unlimited",
      "Unlimited Plus",
      "Home Workout"
    ];

    const currentIndex = order.indexOf(m.planName);

    let newPlan;

    if (type === "upgrade") {
      newPlan = order[currentIndex + 1];
    } else {
      newPlan = order[currentIndex - 1];
    }

    if (!newPlan) {
      alert("No further upgrade/downgrade available");
      return;
    }

    await API.post("/membership/admin/update", {
      userId,
      planName: newPlan,
      duration: m.duration
    });

    alert(`Updated to ${newPlan}`);
    window.location.reload();

  } catch (err) {
    alert(err.response?.data?.message || "Error updating membership");
  }
};
  return (
    <AdminLayout>
     <div className="aum-page">
  <div className="aum-card">

    <h2 className="aum-title">
      <FaCrown /> {user.name}'s Membership
    </h2>

    {!m ? (
      <p className="aum-empty">No membership assigned</p>
    ) : (
      <>
        {/* PLAN + STATUS */}
        <div className="aum-top">
          <div>
            <p><b>Plan:</b> {m.planName}</p>
            <p><b>Status:</b> {m.status}</p>
          </div>

          <span className={`aum-badge ${m.status}`}>
            {m.status}
          </span>
        </div>

        {/* DATE */}
        <p className="aum-date">
          <FaCalendarAlt />
          {new Date(m.startDate).toDateString()}
          {" → "}
          {new Date(m.endDate).toDateString()}
        </p>

        {/* PRICE */}
        <p className="aum-price">
          <FaRupeeSign /> {m.amount}
        </p>

        {/* DAYS LEFT */}
        <div className="aum-days">
          ⏳ {getDaysLeft(m.endDate)} days left
        </div>

        {/* ACTION BUTTONS */}
   <div className="aum-actions">

  {/* UPGRADE */}
  {(() => {
    const order = [
      "Basic",
      "Basic Plus",
      "Pro",
      "Pro Plus",
      "Elite",
      "Elite Plus",
      "Unlimited",
      "Unlimited Plus",
      "Home Workout"
    ];

    const index = order.indexOf(m.planName);

    if (index < order.length - 1) {
      return (
        <button
          className="aum-btn upgrade"
          onClick={() => handleUpdate("upgrade")}
        >
          Upgrade → {order[index + 1]}
        </button>
      );
    }

    return null;
  })()}

  {/* DOWNGRADE */}
  {(() => {
    const order = [
      "Basic",
      "Basic Plus",
      "Pro",
      "Pro Plus",
      "Elite",
      "Elite Plus",
      "Unlimited",
      "Unlimited Plus",
      "Home Workout"
    ];

    const index = order.indexOf(m.planName);

    if (index > 0) {
      return (
        <button
          className="aum-btn downgrade"
          onClick={() => handleUpdate("downgrade")}
        >
          ← Downgrade to {order[index - 1]}
        </button>
      );
    }

    return null;
  })()}

</div>

        {/* EXPIRED ANIMATION */}
        {isExpired(m.endDate) && (
          <div className="aum-expired">
            ❌ Membership Expired
          </div>
        )}
      </>
    )}

  </div>
</div>
    </AdminLayout>
  );
};

export default AdminUserMembership;