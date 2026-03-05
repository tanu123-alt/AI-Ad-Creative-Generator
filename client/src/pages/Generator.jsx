import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function Generate() {
  const [form, setForm] = useState({
    product: "",
    audience: "",
    platform: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ads/generate",
        form
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating ad");
    }

    setLoading(false);
  };

  return (
    <div className="generate-page">
      <h1 className="generate-title">Create Your AI Ad</h1>

      <form className="generate-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="product"
          placeholder="Enter Product (e.g. Shoes)"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="audience"
          placeholder="Target Audience (e.g. Students)"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="platform"
          placeholder="Platform (e.g. Instagram)"
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading ? "Generating..." : "Generate Ad 🚀"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <h2>{result.headline}</h2>
          <p>{result.caption}</p>
          <p>{result.hashtags}</p>

          <img
            src={`http://localhost:5000/generated/${result.image}`}
            alt="Generated"
          />
        </div>
      )}
    </div>
  );
}

export default Generate;