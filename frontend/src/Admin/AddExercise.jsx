// Admin/AddExercise.jsx
import { useState, useRef } from "react";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AddExercise.css";

import {
  FaDumbbell, FaTag, FaLayerGroup, FaChartLine,
  FaListOl, FaClock, FaHourglassHalf, FaFileAlt, FaUpload
} from "react-icons/fa";

const AddExercise = () => {

  const [form, setForm] = useState({
    name: "", category: "", muscleGroup: "",
    defaultSets: 3, defaultReps: 12,
    defaultDurationSeconds: 30, restSeconds: 60,
    difficulty: "beginner", instructions: ""
  });

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle multiple file upload
 const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  // ✅ APPEND files
  setFiles(prev => [...prev, ...selectedFiles]);

  // ✅ APPEND previews
  const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
  setPreview(prev => [...prev, ...previewUrls]);
};
  // ✅ Click anywhere in box
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!form.name) return alert("Exercise name is required");
    if (files.length === 0) return alert("Upload at least one file");

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // ✅ append multiple files
      files.forEach(file => {
        formData.append("media", file);
      });

      await API.post("/exercises", formData);

      alert("Exercise Added ✅");

      // reset
      setForm({
        name: "", category: "", muscleGroup: "",
        defaultSets: 3, defaultReps: 12,
        defaultDurationSeconds: 30, restSeconds: 60,
        difficulty: "beginner", instructions: ""
      });

      setFiles([]);
      setPreview([]);

    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };
  const removeFile = (index) => {
  const updatedFiles = files.filter((_, i) => i !== index);
  const updatedPreview = preview.filter((_, i) => i !== index);

  setFiles(updatedFiles);
  setPreview(updatedPreview);
};

  return (
    <AdminLayout>
      <div className="add-exercise-page">
        <div className="ae-container">

          <h2 className="ae-title">Add Exercise</h2>

          <div className="ae-form">

            {/* NAME + CATEGORY */}
            <div className="ae-row-2">
              <div className="ae-field">
                <label>Exercise Name *</label>
                <div className="ae-input-icon">
                  <FaDumbbell />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Push Ups"
                  />
                </div>
              </div>

              <div className="ae-field">
                <label>Category</label>
                <div className="ae-input-icon">
                  <FaTag />
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Upper Body / Cardio"
                  />
                </div>
              </div>
            </div>

            {/* MUSCLE + DIFFICULTY */}
            <div className="ae-row-2">
              <div className="ae-field">
                <label>Muscle Group</label>
                <div className="ae-input-icon">
                  <FaLayerGroup />
                  <input
                    name="muscleGroup"
                    value={form.muscleGroup}
                    onChange={handleChange}
                    placeholder="Chest / Legs / Back"
                  />
                </div>
              </div>

              <div className="ae-field">
                <label>Difficulty</label>
                <div className="ae-input-icon">
                  <FaChartLine />
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
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
                <label>Duration (sec)</label>
                <div className="ae-input-icon">
                  <FaClock />
                  <input type="number" name="defaultDurationSeconds" value={form.defaultDurationSeconds} onChange={handleChange} />
                </div>
              </div>

              <div className="ae-field">
                <label>Rest (sec)</label>
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
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* ✅ CLICKABLE UPLOAD BOX */}
            <div className="ae-upload-box" onClick={handleBoxClick}>
              <FaUpload className="ae-upload-icon" />
              <p className="ae-upload-title">Upload Exercise Media *</p>
              <p className="ae-upload-sub">GIF / Image / Video (Max 10)</p>

              <input
                type="file"
                multiple
                accept="image/*,video/*,.gif"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
<div className="ae-preview-row">
  {preview.map((src, i) => (
    <div key={i} className="ae-preview-item">
      <img src={src} alt="preview" className="ae-gif-preview" />

      {/* ❌ Remove Button */}
      <button
        type="button"
        className="ae-remove-btn"
        onClick={(e) => {
          e.stopPropagation(); // prevent upload click
          removeFile(i);
        }}
      >
        ✕
      </button>
    </div>
  ))}
</div>
            </div>

            {/* SUBMIT */}
            <button
              className="ae-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add Exercise"}
            </button>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddExercise;