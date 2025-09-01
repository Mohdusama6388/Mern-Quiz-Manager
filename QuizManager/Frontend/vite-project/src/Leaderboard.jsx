
import { useState, useEffect } from "react";
import axios from "axios";
import Style from "./Leaderboard.module.css"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    username: "",
    quizId: "",
    score: "",
    total: ""
  });

  const token = localStorage.getItem("token"); 
  const API_URL = "http://localhost:3002/leaderboard";

  const fetchLeaderboard = async (id = "") => {
    try {
      setLoading(true);
      const url = id ? `${API_URL}/${id}` : API_URL;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(res.data.data || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };


  const saveScore = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Score saved!");
      fetchLeaderboard(form.quizId || ""); 
    } catch (err) {
      console.error("Error saving score:", err);
      alert("Failed to save score");
    }
  };

  useEffect(() => {
    fetchLeaderboard(); 
  }, []);

  return (
  
    <div className={Style.container}>
      <h1 className={Style.h1}>Leaderboard</h1>

      <div className={Style.container1}>
        <button 
          className={Style.btn}
          onClick={() => fetchLeaderboard("")}
        >
          Global Leaderboard
        </button>
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className={Style.input}
        />
        <button
          className={Style.btn}
          onClick={() => fetchLeaderboard(quizId)}
        >
          Quiz Leaderboard
        </button>
      </div>

      {loading ? (
        <p className={Style.p}>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-center text-gray-500">No scores found.</p>
      ) : (
        <table className={Style.table}>
          <thead className={Style.thread}>
            <tr>
              <th className="p-2 border">Rank</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item, index) => (
              <tr
                key={item._id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border">{item.username}</td>
                <td className="p-2 border text-center font-semibold">
                  {item.score}
                </td>
                <td className="p-2 border text-center">{item.total}</td>
                <td className="p-2 border text-center">
                  {new Date(item.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-10">
        <h2 className={Style.h2}>Submit Score</h2>
        <form onSubmit={saveScore} className={Style.form}>
          <input 
            type="text"
            placeholder="User ID"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className={Style.input}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={Style.input}
            required
          />
          <input
            type="text"
            placeholder="Quiz ID"
            value={form.quizId}
            onChange={(e) => setForm({ ...form, quizId: e.target.value })}
            className={Style.input}
            required
          />
          <input
            type="number"
            placeholder="Score"
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
            className={Style.input}
            required
          />
          <input
            type="number"
            placeholder="Total"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
            className={Style.input}
            required
          />
          <button
            type="submit"
            className={Style.btn}
          >
            Save Score
          </button>
        </form>
      </div>
    </div>

  );
}
