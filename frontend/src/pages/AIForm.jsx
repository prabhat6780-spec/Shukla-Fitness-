import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "../css/AIForm.css"
import API from "../api"   
import {
FaUserAlt, FaWeight, FaRulerVertical, FaVenusMars,
FaHeartbeat, FaDumbbell, FaAppleAlt, FaBullseye,
FaCalendarAlt, FaCommentDots
} from "react-icons/fa"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function AIForm(){

const nav = useNavigate()

const [form,setForm] = useState({
age:"",
weight:"",
height:"",
gender:"",
abdomen:"",
chest:"",
workout_type:"",
diet_type:"",
target_weight:"",
number_of_weeks:"",
comments:""
})

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}
const isFormValid =
form.age &&
form.weight &&
form.height &&
form.gender &&
form.workout_type &&
form.diet_type &&
form.target_weight &&
form.number_of_weeks

const handleSubmit = async () => {
    const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first 🔐");
    nav("/login", { state: { from: "/ai-form" } });
    return;
  }
  if (
    !form.age || !form.weight || !form.height || !form.gender ||
    !form.workout_type || !form.diet_type ||
    !form.target_weight || !form.number_of_weeks
  ) {
    alert("Please fill all required fields")
    return
  }

  try {
    // ✅ Normalize workout_type to exact goal string
    const goalMap = {
      "Weight Loss":  "Fat Loss",
      "Weight gain":  "Weight Gain",   // fix lowercase 'g'
      "Muscle Gain":  "Muscle Gain",
    }

    const currentWeight = Number(form.weight)
    const targetWeight  = Number(form.target_weight)

    // ✅ Auto-derive goal from weights if mapping fails
    const mappedGoal = goalMap[form.workout_type] || (
      currentWeight > targetWeight ? "Fat Loss" :
      currentWeight < targetWeight ? "Weight Gain" :
      "Maintenance"
    )

    const payload = {
      age:             Number(form.age),
      weight:          Number(form.weight),
      height:          Number(form.height),
      gender:          form.gender,
      abdomen:         form.abdomen ? Number(form.abdomen) : 0,
      chest:           form.chest   ? Number(form.chest)   : 0,
      workout_type:    form.workout_type,
      goal:            mappedGoal,          // ✅ this was missing entirely
      diet_type:       form.diet_type,
      target_weight:   targetWeight,
      current_weight:  currentWeight,       // ✅ this was missing too
      number_of_weeks: Number(form.number_of_weeks),
      comments:        form.comments,
    }

    const res = await API.post("/fitness/generate-plan", payload)
    nav("/airesult", { state: res.data })

  } catch (err) {
    console.log("FULL ERROR → ", err)
    if (err.response) {
      console.log("BACKEND ERROR → ", err.response.data)
      alert(err.response.data.error || "Backend Error")
    } else {
      alert("Server not reachable")
    }
  }
}

return(
    <div>
<Navbar showMenu showIcons dark />
<div className="ai-page1">


<div className="ai-overlay1">

<h1 className="ai-title1">
AI <span>FITNESS</span> & DIET PLANNER
</h1>

<p className="ai-sub1">
Get Your Personalized Workout & Diet Plan
</p>

<div className="ai-card1">

<div className="ai-grid1">

{/* AGE */}
<div className="field-group">
<div className="field-label">
<FaUserAlt className="icon2"/> <span>Age</span>
</div>
<div className="input-box">
<input name="age" value={form.age} onChange={handleChange} placeholder="Enter Age"/>
</div>
</div>

{/* WEIGHT */}
<div className="field-group">
<div className="field-label">
<FaWeight className="icon2"/> <span>Weight</span>
</div>
<div className="input-box">
<input name="weight" value={form.weight} onChange={handleChange} placeholder="Enter Weight (kg)"/>
</div>
</div>

{/* HEIGHT */}
<div className="field-group">
<div className="field-label">
<FaRulerVertical className="icon2"/> <span>Height</span>
</div>
<div className="input-box">
<input name="height" value={form.height} onChange={handleChange} placeholder="Enter Height (cm)"/>
</div>
</div>

{/* GENDER */}
<div className="field-group">
<div className="field-label">
<FaVenusMars className="icon2"/> <span>Gender</span>
</div>
<div className="input-box">
<select name="gender" value={form.gender} onChange={handleChange}>
<option value="">Select Gender</option>
<option>Male</option>
<option>Female</option>
</select>
</div>
</div>

{/* ABDOMEN */}
<div className="field-group">
<div className="field-label">
<FaHeartbeat className="icon2"/> <span>Abdomen</span>
</div>
<div className="input-box">
<input name="abdomen" value={form.abdomen} onChange={handleChange} placeholder="Enter Abdomen Size"/>
</div>
</div>

{/* CHEST */}
<div className="field-group">
<div className="field-label">
<FaHeartbeat className="icon2"/> <span>Chest</span>
</div>
<div className="input-box">
<input name="chest" value={form.chest} onChange={handleChange} placeholder="Enter Chest Size"/>
</div>
</div>

{/* WORKOUT */}
<div className="field-group">
<div className="field-label">
<FaDumbbell className="icon2"/> <span>Workout Type</span>
</div>
<div className="input-box">
<select name="workout_type" value={form.workout_type} onChange={handleChange}>
<option value="">Select Workout Type</option>
<option>Weight Loss</option>
<option>Weight Gain</option>
<option>Muscle Gain</option>
</select>
</div>
</div>

{/* DIET */}
<div className="field-group">
<div className="field-label">
<FaAppleAlt className="icon2"/> <span>Diet Type</span>
</div>
<div className="input-box">
<select name="diet_type" value={form.diet_type} onChange={handleChange}>
<option value="">Select Diet Type</option>
<option>Non-Vegetarian</option>
<option>Vegetarian</option>
<option>Keto</option>
</select>
</div>
</div>

{/* TARGET */}
<div className="field-group">
<div className="field-label">
<FaBullseye className="icon2"/> <span>Target Weight</span>
</div>
<div className="input-box">
<input name="target_weight" value={form.target_weight} onChange={handleChange} placeholder="Target Weight"/>
</div>
</div>

{/* WEEKS */}
<div className="field-group">
<div className="field-label">
<FaCalendarAlt className="icon2"/> <span>Weeks</span>
</div>
<div className="input-box">
<input name="number_of_weeks" value={form.number_of_weeks} onChange={handleChange} placeholder="Enter Weeks"/>
</div>
</div>

{/* COMMENTS */}
<div className="field-group full-width">
<div className="field-label">
<FaCommentDots className="icon2"/> <span>Comments</span>
</div>
<div className="input-box textarea-box">
<textarea name="comments" value={form.comments} onChange={handleChange}
placeholder="Write your goals or any additional details..."
/>
</div>
</div>

</div>

<button
className="ai-btn1"
onClick={handleSubmit}
disabled={!isFormValid}
style={{
opacity:isFormValid?1:0.5,
cursor:isFormValid?"pointer":"not-allowed"
}}
>
GENERATE PLAN →
</button>

</div>

</div>

<img src="/photos/aiformleft.png" className="ai-right-img" alt="gym"/>

</div>
<Footer/>
</div>
)

}

export default AIForm