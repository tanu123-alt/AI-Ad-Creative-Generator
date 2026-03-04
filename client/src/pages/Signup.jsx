import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h2>Sign Up</h2>

      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button onClick={() => navigate("/generate")}>
        Create Account
      </button>

      <p>
        Already have an account?
        <span onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;