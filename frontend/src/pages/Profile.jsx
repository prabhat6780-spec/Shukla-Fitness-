import React, { useState,  useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";
import {
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaChartLine,
} from "react-icons/fa";
import { MdDateRange, MdPhotoCamera } from "react-icons/md";
import { IoFitness } from "react-icons/io5";
import { GiChestArmor, GiAbdominalArmor,GiBodyHeight } from "react-icons/gi";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const Profile = () => {

  const navigate = useNavigate();

const [user,setUser] = useState({
name:"",
email:"",
phone:"",
age:"",
gender:"",
birthdate:"",
address:"",
height:"",
weight:"",
chest:"",
abdomen:"",
fitnessGoal:"",
fitnessLevel:"",
photo:""
})

const handleChange = (e)=>{
setUser({...user,[e.target.name]:e.target.value})
}
useEffect(() => {

  const fetchProfile = async () => {

    try {

      const res = await API.get("/auth/profile");

      setUser({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        age: res.data.age || "",
        gender: res.data.gender || "",
        birthdate: res.data.birthdate?.slice(0,10) || "",
        address: res.data.address || "",
        height: res.data.height || "",
        weight: res.data.weight || "",
        chest: res.data.chest || "",
        abdomen: res.data.abdomen || "",
        fitnessGoal: res.data.fitnessGoal || "",
        fitnessLevel: res.data.fitnessLevel || "",
        photo: res.data.photo || "",
        role: res.data.role || ""  
      });

    }  catch (error) {
      console.log("PROFILE ERROR:", error.response?.status);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  fetchProfile();

}, [navigate]);

const handleUpdate = async () => {

  try {

    const res = await API.put("/auth/profile/update", user);

    alert(res.data.message);

  } catch(error){
console.log(error)
    alert("Update Failed");

  }

};



const isEmpty = (val) =>
  val === null ||
  val === undefined ||
  val === "";
return (
<div>
<Navbar showMenu showIcons dark />

<div className="profile-layout">

  <Sidebar user={user} />


  {/* ⭐ RIGHT SIDE CONTENT */}
  <div className="profile-content">

    {/* Profile Image */}
    <div className="profile-img">
      <img
        src={user.photo || "/photos/User1.jpg"}
        className="profile-photo"
      />

      <label htmlFor="photoUpload" className="camera-btn">
        <MdPhotoCamera />
      </label>

      <input
        id="photoUpload"
        type="file"
        accept="image/*"
        style={{display:"none"}}
        onChange={(e)=>{
          const file = e.target.files[0];
          if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
              setUser(prev => ({...prev, photo: reader.result}));
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>


   {/* FORM */}
<div className="info-grid">

  <div className="info-box">
    <label className="field-label">
      <span><FaUser className="icons"/> Name</span>
      {isEmpty(user.name) && <span className="add-mark">Add</span>}
    </label>
    <input name="name" value={user.name} onChange={handleChange}/>
  </div>

<div className="info-box">
  <label className="field-label">
    <span><FaUser className="icons"/> Email</span>
    {isEmpty(user.email) && <span className="add-mark">Add</span>}
  </label>

  <input
    type="email"
    name="email"
    value={user.email}
    onChange={handleChange}
    placeholder="Enter Email"
  />
</div>
  <div className="info-box">
    <label className="field-label">
      <span><FaPhone className="icons"/> Phone</span>
      {isEmpty(user.phone) && <span className="add-mark">Add</span>}
    </label>
    <input name="phone" value={user.phone} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><MdDateRange className="icons"/> Age</span>
      {isEmpty(user.age) && <span className="add-mark">Add</span>}
    </label>
    <input type="number" name="age" value={user.age} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><FaUser className="icons"/> Gender</span>
      {isEmpty(user.gender) && <span className="add-mark">Add</span>}
    </label>
    <select name="gender" value={user.gender} onChange={handleChange}>
      <option value="">Select</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><MdDateRange className="icons"/> Birthdate</span>
      {isEmpty(user.birthdate) && <span className="add-mark">Add</span>}
    </label>
    <input type="date" name="birthdate" value={user.birthdate} onChange={handleChange}/>
  </div>

  <div className="info-box full">
    <label className="field-label">
      <span><FaMapMarkerAlt className="icons"/> Address</span>
      {isEmpty(user.address) && <span className="add-mark">Add</span>}
    </label>
    <input name="address" value={user.address} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><GiBodyHeight className="icons"/> Height</span>
      {isEmpty(user.height) && <span className="add-mark">Add</span>}
    </label>
    <input name="height" value={user.height} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><FaWeightHanging className="icons"/> Weight</span>
      {isEmpty(user.weight) && <span className="add-mark">Add</span>}
    </label>
    <input name="weight" value={user.weight} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><GiChestArmor className="icons"/> Chest</span>
      {isEmpty(user.chest) && <span className="add-mark">Add</span>}
    </label>
    <input name="chest" value={user.chest} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><GiAbdominalArmor className="icons"/> Abdomen</span>
      {isEmpty(user.abdomen) && <span className="add-mark">Add</span>}
    </label>
    <input name="abdomen" value={user.abdomen} onChange={handleChange}/>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><IoFitness className="icons"/> Goal</span>
      {isEmpty(user.fitnessGoal) && <span className="add-mark">Add</span>}
    </label>
    <select name="fitnessGoal" value={user.fitnessGoal} onChange={handleChange}>
      <option value="">Select</option>
      <option value="weight_loss">Weight Loss</option>
      <option value="muscle_gain">Muscle Gain</option>
       <option value="weight_gain">Weight Gain</option>
    </select>
  </div>

  <div className="info-box">
    <label className="field-label">
      <span><FaChartLine className="icons"/> Fitness Level</span>
      {isEmpty(user.fitnessLevel) && <span className="add-mark">Add</span>}
    </label>
    <input name="fitnessLevel" value={user.fitnessLevel} onChange={handleChange}/>
  </div>

</div>

    <div className="btn-group">
      <button className="save-btn" onClick={handleUpdate}>Update Profile</button>
    </div>

  </div>

</div>
</div>
)
}

export default Profile