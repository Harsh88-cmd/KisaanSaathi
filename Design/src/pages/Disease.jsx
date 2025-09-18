import React, { useState } from "react";
import axios from "axios";

const DiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // ✅ Preview
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (error) {
      console.error("Error detecting disease:", error);
      alert("Failed to detect disease. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success fw-bold mb-4">
        🌱 Pest & Disease Detection
      </h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={handleImageChange}
      />

      {/* Image Preview */}
      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "300px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      {/* Detect Button */}
      <button
        className="btn btn-success btn-lg shadow"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "🔍 Detecting..." : "Detect Disease"}
      </button>

      {/* Results */}
      {result && (
        <div className="card shadow-lg p-4 mt-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h4 className="text-danger mb-3">🦠 Disease: {result.disease}</h4>
          <p className="text-primary fs-5">
            💡 <strong>Solution:</strong> {result.solution}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
