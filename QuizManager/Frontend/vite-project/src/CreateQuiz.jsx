
import React, { useState } from "react";
import axios from "axios";
import Style from "./CreateQuiz.module.css"

const QuizManager = () => {
  const [quizId, setQuizId] = useState("");
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([
    { question_number: 1, question: "", options: { a: "", b: "", c: "", d: "" } }
  ]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:3002/quiz"; 
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };


  const handleOptionChange = (qIndex, optKey, value) => {
    const updated = [...questions];
    updated[qIndex].options[optKey] = value;
    setQuestions(updated);
  };

  
  const handleAnswerChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex + 1]: value });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question_number: questions.length + 1, question: "", options: { a: "", b: "", c: "", d: "" } }
    ]);
  };


  const validateQuiz = () => {
    if (!quizName) return "Quiz name is required!";
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question) return `Question ${i + 1} is empty`;
      for (let opt of ["a", "b", "c", "d"]) {
        if (!questions[i].options[opt]) return `Option ${opt.toUpperCase()} of Question ${i + 1} is empty`;
      }
      if (!answers[i + 1]) return `Answer for Question ${i + 1} is not selected`;
    }
    return null;
  };

  const handleCreate = async () => {
    if (!token) return setMessage("Please login first!");
    const error = validateQuiz();
    if (error) return setMessage(" " + error);
    try {
      const res = await axios.post(API_URL, { name: quizName, questions_list: questions, answers }, config);
      const createdId = res.data.data._id || res.data.data.quizId;
      setMessage(" Quiz created! ID: " + createdId);
      setQuizId(createdId);
    } catch (err) {
      setMessage(" " + (err.response?.data?.message || err.message));
    }
  };

  const handleGet = async () => {
    if (!quizId) return setMessage(" Enter Quiz ID");
    try {
      const res = await axios.get(`${API_URL}/${quizId}`, config);
      const data = res.data.data;
      setQuizName(data.name);
      setQuestions(data.questions_list);
      setAnswers(data.answers);
      setMessage(" Quiz fetched!");
    } catch (err) {
      setMessage(" " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!quizId) return setMessage(" Enter Quiz ID");
    try {
      const res = await axios.delete(`${API_URL}/${quizId}`, config);
      setMessage(" " + res.data.message);
      setQuizId("");
      setQuizName("");
      setQuestions([{ question_number: 1, question: "", options: { a: "", b: "", c: "", d: "" } }]);
      setAnswers({});
    } catch (err) {
      setMessage(" " + (err.response?.data?.message || err.message));
    }
  };

  
  const handlePublish = async () => {
    if (!quizId) return setMessage(" Enter Quiz ID");
    try {
      const res = await axios.patch(`${API_URL}/publish`, { quizId }, config);
      setMessage(" " + res.data.message);
    } catch (err) {
      setMessage(" " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: "20px" }} className={Style.container1}>
      <h2>Create Quiz</h2>
      {message && <p>{message}</p>}
      <input className={Style.input1}
        type="text"
        placeholder="Quiz ID (for Get/Update/Delete/Publish)"
        value={quizId}
        onChange={(e) => setQuizId(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

    
      <input className={Style.input1}
        type="text"
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
    
      />
  
    
      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }} className={Style.Container}>
          <h4 className={Style.h4}>Question {qIndex + 1}</h4>
          <input className={Style.input}
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
            style={{ display: "block", marginBottom: "5px" }}
          />
          {["a", "b", "c", "d"].map((opt) => (
            <input className={Style.input}
              key={opt}
              type="text"
              placeholder={`Option ${opt.toUpperCase()}`}
              value={q.options[opt]}
              onChange={(e) => handleOptionChange(qIndex, opt, e.target.value)}
              style={{ display: "block", marginBottom: "5px" }}
            />
          ))}
          <select className={Style.Select}
            onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
            value={answers[qIndex + 1] || ""}
            style={{ display: "block", marginTop: "5px" }}
          >
            <option value="" className={Style.option}>Select Correct Answer</option>
            {["a", "b", "c", "d"].map((opt) => (
              <option key={opt} value={opt} className={Style.option}>{opt.toUpperCase()}</option>
            ))}
          </select>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className={Style.btn}>+ Add Another Question</button>
      <br /><br />

    
      <button type="button" onClick={handleCreate} className={Style.btn}>Create</button>
      <button type="button" onClick={handleGet} disabled={!quizId} className={Style.btn}> Get</button>
      <button type="button" onClick={handleDelete} disabled={!quizId} className={Style.btn}> Delete</button>
      <button type="button" onClick={handlePublish} disabled={!quizId} className={Style.btn}> Publish</button>
    </div>
  );
};

export default QuizManager;
