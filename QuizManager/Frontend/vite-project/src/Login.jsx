import React, { useState } from "react";
import axios from "axios";
 import { useNavigate,Link } from "react-router-dom";
import Style from "./Login.module.css";

const Login = () => {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/login",
        formData
      );

      console.log("Login Response:", response.data); 


      const token = response.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      let userId = response.data?.data?.userId; 
      if (!userId && response.data?.data?.user?._id) {
        userId = response.data.data.user._id; 
      }

      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        console.warn("UserId not found in response");
      }

       navigate("/dashboard"); 
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className={Style.card}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className={Style.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className={Style.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className={Style.btn} type="submit">
          Login
        </button>
      </form>

      <p className={Style.linkText}>
        Don’t have an account?{" "}
        <Link to="/" className={Style.link}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
