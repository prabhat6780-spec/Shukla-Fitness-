import { useEffect, useState } from "react"
import API from "../api"
import AdminLayout from "../components/Admin/AdminLayout"
import "./AdminUsers.css"
import { useNavigate } from "react-router-dom"

function AdminUsers(){

const navigate= useNavigate();
const [users,setUsers] = useState([])
const [loading,setLoading] = useState(true)
const [otpLoading, setOtpLoading] = useState(false)
const [createLoading, setCreateLoading] = useState(false)
const [search,setSearch] = useState("")
const [form,setForm] = useState({
  name:"",
  email:"",
  phone:"",
  otp:""
})

/* ================= LOAD USERS ================= */
const loadUsers = async () => {
  try {
    const res = await API.get("/auth/admin/all-users")
    setUsers(res.data.users)
  } catch (err) {
    console.log(err)
  } finally {
    setLoading(false)
  }
}
useEffect(() => {
  loadUsers()
}, [])
/* ================= SEARCH ================= */
const filteredUsers = users.filter(u =>
u.name?.toLowerCase().includes(search.toLowerCase()) ||
u.email?.toLowerCase().includes(search.toLowerCase())
)

/* ================= CREATE USER ================= */
const sendOTP = async () => {

if(!form.email){
alert("Please enter email first")
return
}

if(otpLoading) return

try{
setOtpLoading(true)

await API.post("/auth/admin/send-otp", {
  email: form.email
})

alert("OTP sent")

}catch(err){
alert(err.response?.data?.message)
}
finally{
setOtpLoading(false)
}

}
const createUser = async ()=>{

if(createLoading) return   // 🚫 prevent spam

try{
setCreateLoading(true)

await API.post("/auth/admin/create-user", form)

alert("User created")

setForm({
name:"",
email:"",
phone:"",
otp:""
})

await loadUsers()   // ⭐ wait properly

}catch(err){
alert(err.response?.data?.message)
}
finally{
setCreateLoading(false)
}

}

return(

<AdminLayout>

<div className="admin-content">

<h2 className="admin-title">Users Management</h2>

{/* ================= SEARCH ================= */}
<input
className="search-box1"
placeholder="Search users..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

{/* ================= CREATE USER ================= */}
<div className="create-box1">

<h3>Create User</h3>

<div className="form-row">

{/* EMAIL + OTP BUTTON */}
<div className="input-group">
<input
placeholder="Enter Email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
/>
<button 
className="otp-btn4"
onClick={sendOTP}
disabled={otpLoading}
>
{otpLoading ? "Sending..." : "Send OTP"}
</button>
</div>

{/* OTP */}
<input
placeholder="Enter OTP"
value={form.otp}
onChange={(e)=>setForm({...form,otp:e.target.value})}
/>

{/* NAME */}
<input
placeholder="Full Name"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

{/* PHONE */}
<input
placeholder="Phone Number"
value={form.phone}
onChange={(e)=>setForm({...form,phone:e.target.value})}
/>

</div>

<button 
className="create-btn"
onClick={createUser}
disabled={createLoading}
>
{createLoading ? "Creating..." : "Create User"}
</button>

</div>
{/* ================= TABLE ================= */}

{loading ? <p>Loading...</p> : (

<table className="users-table">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{filteredUsers.map((u)=>(
<tr key={u.user_id}>

<td>{u.name || "N/A"}</td>
<td>{u.email}</td>

<td>
<span className={u.role==="admin"?"role admin":"role user"}>
{u.role}
</span>
</td>

<td className="actions">

<button 
className="view-btn1"
onClick={()=>navigate(`/admin/user/${u.user_id}`)}
>
View
</button>

</td>
</tr>
))}

</tbody>

</table>

)}

</div>

</AdminLayout>

)

}

export default AdminUsers