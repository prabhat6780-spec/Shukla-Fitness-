import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AddExercise.css";

import {
  FaDumbbell, FaTag, FaLayerGroup, FaChartLine,
  FaListOl, FaClock, FaHourglassHalf, FaFileAlt, FaUpload
} from "react-icons/fa";

const EditExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    category: "",
    muscleGroup: "",
    defaultSets: 3,
    defaultReps: 12,
    defaultDurationSeconds: 30,
    restSeconds: 60,
    difficulty: "beginner",
    instructions: ""
  });

  const [existingMedia, setExistingMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  // ✅ FETCH DATA (FIXED)
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await API.get(`/exercises/${id}`);
        const data = res.data;

        // 🔥 SAFE SET FORM (NO NULL ISSUE)
        setForm({
          name: data.name || "",
          category: data.category || "",
          muscleGroup: data.muscleGroup || "",
          defaultSets: data.defaultSets || 0,
          defaultReps: data.defaultReps || 0,
          defaultDurationSeconds: data.defaultDurationSeconds || 0,
          restSeconds: data.restSeconds || 0,
          difficulty: data.difficulty || "beginner",
          instructions: data.instructions || ""
        });

        setExistingMedia(data.media || []);

      } catch (err) {
        console.log(err);
        alert("Failed to load exercise");
      }
    };

    fetchExercise();
  }, [id]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD FILES
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setNewFiles(prev => [...prev, ...files]);
    setPreview(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f))
    ]);
  };

  // ✅ REMOVE EXISTING
  const removeExisting = (index) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ REMOVE NEW
  const removeNew = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ SUBMIT (FULL FIXED)
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // 🔥 CONVERT NUMBERS + CLEAN DATA
      const formattedForm = {
        ...form,
        defaultSets: Number(form.defaultSets),
        defaultReps: Number(form.defaultReps),
        defaultDurationSeconds: Number(form.defaultDurationSeconds),
        restSeconds: Number(form.restSeconds),
      };

      Object.entries(formattedForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // ✅ NEW FILES
      newFiles.forEach(file => {
        formData.append("media", file);
      });

      // ✅ EXISTING MEDIA
      formData.append("existingMedia", JSON.stringify(existingMedia));

      console.log("Submitting form...");

      await API.put(`/exercises/${id}`, formData);

      alert("Exercise Updated ✅");
      navigate("/admin/exercises");

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <AdminLayout>
      <div className="add-exercise-page">
        <div className="ae-container">

          <h2 className="ae-title">Edit Exercise</h2>

          <div className="ae-form">

            {/* NAME + CATEGORY */}
            <div className="ae-row-2">
              <div className="ae-field">
                <label>Exercise Name</label>
                <div className="ae-input-icon">
                  <FaDumbbell />
                  <input name="name" value={form.name} onChange={handleChange} />
                </div>
              </div>

              <div className="ae-field">
                <label>Category</label>
                <div className="ae-input-icon">
                  <FaTag />
                  <input name="category" value={form.category} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* MUSCLE + DIFFICULTY */}
            <div className="ae-row-2">
              <div className="ae-field">
                <label>Muscle Group</label>
                <div className="ae-input-icon">
                  <FaLayerGroup />
                  <input name="muscleGroup" value={form.muscleGroup} onChange={handleChange} />
                </div>
              </div>

              <div className="ae-field">
                <label>Difficulty</label>
                <div className="ae-input-icon">
                  <FaChartLine />
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="ae-row-4">
              <div className="ae-field">
                <label>Sets</label>
                <div className="ae-input-icon">
                  <FaListOl />
                  <input type="number" name="defaultSets" value={form.defaultSets} onChange={handleChange} />
                </div>
              </div>

              <div className="ae-field">
                <label>Reps</label>
                <div className="ae-input-icon">
                  <FaListOl />
                  <input type="number" name="defaultReps" value={form.defaultReps} onChange={handleChange} />
                </div>
              </div>

              <div className="ae-field">
                <label>Duration</label>
                <div className="ae-input-icon">
                  <FaClock />
                  <input type="number" name="defaultDurationSeconds" value={form.defaultDurationSeconds} onChange={handleChange} />
                </div>
              </div>

              <div className="ae-field">
                <label>Rest</label>
                <div className="ae-input-icon">
                  <FaHourglassHalf />
                  <input type="number" name="restSeconds" value={form.restSeconds} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="ae-field">
              <label>Instructions</label>
              <div className="ae-input-icon textarea">
                <FaFileAlt />
                <textarea name="instructions" value={form.instructions} onChange={handleChange} />
              </div>
            </div>

            {/* EXISTING MEDIA */}
            <div className="ae-preview-row">
              {existingMedia.map((m, i) => (
                <div key={i} className="ae-preview-item">
                  {m.type === "video" ? (
                    <video src={m.url} className="ae-gif-preview" autoPlay loop muted />
                  ) : (
                    <img src={m.url} className="ae-gif-preview" />
                  )}

                  <button
                    className="ae-remove-btn"
                    onClick={() => removeExisting(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* NEW MEDIA */}
            <div className="ae-preview-row">
              {preview.map((src, i) => (
                <div key={i} className="ae-preview-item">
                  <img src={src} className="ae-gif-preview" />

                  <button
                    className="ae-remove-btn"
                    onClick={() => removeNew(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* UPLOAD */}
            <div className="ae-upload-box" onClick={() => fileInputRef.current.click()}>
              <FaUpload className="ae-upload-icon" />
              <p>Add More Media</p>

              <input
                type="file"
                multiple
                accept="image/*,video/*,.gif"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
            </div>

            {/* SUBMIT */}
            <button onClick={handleSubmit} className="ae-submit-btn">
              Update Exercise
            </button>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditExercise;