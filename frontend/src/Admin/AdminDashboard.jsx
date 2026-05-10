import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Users,
  Crown,
  IndianRupee,
  TrendingUp
} from "lucide-react";
import { GrUserAdmin } from "react-icons/gr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({});
  const [advanced, setAdvanced] = useState({});

  const navigate = useNavigate();

  useEffect(() => {

    const loadStats = async () => {
      try {
        const res = await API.get("/auth/admin/dashboard");
        setStats(res.data.stats);
        setError("");
const res2 = await API.get("/auth/admin/analytics");
setAnalytics(res2.data);
const res3 = await API.get("/auth/admin/advanced-analytics");
setAdvanced(res3.data);
      } catch (err) {

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load");
        }

      } finally {
        setLoading(false);
      }
    };

    loadStats();

  }, [navigate]);

  useEffect(() => {

  const socket = io("http://localhost:3000");

  socket.on("dashboard-update", (data) => {
    console.log("LIVE UPDATE:", data);

    setStats(prev => ({
      ...prev,
      totalUsers: data.totalUsers,
    }));

  });

  return () => socket.disconnect();

}, []);
  return (
    <AdminLayout>

      <div className="admin-container">
        

        <h2 className="admin-title">🚀 Admin Dashboard</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="admin-error">{error}</p>}

        {!loading && !error && (

          <>
          <div className="admin-analytics">

  {/* 📊 REVENUE CHART */}
  <div className="chart-card">
    <h3>📈 Revenue (Last 6 Months)</h3>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={analytics.months || []}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* 🥇 TOP USERS */}
  <div className="chart-card">
    <h3>🏆 Top Users</h3>

    {(analytics.topUsers || []).map((u, i) => (
      <div key={i} className="top-user">
        #{i + 1} — User ID: {u._id}
        <span>₹{u.total}</span>
      </div>
    ))}
  </div>

</div>

<div className="advanced-grid">

  <div className="adv-card">
    <span>📊 Daily Revenue</span>
    <h2>₹{advanced.dailyRevenue || 0}</h2>
  </div>

  <div className="adv-card">
    <span>📅 Monthly Revenue</span>
    <h2>₹{advanced.monthlyRevenue || 0}</h2>
  </div>

  <div className="adv-card">
    <span>🎯 Retention Rate</span>
    <h2>{advanced.retentionRate || 0}%</h2>
  </div>

  <div className="adv-card">
    <span>🧍 Active Users Today</span>
    <h2>{advanced.activeToday || 0}</h2>
  </div>

</div>
            {/* 🔥 TOP CARDS */}
            <div className="admin-grid">
              <div className="card gradient-dark">
                <GrUserAdmin  size={22} />
  <span>Total Admins</span>
  <h1>{stats.totalAdmins || 0}</h1>
</div>

              <div className="card gradient-orange">
                <Users size={22} />
                <span>Total Users</span>
                <h1>{stats.totalUsers}</h1>
              </div>

              <div className="card gradient-purple">
                <Crown size={22} />
                <span>Active Members</span>
                <h1>{stats.activeMembers}</h1>
              </div>

              <div className="card gradient-green">
                <IndianRupee size={22} />
                <span>Total Revenue</span>
                <h1>₹{stats.totalRevenue}</h1>
              </div>

              <div className="card gradient-blue">
                <TrendingUp size={22} />
                <span>Membership Revenue</span>
                <h1>₹{stats.membershipRevenue}</h1>
              </div>

            </div>

            {/* 🔥 SECOND ROW */}
            <div className="admin-grid">

              <div className="card white">
                <span>Expired Members</span>
                <h2>{stats.expiredMembers}</h2>
              </div>

              <div className="card white">
                <span>Pending Members</span>
                <h2>{stats.pendingMembers}</h2>
              </div>

              <div className="card white">
                <span>Unclaimed Users</span>
                <h2>{stats.unclaimedUsers}</h2>
              </div>

              <div className="card white">
                <span>Product Revenue</span>
                <h2>₹{stats.productRevenue}</h2>
              </div>

            </div>

          </>
        )}

      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;