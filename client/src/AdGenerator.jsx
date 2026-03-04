import React, { useState } from "react";
import { generateAd } from "../api";

const AdGenerator = () => {
  const [form, setForm] = useState({
    product: "",
    audience: "",
    platform: ""
  });

  const [ad, setAd] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await generateAd(form);
      setAd(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating ad");
    }
  };

  return (
    <div>
      <h2>Generate Ad</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="product"
          placeholder="Product"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="audience"
          placeholder="Audience"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="platform"
          placeholder="Platform"
          onChange={handleChange}
          required
        />
        <button type="submit">Generate</button>
      </form>

      {ad && (
        <div>
          <h3>{ad.headline}</h3>
          <p>{ad.caption}</p>
          <p>{ad.hashtags}</p>
          <img
            src={`http://localhost:5000/generated/${ad.image}`}
            alt="Generated Ad"
            width="300"
          />
        </div>
      )}
    </div>
  );
};

export default AdGenerator;