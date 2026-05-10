import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, Dumbbell, BadgeDollarSign, CreditCard, LogOut, Activity, Package } from "lucide-react"
import "./AdminSidebar.css"
import { FaBoxOpen } from "react-icons/fa";
function AdminSidebar(){

const nav = useNavigate()
const loc = useLocation()

return(
<div className="ad-sidebar">

<div className="ad-menu">

<div className={loc.pathname==="/admin"?"ad-item active":"ad-item"}
onClick={()=>nav("/admin")}>
<LayoutDashboard size={20}/> Dashboard
</div>

<div className={loc.pathname==="/admin/users"?"ad-item active":"ad-item"}
onClick={()=>nav("/admin/users")}>
<Users size={20}/> Users
</div>

<div className={loc.pathname==="/admin/plans"?"ad-item active":"ad-item"}
onClick={()=>nav("/admin/plans")}>
<Dumbbell size={20}/> Plans
</div>

<div className={loc.pathname==="/admin/membership"?"ad-item active":"ad-item"}
onClick={()=>nav("/admin/trial-membership")}>
<CreditCard size={20}/>Trial-Membership
</div>
<div className={loc.pathname==="/admin/memberships"?"ad-item active":"ad-item"}
onClick={()=>nav("/admin/plan-memberships")}>
<BadgeDollarSign size={20}/> Plan-Membership
</div>

 <div
          className={loc.pathname.includes("/admin/orders") ? "ad-item active" : "ad-item"}
          onClick={() => nav("/admin/orders")}
        >
          <FaBoxOpen size={20} /> Orders
        </div>
        <div
  className={loc.pathname === "/admin/membership-orders" ? "ad-item active" : "ad-item"}
  onClick={() => nav("/admin/membership-orders")}
>
  <CreditCard size={20} /> Membership Orders
</div>
 {/* Products 🔥 */}
        <div
          className={loc.pathname === "/products-list" ? "ad-item active" : "ad-item"}
          onClick={() => nav("/products-list")}
        >
          <Package size={20} /> Products
        </div>
 
        {/* Exercises 🔥 */}
        <div
          className={loc.pathname === "/admin/exercises" ? "ad-item active" : "ad-item"}
          onClick={() => nav("/admin/exercises")}
        >
          <Activity size={20} /> Exercises
        </div>       

<div className="ad-item logout"
onClick={()=>{localStorage.removeItem("token"); nav("/")}}>
<LogOut size={20}/> Logout
</div>



</div>

</div>
)
}

export default AdminSidebar