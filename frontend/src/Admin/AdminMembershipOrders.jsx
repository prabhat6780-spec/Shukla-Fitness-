import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./AdminMembershipOrders.css";

const AdminMembershipOrders = () => {

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, search, filter]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/membership/admin/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTER LOGIC
  const applyFilters = () => {
    let data = [...orders];

    // SEARCH
    if (search) {
      data = data.filter(o =>
        o.userId?.name.toLowerCase().includes(search.toLowerCase()) ||
        o.userId?.email.toLowerCase().includes(search.toLowerCase()) ||
        o.planName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // STATUS FILTER
    if (filter !== "all") {
      data = data.filter(o => {
        const expired = new Date(o.endDate) < new Date();

        if (filter === "active") return !expired;
        if (filter === "expired") return expired;
        if (filter === "failed") return o.status === "failed";

        return true;
      });
    }

    setFiltered(data);
  };

  // 🔥 EXPORT EXCEL
  const exportExcel = () => {
    const data = filtered.map(o => ({
      Name: o.userId?.name,
      Email: o.userId?.email,
      Plan: o.planName,
      Duration: o.duration,
      Amount: o.amount,
      Start: new Date(o.startDate).toLocaleDateString(),
      End: new Date(o.endDate).toLocaleDateString(),
      Status: o.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "MembershipOrders");

    XLSX.writeFile(wb, "membership_orders.xlsx");
  };

  return (
    <AdminLayout>

      <div className="amo-container">

        <h2>💳 Membership Orders</h2>

        {/* 🔍 SEARCH + EXPORT */}
        <div className="amo-topbar">
          <input
            type="text"
            placeholder="Search name / email / plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={exportExcel}>
            Export Excel
          </button>
        </div>

        {/* 🔥 FILTER TABS */}
        <div className="amo-filters">
          {["all", "active", "expired", "failed"].map(f => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="amo-table">

            <div className="amo-head">
              <span>User</span>
              <span>Plan</span>
              <span>Duration</span>
              <span>Amount</span>
              <span>Start</span>
              <span>End</span>
              <span>Status</span>
            </div>

            {filtered.map(o => {
              const expired = new Date(o.endDate) < new Date();

              return (
                <div
                  key={o._id}
                  className="amo-row"
                  onClick={() => navigate(`/admin/membership-orders/${o._id}`)}
                >
                  <div>
                    <p>{o.userId?.name}</p>
                    <small>{o.userId?.email}</small>
                  </div>

                  <span>{o.planName}</span>
                  <span>{o.duration} months</span>
                  <span>₹{o.amount}</span>
                  <span>{new Date(o.startDate).toLocaleDateString()}</span>
                  <span>{new Date(o.endDate).toLocaleDateString()}</span>

                  <span className={`amo-badge ${expired ? "expired" : "active"}`}>
                    {expired ? "expired" : o.status}
                  </span>
                </div>
              );
            })}

          </div>
        )}

      </div>

    </AdminLayout>
  );
};

export default AdminMembershipOrders;