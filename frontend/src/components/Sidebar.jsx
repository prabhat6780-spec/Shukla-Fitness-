import React from 'react'
import { useNavigate } from "react-router-dom";
import {  FaClipboardList , FaBoxOpen, FaUserCog, FaHeadset, FaPhoneAlt, FaSignOutAlt } from "react-icons/fa";
import API from "../api";
const Sidebar = ({user = {}}) => {
      const navigate = useNavigate();
  const handleLogout = async () => {

  try {

    await API.post("/auth/logout");

    localStorage.removeItem("token");

    navigate("/");

  } catch(error){
    console.log(error)
    alert("Logout Failed");
  }

};
    return (
    
    <div>
      {/* ⭐ SIDEBAR */}
        <div className="profile-sidebar">
      
          <div className="sidebar-top">
            <img
              src={user.photo || "/photos/User1.jpg"}
              className="sidebar-photo"
            />
            <h3>{user.name}</h3>
            <p
  className="view-profile"
  onClick={() => navigate("/profile")}
  style={{cursor:"pointer"}}
>
  VIEW PROFILE
</p>
          </div>
      
          <div className="sidebar-menu">
      
            <div className="menu-item" onClick={() => navigate("/orders")}>
              <FaBoxOpen /> My Orders
            </div>

            <div className="menu-item" onClick={()=>navigate("/plans")}>
  <FaClipboardList /> Plans
</div>
      
        
      
            <div className="menu-item" onClick={() => navigate("/contact")}>
              <FaPhoneAlt /> Contact Us
            </div>
      {user?.role?.toLowerCase() === "admin" && (
  <div
    className="menu-item"
    onClick={() => navigate("/admin")}
  >
    🛠 Admin Dashboard
  </div>
  
)}
            <div className="menu-item logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </div>

          </div>
      
        </div>
    </div>
  )
}

export default Sidebar
