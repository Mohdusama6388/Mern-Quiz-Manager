import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; 
import Style from "./Register.module.css"

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        console.log("Decoded UserId:", userId);

        if (!userId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:3002/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.response?.data?.message || "Authentication failed");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading user details...</h2>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }} className={Style.card}>
        <h2 className={Style.container}>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/login")} className={Style.btn}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }} className={Style.card}>
      <h1>Welcome, {user?.name} </h1>
      <p>Email: {user?.email}</p>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
    
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout} className={Style.btn}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
