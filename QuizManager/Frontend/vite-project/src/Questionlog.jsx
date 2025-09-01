

import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizInterface = ({ quizId }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3002/quiz/${quizId}`, config);
        if (res.data.status === "success") {
          setQuestions(res.data.data.questions_list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchQuestions();
  }, [quizId]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/questionLog/${quizId}/all`, config);
      if (res.data.status === "success") setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = async () => {
    const question = questions[current];
    if (!question) return;

    try {
      await axios.post(
        `http://localhost:3002/questionLog/${quizId}/${question.question_number}/submit`,
        { answer },
        config
      );
      setAnswer("");
      setCurrent(current + 1);
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!questions.length) return <p>No questions found.</p>;

  const currentQuestion = questions[current];
  if (!currentQuestion) return <p>Quiz completed!</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quiz: {quizId}</h2>
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Question {currentQuestion.question_number}:</strong> {currentQuestion.question}</p>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
        />
        <button onClick={handleNext} style={{ marginLeft: "10px" }}>Submit</button>
      </div>

      <h3>Previous Logs:</h3>
      {logs.map((log) => (
        <div key={`${log.userId}-${log.quizId}-${log.question_number}`} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p><strong>Question:</strong> {log.question_number}</p>
          <p><strong>Answer:</strong> {log.answer || "Not answered"}</p>
          <p><strong>Displayed At:</strong> {log.displayedAt ? new Date(log.displayedAt).toLocaleString() : "N/A"}</p>
          <p><strong>Answered At:</strong> {log.answeredAt ? new Date(log.answeredAt).toLocaleString() : "N/A"}</p>
          <p><strong>Time Taken:</strong> {log.timeTaken ? `${log.timeTaken} sec` : "N/A"}</p>
        </div>
      ))}
    </div>
  );
};

export default QuizInterface;
