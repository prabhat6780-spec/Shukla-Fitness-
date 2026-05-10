import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AllExercise.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllExercises = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filteredExercises = exercises.filter(ex =>
  ex.name?.toLowerCase().includes(search.toLowerCase())
);

  const fetchExercises = async () => {
    try {
      const res = await API.get("/exercises");
      setExercises(res.data);
    } catch (err) {
        console.log(err)
      alert("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this exercise?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/exercises/${id}`);
    alert("Deleted ✅");

    // refresh list
    setExercises(prev => prev.filter(ex => ex._id !== id));

  } catch (err) {
    console.lof(err)
    alert("Delete failed");
  }
};

  return (
    <AdminLayout>
      <div className="all-ex-page">
        <div className="all-ex-container">

          <div className="all-ex-header">
  <h2 className="all-ex-title">All Exercises</h2>
  <div className="all-ex-search-wrapper">
<div className="search-box1">
  <span className="search-icon1">🔍</span>

  <input
    type="text"
    placeholder="Search exercises..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {search && (
    <span className="clear-icon1" onClick={() => setSearch("")}>
      ✖
    </span>
  )}
</div>

</div>

  <button
    className="add-ex-btn1"
    onClick={() => navigate("/admin/add-exercise")}
  >
    + Add Exercise
  </button>
</div>

          {loading ? (
            <p>Loading...</p>
          ) : exercises.length === 0 ? (
            <p>No exercises found</p>
          ) : (
            <div className="ex-grid">
              {filteredExercises.map((ex) => (
  <div className="ex-card" key={ex._id}>

    {/* MEDIA */}
    {ex.media && ex.media.length > 0 ? (
      ex.media[0].type === "video" ? (
        <video src={ex.media[0].url} className="ex-gif" controls />
      ) : (
        <img src={ex.media[0].url} alt={ex.name} className="ex-gif" />
      )
    ) : (
      <div className="no-media">No Media</div>
    )}

    {/* ACTION BUTTONS */}
   <div className="ex-actions">
  <button
    className="ex-btn ex-btn-edit"
    onClick={() => navigate(`/admin/edit-exercise/${ex._id}`)}
  >
    <FaEdit />
  </button>

  <button
    className="ex-btn ex-btn-delete"
    onClick={() => handleDelete(ex._id)}
  >
    <FaTrash />
  </button>
</div>

    <h3>{ex.name}</h3>

    <p className="ex-meta">
      {ex.category} • {ex.muscleGroup}
    </p>

    <div className="ex-stats">
      <span>🏋 {ex.defaultSets} sets</span>
      <span>🔁 {ex.defaultReps} reps</span>
      <span>⏱ {ex.defaultDurationSeconds}s</span>
    </div>

    <div className="ex-footer">
      <span className={`badge ${ex.difficulty}`}>
        {ex.difficulty}
      </span>
    </div>

  </div>
))}
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default AllExercises;