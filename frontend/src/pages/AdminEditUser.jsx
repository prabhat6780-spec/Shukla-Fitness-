import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "../css/AdminEditUser.css";

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
import { MdMonitorWeight } from "react-icons/md";
const AdminEditUser = () => {

  const { userId } = useParams();
  const navigate = useNavigate();
const [loadingBtn, setLoadingBtn] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    birthdate: "",
    address: "",
    height: "",
    weight: "",
    chest: "",
    abdomen: "",
    fitnessGoal: "",
  fitnessLevel: "",
  bmi: "",
    photo: ""
  });

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/auth/admin/user/${userId}`);
        const u = res.data.user;

        setUser({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          age: u.age || "",
          gender: u.gender || "",
          birthdate: u.birthdate?.slice(0,10) || "",
          address: u.address || "",
          height: u.height || "",
          weight: u.weight || "",
          chest: u.chest || "",
          abdomen: u.abdomen || "",
          fitnessGoal: u.fitnessGoal || "",
fitnessLevel: u.fitnessLevel || "",
bmi: u.bmi || "",
          photo: u.photo || ""
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [userId]);
  

  /* ================= IMAGE ================= */
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= UPDATE ================= */
const handleUpdate = async () => {
  try {
    if (!user.email) {
      alert("Email is required ❌");
      return;
    }

    setLoadingBtn(true); // 🔥 START LOADING

    const payload = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
      birthdate: user.birthdate,
      height: user.height,
      weight: user.weight,
      chest: user.chest,
      abdomen: user.abdomen,
      fitnessGoal: user.fitnessGoal,
      fitnessLevel: user.fitnessLevel,
      photo: user.photo
    };

    await API.put("/auth/admin/update-user", payload);

    // ✅ SUCCESS FLOW
    setTimeout(() => {
      navigate(`/admin/user/${userId}`);
    }, 800);

  } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.message || "Update failed ❌");
  } finally {
    setLoadingBtn(false);
  }
};

  return (
    <AdminLayout>
<div className="aeu-wrapper">
      <div className="aeu-container">

        <h2 className="aeu-title">Edit User</h2>

        {/* PROFILE IMAGE */}
        <div className="aeu-avatar">
          <img src={user.photo || "/photos/User1.jpg"} alt="" />
          <label className="aeu-camera">
             <MdPhotoCamera />
            <input type="file" hidden onChange={handlePhoto} />
          </label>
        </div>

        {/* GRID */}
        <div className="aeu-grid">

          <div className="aeu-card">
            <label><FaUser /> Name</label>
            <input name="name" value={user.name} disabled />
          </div>

          <div className="aeu-card">
            <label><FaUser /> Email</label>
            <input name="email" value={user.email} onChange={(e)=>setUser({...user,email:e.target.value})}/>
          </div>

          <div className="aeu-card">
            <label><FaPhone /> Phone</label>
            <input name="phone" value={user.phone} onChange={(e)=>setUser({...user,phone:e.target.value})}/>
          </div>

          <div className="aeu-card">
            <label><MdDateRange /> Age</label>
            <input name="age" value={user.age} onChange={(e)=>setUser({...user,age:e.target.value})}/>
          </div>

          <div className="aeu-card">
            <label><FaUser /> Gender</label>
            <select name="gender" value={user.gender} onChange={(e)=>setUser({...user,gender:e.target.value})}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="aeu-card">
            <label><MdDateRange /> Birthdate</label>
            <input type="date" name="birthdate" value={user.birthdate} onChange={(e)=>setUser({...user,birthdate:e.target.value})}/>
          </div>

          <div className="aeu-card full">
            <label><FaMapMarkerAlt /> Address</label>
            <input name="address" value={user.address} onChange={(e)=>setUser({...user,address:e.target.value})}/>
          </div>

        </div>

        {/* MEASUREMENTS */}
        <h3 className="aeu-section"><FaWeightHanging /> Body Measurements</h3>

        <div className="aeu-grid">

          <div className="aeu-card">
            <label><GiBodyHeight/> Height</label>
            <input name="height" value={user.height} onChange={(e)=>setUser({...user,height:e.target.value})}/>
          </div>

          <div className="aeu-card">
            <label><FaWeightHanging/> Weight</label>
            <input name="weight" value={user.weight} onChange={(e)=>setUser({...user,weight:e.target.value})}/>
          </div>

          <div className="aeu-card">
            <label><GiChestArmor/> Chest</label>
            <input name="chest" value={user.chest} onChange={(e)=>setUser({...user,chest:e.target.value})}/>
          </div>

          <div className="aeu-card">
            <label><GiAbdominalArmor/> Abdomen</label>
            <input name="abdomen" value={user.abdomen} onChange={(e)=>setUser({...user,abdomen:e.target.value})}/>
          </div>

        </div>

        <h3 className="aeu-section"><IoFitness /> Fitness Details</h3>

<div className="aeu-grid">

  <div className="aeu-card">
    <label><IoFitness /> Goal</label>
    <select
      value={user.fitnessGoal}
      onChange={(e)=>setUser({...user, fitnessGoal: e.target.value})}
    >
      <option value="">Select Goal</option>
      <option value="weight_loss">Weight Loss</option>
      <option value="muscle_gain">Muscle Gain</option>
      <option value="weight_gain">Weight Gain</option>
    </select>
  </div>

  <div className="aeu-card">
    <label><FaChartLine/> Fitness Level</label>
    <select
      value={user.fitnessLevel}
      onChange={(e)=>setUser({...user, fitnessLevel: e.target.value})}
    >
      <option value="">Select Level</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </div>

  <div className="aeu-card">
    <label><MdMonitorWeight /> BMI</label>
    <input value={user.bmi} readOnly />
  </div>

</div>

        {/* BUTTON */}
        <div className="aeu-actions">
          <button onClick={handleUpdate} disabled={loadingBtn}>
  {loadingBtn ? "Updating..." : "Update User"}
</button>
        </div>

      </div>
      </div>

    </AdminLayout>
  );
};

export default AdminEditUser;