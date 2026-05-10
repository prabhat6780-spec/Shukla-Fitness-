import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import UserSpending from "../components/Admin/UserSpending"
import "./AdminUserDetails.css";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaIdBadge,
  FaEdit,
  FaUser,
  FaTrash,
  FaWeightHanging,
  FaBullseye,
  FaEnvelope, 
  FaKey, 
  FaCreditCard, 
  FaFileInvoice,
  FaUserSlash
} from "react-icons/fa";

import {
  MdEmail,
  MdDateRange,
  MdVerifiedUser,
  MdCardMembership,
  MdAccessTime,
  MdLeaderboard,
  MdMonitorWeight,
} from "react-icons/md";
import { GiBodyHeight, GiChestArmor, GiAbdominalArmor } from "react-icons/gi";
import { IoCheckmarkCircle, IoFitness } from "react-icons/io5";

function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get(`/auth/admin/user/${userId}`);
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  /* ================= DELETE ================= */
  const deleteUser = async () => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/auth/admin/delete-user/${user.user_id}`);
      alert("User Deleted");
      navigate("/admin/users");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };
  const handleMakeAdmin = async () => {
  try {
    await API.put("/auth/admin/make-admin", {
      email: user.email
    });

    alert("User is now Admin ✅");

    // refresh user
    const res = await API.get(`/auth/admin/user/${userId}`);
    setUser(res.data.user);

  } catch (err) {
    alert(err.response?.data?.message || "Failed ❌");
  }
};

const handleRemoveAdmin = async () => {
  try {
    await API.put("/auth/admin/remove-admin", {
      email: user.email
    });

    alert("Admin removed ❌");

    // refresh user
    const res = await API.get(`/auth/admin/user/${userId}`);
    setUser(res.data.user);

  } catch (err) {
    alert(err.response?.data?.message || "Failed ❌");
  }
};
const handleSendMessage = async () => {
  const message = prompt("Enter message:");

  if (!message || message.trim() === "") {
    alert("Message required ❌");
    return;
  }

  if (!user?.user_id) {
    alert("User ID missing ❌");
    return;
  }

  try {
    await API.post("/auth/admin/send-message", {
      userId: user.user_id,   // 🔥 MAIN FIX
      message: message.trim(),
    });

    alert("Message sent ✅");
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message);
  }
};

const handleResetPassword = async () => {
  if (!window.confirm("Reset this user's password?")) return;

  try {
    await API.post("/auth/admin/reset-password", {
      userId: user.user_id,
    });

    alert("Password reset email sent ✅");
  } catch (err) {
    console.log(err);
    alert("Failed to reset password ❌");
  }
};


  /* ================= LOADING ================= */
  if (loading)
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );
  if (!user)
    return (
      <AdminLayout>
        <p>User not found</p>
      </AdminLayout>
    );

  /* ================= UI ================= */
  return (
    <AdminLayout>
      <div className="aud-page">
        {/* ================= TOP PROFILE ================= */}
        <div className="aud-top">
          {/* LEFT */}
          <div className="aud-left">
            <img
              src={user.photo || "/photos/User1.jpg"}
              className="aud-avatar"
              alt="user"
            />

            <div className="aud-info">
              <h2>{user.name}</h2>

              <p className="aud-row">
                <MdEmail /> {user.email}
              </p>

              <div className="aud-badges">
                <span className="role1">
                  <FaUserShield /> {user.role}
                </span>
                <span className={`status ${user.status}`}>
                  <IoCheckmarkCircle /> {user.status}
                </span>
              </div>

              <p className="aud-row">
                <FaPhone /> {user.phone || "N/A"}
              </p>

              <p className="aud-row">
                <MdDateRange /> Joined: {user.createdAt?.slice(0, 10)}
              </p>

              <p className="aud-row">
                <FaMapMarkerAlt /> {user.address || "N/A"}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="aud-right">
            {/* USER ID */}
            <div className="aud-info-row">
              <FaIdBadge />
              <span>
                <b>User ID:</b> {user.user_id}
              </span>
            </div>

            {/* MEMBERSHIP */}
            <div className="aud-info-row">
              <MdCardMembership />
              <span>
                <b>Membership:</b> {user.membership?.plan || "None"}
              </span>
            </div>

            {/* STATUS */}
            <div className="aud-status-box">
              <IoCheckmarkCircle />
              <span>{user.status}</span>
            </div>

            {/* LAST LOGIN */}
            <div className="aud-info-row aud-login-wrap">
  <MdAccessTime />

  <div className="aud-login-content">
    <span className="last-login-text">
      {user.lastLogin || "—"}
    </span>

    {/* 🔥 CONDITIONAL BADGE */}
    {user.isAdminCreated && !user.isClaimed && (
      <span className="not-claimed">
        Not Claimed
      </span>
    )}
  </div>
</div>

            {/* ACTIONS */}

            <div className="top-actions">
              <button
                className="edit-btn1"
                onClick={() => navigate(`/admin/edit-user/${user.user_id}`)}
              >
                <FaEdit /> Edit
              </button>

              <button className="delete-btn1" onClick={deleteUser}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="aud-tabs2">
          <span className="aud-tab3 active">Profile Info</span>

          <span className="aud-tab3 active" onClick={() => navigate(`/admin/user/${user.user_id}/membership`)}>Membership</span>

          <span className="aud-tab3 active">Measurements</span>

          <button 
  className="aud-tab3 active"
onClick={() => navigate(`/admin/user/${user.user_id}/orders`)}>
  Orders
</button>
  <button
    className="aud-tab3 active"
    onClick={() => navigate(`/admin/user/${user.user_id}/membership-orders`)}
  >
    Membership Orders
  </button>
        </div>

        {/* ================= GRID ================= */}
        <div className="aud-grid">
          {/* PERSONAL INFO */}
          <div className="aud-card2">
            <h3 className="aud-card-title">
              <FaUser /> Personal Information
            </h3>

            <div className="aud-info-grid">
              <div className="aud-info-item">
                <FaUser />
                <div>
                  <span>Full Name</span>
                  <strong>{user.name}</strong>
                </div>
              </div>

              <div className="aud-info-item">
                <MdEmail />
                <div>
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>
              </div>

              <div className="aud-info-item">
                <FaPhone />
                <div>
                  <span>Phone</span>
                  <strong>{user.phone}</strong>
                </div>
              </div>

              <div className="aud-info-item">
                <FaUser />
                <div>
                  <span>Gender</span>
                  <strong>{user.gender}</strong>
                </div>
              </div>

              <div className="aud-info-item full">
                <FaMapMarkerAlt />
                <div>
                  <span>Address</span>
                  <strong>{user.address}</strong>
                </div>
              </div>

              <div className="aud-info-item">
                <MdDateRange />
                <div>
                  <span>Birthdate</span>
                  <strong>{user.birthdate}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="aud-card3">
            <h3 className="aud-card-title">
              <FaWeightHanging /> Body Measurements
            </h3>

            <div className="aud-measure-grid">
              <div className="aud-measure-item">
                <GiBodyHeight />
                <div>
                  <span>Height</span>
                  <strong>{user.height} cm</strong>
                </div>
              </div>

              <div className="aud-measure-item">
                <FaWeightHanging />
                <div>
                  <span>Weight</span>
                  <strong>{user.weight} kg</strong>
                </div>
              </div>

              <div className="aud-measure-item">
                <GiChestArmor />
                <div>
                  <span>Chest</span>
                  <strong>{user.chest}</strong>
                </div>
              </div>

              <div className="aud-measure-item">
                <GiAbdominalArmor />
                <div>
                  <span>Abdomen</span>
                  <strong>{user.abdomen}</strong>
                </div>
              </div>

              <div className="aud-measure-item bmi">
                <MdMonitorWeight />
                <div>
                  <span>BMI</span>
                  <strong>{user.bmi}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FITNESS GOALS */}
          <div className="aud-card4">

  <h3 className="aud-card-title">
    <IoFitness /> Fitness Details
  </h3>

  <div className="aud-fitness-grid">

    {/* GOAL */}
    <div className="aud-fitness-item">
      <FaBullseye />
      <div>
        <span>Goal</span>
        <strong>{user.fitnessGoal || "Not set"}</strong>
      </div>
    </div>

    {/* FITNESS LEVEL */}
    <div className="aud-fitness-item">
      <MdLeaderboard />
      <div>
        <span>Level</span>
        <strong>{user.fitnessLevel || "Not set"}</strong>
      </div>
    </div>

    {/* MEMBERSHIP */}
    <div className="aud-fitness-item full">
      <MdCardMembership />
      <div>
        <span>Membership</span>
        <strong>{user.membership?.plan || "No Plan"}</strong>
      </div>
    </div>

  </div>


</div>
<UserSpending userId={user.user_id}/>
</div>
        {/* ================= ACTIONS ================= */}
        <div className="aud-actions2">

  <button className="aud-btn" onClick={handleSendMessage}>
    <FaEnvelope /> Send Message
  </button>

  <button className="aud-btn"  onClick={handleResetPassword}>
    <FaKey /> Reset Password
  </button>

  <button className="aud-btn">
    <FaCreditCard /> Upgrade / Downgrade
  </button>

  <button className="aud-btn">
    <FaFileInvoice /> View Payments
  </button>

  <button className="aud-btn danger" onClick={deleteUser}>
    <FaTrash /> Delete Account
  </button>
{user.role === "admin" ? (
  <button className="aud-btn admin-remove" onClick={handleRemoveAdmin}>
    <FaUserSlash /> Remove Admin
  </button>
) : (
  <button className="aud-btn admin-add" onClick={handleMakeAdmin}>
    <FaUserShield /> Make Admin
  </button>
)}
</div>
      </div>
    </AdminLayout>
  );
}

export default AdminUserDetails;
