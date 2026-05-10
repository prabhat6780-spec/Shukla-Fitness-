import { useEffect, useState } from "react"
import API from "../api"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"
import "../css/Plans.css"
function Plans(){

const [plans,setPlans] = useState([])
const [user,setUser] = useState({})
const navigate = useNavigate()

useEffect(() => {

  const loadPlans = async () => {
    try {
      const res = await API.get("/fitness/my-plans")
      setPlans(res.data.plans)
    } catch (err) {
      console.log(err)
    }
  }

  loadPlans()

}, [])

const openPlan = (plan)=>{
  navigate("/airesult",{ state: plan })
}

const deletePlan = async(id)=>{
  await API.delete("/fitness/"+id)
  setPlans(prev => prev.filter(p => p._id !== id))
}

useEffect(()=>{
  const fetchProfile = async ()=>{
    const res = await API.get("/auth/profile")
    setUser(res.data)
  }

  fetchProfile()
},[])
return(
<div>

<Navbar showMenu showIcons dark />

<div className="profile-layout1">

<Sidebar user={user}/>

<div className="bp-content">

<h2 className="bp-title">My Plans</h2>

{plans.length === 0 && (
  <div className="bp-empty">No Plans Generated Yet</div>
)}

{plans.map((p)=>(
  <div key={p._id} className="bp-card">

    <div className="bp-head">
      <div className="bp-name">Shukla's Fitness Plan </div>
      <div className="bp-date">
        {new Date(p.createdAt).toLocaleDateString()}
      </div>
    </div>

    <div className="bp-info">
      <div className="bp-badge">🔥 {p.targetCalories} kcal</div>
      <div className="bp-badge">💪 {p.workoutSuggestion}</div>
      <div className="bp-badge">🥗 {p.dietSuggestion}</div>
    </div>

    <div className="bp-actions">
      <button className="bp-open" onClick={()=>openPlan(p)}>
        Open Plan
      </button>

      <button className="bp-delete" onClick={()=>deletePlan(p._id)}>
        Delete
      </button>
    </div>

  </div>
))}

</div>
</div>

</div>
)

}

export default Plans