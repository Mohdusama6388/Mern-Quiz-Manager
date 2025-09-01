import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "./Report.module.css"

const Report = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setMessage("⚠️ Please log in to view reports.");
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3002/report", config);
        setReports(res.data.data || []);
        setMessage("");
      } catch (err) {
        setMessage(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const fetchReportById = async (reportId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3002/report/${reportId}`, config);
      setSelectedReport(res.data.data);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }} className={Style.Container}>
     <h2 className={Style.h2}> My Reports</h2>
      {loading && <p>Loading...</p>}
      {message && <p style={{ color: "red" }}>{message}</p>}

      <div style={{ display: "flex", gap: "20px" }} className={Style.Container1}>
        <div style={{ flex: 1 }}>
          <h3 className={Style.h3}>All Reports</h3>
          {reports.length === 0 && !loading && <p>No reports available.</p>}
          <ul>
            {reports.map((r) => (
              <li
                key={r._id}
                style={{
                  margin: "8px 0",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                  padding: "6px",
                }}
                onClick={() => fetchReportById(r._id)}
              >
                Quiz: {r.quizId} | Score: {r.score}/{r.total}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}className={Style.container2}>
          {selectedReport ? (
            <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
              <h3>Report Details</h3>
              <p><b>Quiz ID:</b> {selectedReport.quizId}</p>
              <p><b>Score:</b> {selectedReport.score}</p>
              <p><b>Total:</b> {selectedReport.total}</p>
              <p><b>Date:</b> {new Date(selectedReport.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className={Style.p}>Select a report to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
