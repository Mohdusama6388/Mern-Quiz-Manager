

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Style from "./Quizzes.module.css"

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3002/Quizzes/my-quizzes",
          config
        );
        setQuizzes(res.data.data);

    
        const allBookmarks = {};
        await Promise.all(
          res.data.data.map(async (quiz) => {
            if (quiz.is_published) {
              try {
                const bookmarkRes = await axios.get(
                  `http://localhost:3002/bookmark/${quiz._id}`,
                  config
                );
                allBookmarks[quiz._id] = bookmarkRes.data.data;
              } catch (err) {
                allBookmarks[quiz._id] = [];
              }
            }
          })
        );
        setBookmarks(allBookmarks);
      } catch (err) {
        setMessage(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addBookmark = async (quizId, question_number, questionText) => {
    try {
      const res = await axios.post(
        "http://localhost:3002/bookmark/",
        { quizId, question_number, questionText },
        config
      );
      setBookmarks((prev) => ({
        ...prev,
        [quizId]: prev[quizId]
          ? [...prev[quizId], res.data.data]
          : [res.data.data],
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add bookmark");
    }
  };


  const removeBookmark = async (quizId, question_number) => {
    try {
      await axios.delete("http://localhost:3002/bookmark/", {
        data: { quizId, question_number },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks((prev) => ({
        ...prev,
        [quizId]: prev[quizId].filter(
          (b) => b.question_number !== question_number
        ),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove bookmark");
    }
  };

  if (loading) return <p>Loading your quizzes...</p>;
  if (!quizzes.length)
    return <p>{message || "You have not created any quiz yet."}</p>;

  return (
    <div style={{ padding: "20px" }} className={Style.Container}>
      <h2 className={Style.h2}>My Quizzes</h2>
      {quizzes.map((quiz) => (
        <div className={Style.container1}
          key={quiz._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <h3 className={Style.h3}>{quiz.name}</h3>
          <p className={Style.p}>Status: {quiz.is_published ? "✅ Published" : "❌ Not Published"}</p>

          {quiz.is_published && (
            <>
              <div className={Style.container2}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Link to={`/Exam/${quiz._id}`}>
                  <button className={Style.btn}>Start Quiz</button>
                </Link>
              </div>

              <div>
                <h4 className={Style.h4}>Bookmarked Questions</h4>
                {bookmarks[quiz._id]?.length ? (
                  <ul>
                    {bookmarks[quiz._id].map((b) => (
                      <li key={b._id}>
                        Q#{b.question_number}: {b.questionText || "No text"}{" "}
                        <button className={Style.btn}
                          onClick={() =>
                            removeBookmark(quiz._id, b.question_number)
                          }
                          style={{
                            marginLeft: "10px",
                            padding: "2px 6px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bookmarks yet.</p>
                )}

                <div style={{ marginTop: "10px" }} className={Style.container3}>
                  {quiz.questions_list && quiz.questions_list.length > 0 ? (
                    quiz.questions_list.map((question) => {
                      const qNum = question.question_number;
                      return (
                        <button className={Style.btn}
                          key={qNum}
                          onClick={() =>
                            addBookmark(
                              quiz._id,
                              qNum,
                              question.question || `Question ${qNum}`
                            )
                          }
                          disabled={bookmarks[quiz._id]?.some(
                            (b) => b.question_number === qNum
                          )}
                          style={{
                            marginRight: "5px",
                            marginBottom: "5px",
                            padding: "6px 12px",
                            backgroundColor: bookmarks[quiz._id]?.some(
                              (b) => b.question_number === qNum
                            )
                              ? "#aaa"
                              : "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Bookmark Q{qNum}
                        </button>
                      );
                    })
                  ) : (
                    <p style={{ color: "gray" }}>No questions available for this quiz.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {!quiz.is_published && (
            <p style={{ color: "red" }}>This quiz is not published yet</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyQuizzes;
