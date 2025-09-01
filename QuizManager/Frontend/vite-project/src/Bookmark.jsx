
import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "./Bookmark.module.css"

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [questionNumber, setQuestionNumber] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);
  const API = axios.create({
    baseURL: "http://localhost:3002/bookmark",
  });

  API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  const fetchBookmarks = async () => {
    if (!quizId) return; 
    try {
      setLoading(true);
      const { data } = await API.get(`/${quizId}`);
      setBookmarks(data.data || []);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (quizId) fetchBookmarks();
  }, [quizId]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!quizId || !questionNumber) {
      alert("Quiz ID and Question Number are required!");
      return;
    }
    try {
      await API.post("/", {
        quizId,
        question_number: Number(questionNumber),
        questionText,
      });
      setQuestionNumber("");
      setQuestionText("");
      fetchBookmarks();
    } catch (err) {
      console.error("Error adding bookmark:", err);
      alert(err.response?.data?.message || "Error adding bookmark");
    }
  };

  const handleRemove = async (qid, qNumber) => {
    try {
      await API.delete("/", {
        data: { quizId: qid, question_number: qNumber },
      });
      fetchBookmarks();
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  return (
    <div className={Style.container}>
      <h1 className={Style.h1}>📑Quiz Bookmarks</h1>


      <div className={Style.card} >
        <input className={Style.input}
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
    
        />
        <button 
          onClick={fetchBookmarks}
          className={Style.btn}
        >
          Load Bookmarks
        </button>
      </div>

      <form 
        onSubmit={handleAddBookmark}
        className={Style.form}
      >
        <input
          type="number"
          placeholder="Enter Question Number"
          value={questionNumber}
          onChange={(e) => setQuestionNumber(e.target.value)}
          className={Style.input}
        />
        <input
          type="text"
          placeholder="Enter Question Text (optional)"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className={Style.input}
        />
        <button
          type="submit"
          className={Style.btn1}
        >
          Add Bookmark
        </button>
      </form>

  
      {loading ? (
        <p className={Style.p}>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p className={Style.p}>No bookmarks found for this quiz.</p>
      ) : (
        <ul className={Style.ul}>
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark._id}
              className={Style.li}
            >
              <div className={Style.container1}>
                <p className={Style.p}>
                  Q{bookmark.question_number}: {bookmark.questionText || "Untitled"}
                </p>
                <small className="text-gray-500">Quiz ID: {bookmark.quizId}</small>
              </div>
              <button 
                onClick={() => handleRemove(bookmark.quizId, bookmark.question_number)}
                className={Style.btn}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarkPage;
