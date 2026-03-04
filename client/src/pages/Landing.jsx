import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1 className="title">AI Ad Creative Generator</h1>
      <p className="subtitle">
        Create powerful AI-generated ads with stunning visuals.
      </p>

      <button
        className="btn"
        onClick={() => navigate("/login")}
      >
        Let's Go 🚀
      </button>
    </div>
  );
}

export default Landing;