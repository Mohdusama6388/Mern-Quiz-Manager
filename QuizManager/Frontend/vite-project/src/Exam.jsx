import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Style from "./Exam.module.css";

const Exam = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLogs, setTimeLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(0);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!quizId) return setMessage("No quiz selected.");

    const fetchQuizAndLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/quiz/${quizId}`, config);
        const quizData = res.data.data;

        const formattedQuestions = quizData.questions_list.map(q => ({
          ...q,
          options: { a: "", b: "", c: "", d: "", ...q.options },
        }));
        setQuiz({ ...quizData, questions_list: formattedQuestions });

        const logsRes = await axios.get(`http://localhost:3002/questionLog/${quizId}/all`, config);
        if (logsRes.data.status === "success") {
          const allTimeLogs = {};
          const allAnswers = {};
          logsRes.data.data.forEach(log => {
            if (log.answer) allAnswers[log.question_number] = log.answer;
            if (log.timeTaken !== undefined) allTimeLogs[log.question_number] = log.timeTaken;
          });
          setAnswers(allAnswers);
          setTimeLogs(allTimeLogs);
        }
      } catch (err) {
        console.error("Error loading quiz:", err?.response?.data || err.message || err);
        setMessage("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndLogs();
  }, [quizId]);

  
  useEffect(() => {
    const logDisplayedAt = async () => {
      if (!quiz || current >= quiz.questions_list.length) return;
      const qNum = quiz.questions_list[current].question_number;
      try {
        await axios.get(`http://localhost:3002/questionLog/${quizId}/${qNum}`, config);
        const logsRes = await axios.get(`http://localhost:3002/questionLog/${quizId}/all`, config);
        if (logsRes.data.status === "success") {
          setTimeLogs(prev => {
            const updated = { ...prev };
            logsRes.data.data.forEach(log => {
              if (log.timeTaken !== undefined) updated[log.question_number] = log.timeTaken;
            });
            return updated;
          });
        }
      } catch (err) {
        console.error("Error logging displayedAt:", err?.response?.data || err.message);
      }
    };
    logDisplayedAt();
  }, [current, quiz, quizId]);

  const handleAnswerChange = async (qNum, value) => {
    setAnswers(prev => ({ ...prev, [qNum]: value }));
    try {
      const res = await axios.post(
        `http://localhost:3002/questionLog/${quizId}/${qNum}/submit`,
        { answer: value },
        config
      );
      if (res.data.status === "success") {
        setTimeLogs(prev => ({ ...prev, [qNum]: res.data.data.timeTaken }));
      }
    } catch (err) {
      console.error("Submit answer error:", err?.response?.data || err.message);
      setMessage(" Error submitting answer. Please try again.");
    }
  };

  const handleNext = () => { if (current < quiz.questions_list.length - 1) setCurrent(current + 1); };
  const handlePrev = () => { if (current > 0) setCurrent(current - 1); };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3002/exam",
        { quizId, attempted_question: answers },
        config
      );
      setMessage(` Quiz submitted! Score: ${res.data.data.score}/${res.data.data.total}`);
    } catch (err) {
      console.error("Submit exam error:", err?.response?.data || err.message);
      setMessage(" Error submitting exam. Please try again.");
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>{message}</p>;

  const currentQuestion = quiz.questions_list[current];

  return (
    <div className={Style.Container} style={{ padding: "20px" }}>
      <h2 className={Style.h2}>Exam: {quiz.name}</h2>

      <div className={Style.container1} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <h4>Question {currentQuestion.question_number}: {currentQuestion.question}</h4>

        {["a","b","c","d"].map(opt => (
          <div key={opt}>
            <label>
              <input
                type="radio"
                name={`question_${currentQuestion.question_number}`}
                value={opt}
                checked={answers[currentQuestion.question_number] === opt}
                onChange={() => handleAnswerChange(currentQuestion.question_number, opt)}
              />
              {opt.toUpperCase()}: {currentQuestion.options[opt]}
            </label>
          </div>
        ))}

        {timeLogs[currentQuestion.question_number] !== undefined && (
          <p style={{ color: "green" }}>⏱ Time Taken: {timeLogs[currentQuestion.question_number]} sec</p>
        )}
      </div>

      <div style={{ marginTop: "10px" }}>
        <button className={Style.btn1}  onClick={handlePrev} disabled={current === 0}>Previous</button>
        <button   className={Style.btn1} onClick={handleNext} disabled={current === quiz.questions_list.length - 1}>Next</button>
      </div>

      <button className={Style.btn} onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px 20px" }}>Submit Exam</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Exam;
