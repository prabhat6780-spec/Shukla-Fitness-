import { useState, useEffect } from "react";
import "../components/Admin/AdminTrialManager.css"; // reuse same CSS 🔥
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";

const VALID_PLANS = ["Basic", "Pro", "Elite", "Unlimited", "Home Workout"];

const AdminMembershipManager = () => {

  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  /* ⭐ Grant form */
  const [grantForm, setGrantForm] = useState({
    userId: "",
    planName: "Basic",
    duration: 1,
    amount: 0
  });

  const [grantMsg, setGrantMsg] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  /* ⭐ Search */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  /* ─────────────────────────────── */

  const loadUsers = async () => {
    setLoadingList(true);
    try {
      const res = await API.get("/membership/admin/all");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* 🔍 SEARCH USER */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const res = await API.get(
        `/auth/trial/admin/user-by-email?query=${encodeURIComponent(searchQuery)}`
      );

      if (res.data.success) {
        setSearchResult(res.data.user);
        setGrantForm((f) => ({ ...f, userId: res.data.user._id }));
      } else {
        setSearchResult({ error: res.data.message });
      }

    } catch (err) {
      setSearchResult({
        error: err.response?.data?.message || "User not found"
      });
    } finally {
      setSearching(false);
    }
  };

  /* 🎁 GRANT MEMBERSHIP */
  const handleGrant = async (e) => {
    e.preventDefault();

    if (!grantForm.userId) {
      setGrantMsg("Search user first.");
      return;
    }

    setGrantLoading(true);
    setGrantMsg("");

    try {
      const res = await API.post("/membership/admin/grant", grantForm);

      setGrantMsg(`✅ ${res.data.message}`);
      loadUsers();

      setSearchResult(null);
      setSearchQuery("");

    } catch (err) {
      setGrantMsg(`❌ ${err.response?.data?.message || "Error"}`);
    } finally {
      setGrantLoading(false);
    }
  };

  /* ❌ REVOKE */
  const handleRevoke = async (userId, name) => {
    if (!window.confirm(`Revoke membership for ${name}?`)) return;

    try {
      await API.post("/membership/admin/revoke", { userId });
      loadUsers();
    } catch (err) {
        console.log(err)
      alert("Server error");
    }
  };

  /* UTIL */
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "—";

  const isExpired = (d) => d && new Date() > new Date(d);

  /* ─────────────────────────────── */

  return (
    <AdminLayout>
    <div className="atm-wrap">

      <h2 className="atm-title">💳 Membership Manager</h2>

      {/* ── GRANT ── */}
      <div className="atm-card">
        <h3>Grant Membership</h3>

        {/* SEARCH */}
        <div className="atm-search-row">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="atm-input"
          />
          <button className="atm-btn-search" onClick={handleSearch}>
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* RESULT */}
        {searchResult && !searchResult.error && (
          <div className="atm-search-result found">
            <strong>{searchResult.name}</strong> — {searchResult.email}
          </div>
        )}

        {searchResult?.error && (
          <div className="atm-search-result error">{searchResult.error}</div>
        )}

        {/* FORM */}
        <form className="atm-grant-form" onSubmit={handleGrant}>

          <div className="atm-row">
            <div className="atm-field">
              <label>Plan</label>
              <select
                value={grantForm.planName}
                onChange={(e) =>
                  setGrantForm({ ...grantForm, planName: e.target.value })
                }
                className="atm-select"
              >
                {VALID_PLANS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="atm-field">
              <label>Duration (months)</label>
              <input
                type="number"
                value={grantForm.duration}
                onChange={(e) =>
                  setGrantForm({ ...grantForm, duration: Number(e.target.value) })
                }
                className="atm-input"
              />
            </div>

            <div className="atm-field">
              <label>Amount ₹</label>
              <input
                type="number"
                value={grantForm.amount}
                onChange={(e) =>
                  setGrantForm({ ...grantForm, amount: Number(e.target.value) })
                }
                className="atm-input"
              />
            </div>
          </div>

          <button className="atm-btn-grant">
            {grantLoading ? "Granting..." : "Grant Membership"}
          </button>

          {grantMsg && <p className="atm-msg">{grantMsg}</p>}
        </form>
      </div>

      {/* ── TABLE ── */}
      <div className="atm-card">

        <div className="atm-table-header">
          <h3>All Membership Users ({users.length})</h3>
          <button className="atm-btn-refresh" onClick={loadUsers}>
            ↻ Refresh
          </button>
        </div>

        {loadingList ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No memberships found.</p>
        ) : (
          <table className="atm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.membership?.planName}</td>
                  <td>{formatDate(u.membership?.startDate)}</td>
                  <td>{formatDate(u.membership?.endDate)}</td>
                  <td>
                    {isExpired(u.membership?.endDate)
                      ? "Expired"
                      : "Active"}
                  </td>
                  <td>
                    <button
                      className="atm-btn-revoke"
                      onClick={() => handleRevoke(u._id, u.name)}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
    </AdminLayout>
  );
};

export default AdminMembershipManager;