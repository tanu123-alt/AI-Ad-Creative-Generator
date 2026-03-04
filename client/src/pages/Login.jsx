import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h2>Login</h2>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button onClick={() => navigate("/generate")}>
        Login
      </button>

      <p>
        Don't have an account?
        <span onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default Login;