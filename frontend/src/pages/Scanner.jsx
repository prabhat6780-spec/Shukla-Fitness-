import React, { useRef, useState, useEffect } from "react";
import "./Scanner.css";
import API from "../api";

const nutriBox = {
  background: 'rgba(255,106,0,0.08)',
  border: '1px solid #ff6a00',
  borderRadius: 10,
  padding: '12px 8px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}
const nutriVal = {
  fontSize: 22,
  fontWeight: 700,
  color: '#ff6a00',
}
const nutriLabel = {
  fontSize: 11,
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: 1,
}

const Scanner = () => {
  const fileRef = useRef();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grams, setGrams] = useState(100);

  const sendToBackend = async (file) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("grams", grams); // ⭐ send grams to backend

    try {
      const res = await API.post("/food/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing image");
    }

    setLoading(false);
  };

  useEffect(() => {
    const receiveImage = (event) => {
      if (event.data?.type === "FOOD_IMAGE") {
        sendToBackend(event.data.file);
      }
    };
    window.addEventListener("message", receiveImage);
    return () => window.removeEventListener("message", receiveImage);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) sendToBackend(file);
  };

  return (
    <div className="foodscan-page">
      <div className="foodscan-hero">
        <img
          src="/photos/Logo5.png"
          alt="Shukla Fitness"
          className="foodscan-logo"
        />
        <h1 className="foodscan-main-title">
          Analyze Your <span>Food</span>
        </h1>
        <p className="foodscan-subtitle">
          Scan your meal using camera or upload from gallery and get
          <span> AI-powered calorie & nutrition analysis</span> instantly.
        </p>
      </div>

      <h1 className="foodscan-title">
        Scan Your <span>Food</span>
      </h1>

      {/* ⭐ Grams input */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <label style={{ color: '#ccc', fontSize: 14, display: 'block', marginBottom: 6 }}>
          Enter food weight:
        </label>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button
            onClick={() => setGrams(g => Math.max(1, g - 10))}
            style={gramBtn}
          >−</button>
          <input
            type="number"
            value={grams}
            onChange={e => setGrams(Math.max(1, Number(e.target.value)))}
            min={1}
            style={gramInput}
          />
          <span style={{ color: '#ff6a00', fontWeight: 600 }}>g</span>
          <button
            onClick={() => setGrams(g => g + 10)}
            style={gramBtn}
          >+</button>
        </div>
        <span style={{ color: '#555', fontSize: 11, marginTop: 4, display: 'block' }}>
          Nutrition values calculated per {grams}g
        </span>
      </div>

      {/* Upload box */}
      <div className="foodscan-upload-box">
        <div className="foodscan-icon">📷</div>
        <div className="foodscan-btn-row">
          <button onClick={() => fileRef.current.click()}>Upload</button>
          <button onClick={() => window.open("/camera-window", "_blank")}>Open Camera</button>
        </div>
        <input type="file" hidden ref={fileRef} onChange={handleUpload} accept="image/*" />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={spinnerStyle} className="food-spinner" />
          <p style={{ color: '#ff6a00', marginTop: 10, fontSize: 14 }}>Analyzing your food...</p>
        </div>
      )}

      {/* ⭐ Result card */}
      {result && !loading && (
        <div className="foodscan-result-card">

          {/* Food name */}
          <h2 style={{ textTransform: 'capitalize', marginBottom: 4 }}>
            {result.food}
          </h2>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
            Nutrition for <span style={{ color: '#ff6a00', fontWeight: 600 }}>{result.grams}g</span> serving
          </p>

          {/* ⭐ Nutrition grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}>
            <div style={{ ...nutriBox, gridColumn: '1 / -1' }}>
              <span style={{ ...nutriVal, fontSize: 32 }}>{result.calories}</span>
              <span style={nutriLabel}>kcal</span>
            </div>

            <div style={nutriBox}>
              <span style={nutriVal}>{result.protein}g</span>
              <span style={nutriLabel}>Protein</span>
            </div>

            <div style={nutriBox}>
              <span style={nutriVal}>{result.carbs}g</span>
              <span style={nutriLabel}>Carbs</span>
            </div>

            <div style={{ ...nutriBox, gridColumn: '1 / -1' }}>
              <span style={nutriVal}>{result.fat}g</span>
              <span style={nutriLabel}>Fat</span>
            </div>
          </div>

          {/* ⭐ Quick gram presets */}

        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .food-spinner {
          animation: spin 0.8s linear infinite;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      `}</style>
    </div>
  );
};

const gramBtn = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: '1px solid #ff6a00',
  background: 'transparent',
  color: '#ff6a00',
  fontSize: 18,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
}

const gramInput = {
  width: 70,
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid #ff6a00',
  background: '#1a1a1a',
  color: '#fff',
  fontSize: 18,
  fontWeight: 700,
  textAlign: 'center',
}

const spinnerStyle = {
  width: 40,
  height: 40,
  border: '3px solid #333',
  borderTop: '3px solid #ff6a00',
  borderRadius: '50%',
  margin: '0 auto',
}

export default Scanner;