import { useEffect, useState } from "react";
import API from "../../api";
import { Bell, UserCircle } from "lucide-react";
import "./adminNavbar.css";
import { useNavigate } from "react-router-dom";

function AdminNavbar({ user }) {
  const navigate = useNavigate();

  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await API.get("/contact");
        const count = res.data.filter(m => !m.isRead).length;
        setUnread(count);
      } catch(err) {
        console.log(err)
      }
    };

    fetchUnread();
  }, []);

  return (
    <div className="adminNav">

      <div className="adminNav-left">
        <img src="/photos/Logo5.png" className="adminLogo" />
        <h2 className="adminWelcome">
          Welcome back, {user?.name || "Admin"} 👋
        </h2>
      </div>

      <div className="adminNav-right"  onClick={() => navigate("/admin/messages")}
  style={{ cursor: "pointer" }}>

        {/* 🔔 BELL */}
        <div className="adminIcon bell-wrapper">
          
          <Bell size={22} />

          {unread > 0 && (
            <span className="bell-badge">{unread}</span>
          )}
        </div>

        <div className="adminIcon">
          {user?.photo ? (
            <img src={user.photo} style={{ width:"30px", height:"30px", borderRadius:"50%" }} />
          ) : (
            <UserCircle size={26} />
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminNavbar;