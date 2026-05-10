
import { useState, useEffect } from "react";
import "./AdminTrialManager.css";
import API from "../../api";

/*
  ⭐ Admin Trial Manager
  - Search user by email OR name (single input)
  - Grant trial
  - Revoke trial
  - View all trial users
*/

const VALID_PLANS = ["Basic", "Pro", "Elite", "Unlimited", "Home Workout"];

const AdminTrialManager = () => {

  const [trialUsers, setTrialUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  /* ⭐ Grant form */
  const [grantForm, setGrantForm] = useState({
    userId: "",
    plan: "Basic",
    days: 7,
    overwrite: false
  });

  const [grantMsg, setGrantMsg] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  /* ⭐ Search */
  const [searchQuery, setSearchQuery] = useState(""); // ⭐ single input
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  /* ─────────────────────────────── */

  const loadTrialUsers = async () => {
    setLoadingList(true);
    try {
      const res = await API.get("/auth/trial/admin/all");
      setTrialUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTrialUsers();
  }, []);

  /* ─────────────────────────────── */
  /* 🔍 SEARCH USER (EMAIL OR NAME) */
  /* ─────────────────────────────── */

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
      console.error(err);
      setSearchResult({
        error: err.response?.data?.message || "User not found"
      });
    } finally {
      setSearching(false);
    }
  };

  /* ─────────────────────────────── */
  /* 🎁 GRANT TRIAL */
  /* ─────────────────────────────── */

  const handleGrant = async (e) => {
    e.preventDefault();

    if (!grantForm.userId) {
      setGrantMsg("Please search user first.");
      return;
    }

    setGrantLoading(true);
    setGrantMsg("");

    try {
      const res = await API.post("/auth/trial/admin/grant", grantForm);

      setGrantMsg(`✅ ${res.data.message}`);
      loadTrialUsers();

      setSearchResult(null);
      setSearchQuery("");

    } catch (err) {
      setGrantMsg(`❌ ${err.response?.data?.message || "Error"}`);
    } finally {
      setGrantLoading(false);
    }
  };

  /* ─────────────────────────────── */
  /* ❌ REVOKE */
  /* ─────────────────────────────── */

  const handleRevoke = async (userId, name) => {
    if (!window.confirm(`Revoke trial for ${name}?`)) return;

    try {
      await API.delete(`/auth/trial/admin/revoke/${userId}`);
      loadTrialUsers();
    } catch (err) {
      console.log(err)
      alert("Server error");
    }
  };

  /* ─────────────────────────────── */

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      : "—";

  const isExpired = (d) => d && new Date() > new Date(d);

  /* ─────────────────────────────── */
  return (
    <div className="atm-wrap">

      <h2 className="atm-title">🎟️ Free Trial Manager</h2>

      {/* ── GRANT SECTION ── */}
      <div className="atm-card">
        <h3>Grant Free Trial to a User</h3>

        {/* Search by email */}
        <div className="atm-search-row">
         <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="atm-input"
          />
          <button className="atm-btn-search" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Search result */}
        {searchResult && !searchResult.error && (
          <div className="atm-search-result found">
            <span>👤 <strong>{searchResult.name}</strong> — {searchResult.email}</span>
            {searchResult.trial?.plan && (
              <span className="atm-has-trial">
                Has trial: {searchResult.trial.plan} (expires {formatDate(searchResult.trial.expiresAt)})
              </span>
            )}
          </div>
        )}
        {searchResult?.error && (
          <div className="atm-search-result error">{searchResult.error}</div>
        )}

        {/* Grant form */}
        <form className="atm-grant-form" onSubmit={handleGrant}>

          <div className="atm-row">
            <div className="atm-field">
              <label>Plan</label>
              <select
                value={grantForm.plan}
                onChange={(e) => setGrantForm({ ...grantForm, plan: e.target.value })}
                className="atm-select"
              >
                {VALID_PLANS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="atm-field">
              <label>Duration (days)</label>
              <input
                type="number" min="1" max="365"
                value={grantForm.days}
                onChange={(e) => setGrantForm({ ...grantForm, days: Number(e.target.value) })}
                className="atm-input"
              />
            </div>
          </div>

          <label className="atm-checkbox-row">
            <input
              type="checkbox"
              checked={grantForm.overwrite}
              onChange={(e) => setGrantForm({ ...grantForm, overwrite: e.target.checked })}
            />
            Overwrite existing trial if user already has one
          </label>

          <button
            type="submit"
            className="atm-btn-grant"
            disabled={grantLoading || !grantForm.userId}
          >
            {grantLoading ? "Granting..." : "Grant Free Trial"}
          </button>

          {grantMsg && <p className="atm-msg">{grantMsg}</p>}

        </form>
      </div>

      {/* ── ALL TRIAL USERS TABLE ── */}
      <div className="atm-card">
        <div className="atm-table-header">
          <h3>All Users with Free Trials ({trialUsers.length})</h3>
          <button className="atm-btn-refresh" onClick={loadTrialUsers}>↻ Refresh</button>
        </div>

        {loadingList ? (
          <p className="atm-loading">Loading...</p>
        ) : trialUsers.length === 0 ? (
          <p className="atm-empty">No users have a free trial yet.</p>
        ) : (
          <div className="atm-table-wrap">
            <table className="atm-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Started</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Granted By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trialUsers.map((u) => (
                  <tr key={u._id} className={isExpired(u.trial?.expiresAt) ? "atm-row-expired" : ""}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="atm-plan-pill">{u.trial?.plan}</span></td>
                    <td>{formatDate(u.trial?.startedAt)}</td>
                    <td>{formatDate(u.trial?.expiresAt)}</td>
                    <td>
                      {isExpired(u.trial?.expiresAt)
                        ? <span className="atm-status expired">Expired</span>
                        : <span className="atm-status active">Active</span>
                      }
                    </td>
                    <td>{u.trial?.grantedBy === "admin" ? "👨‍💼 Admin" : "👤 Self"}</td>
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
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminTrialManager;
