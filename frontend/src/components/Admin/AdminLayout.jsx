import { useEffect, useState } from "react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import API from "../../api"
import "./AdminLayout.css"

function AdminLayout({ children }) {

const [user,setUser] = useState({})

useEffect(()=>{
const loadProfile = async ()=>{
try{
const res = await API.get("/auth/profile")

setUser(res.data)   // same like profile page

}catch(err){
console.log(err)
}
}

loadProfile()
},[])

return (
<div className="adminWrapper">

<AdminNavbar user={user}/>
<AdminSidebar user={user}/>

<div className="adminMain">
{children}
</div>

</div>
)
}

export default AdminLayout