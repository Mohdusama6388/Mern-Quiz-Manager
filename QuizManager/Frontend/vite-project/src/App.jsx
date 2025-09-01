
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import CreateQuiz from './CreateQuiz';
import Dashboard from './Dashboard';
import Report from './Report';
import Questionlog from './Questionlog';
import Bookmark from './Bookmark';
import Exam from './Exam';
import Quizzes from './Quizzes';
import LeaderboardPage from './Leaderboard';
import Layout from './Layout';

function App() {
  return ( 
<Layout>
  
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<CreateQuiz />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam/:quizId" element={<Exam />} /> 
        <Route path="/bookmark" element={<Bookmark />} /> 
        <Route path="/questionlog" element={<Questionlog />} /> 
        <Route path="/report" element={<Report />} /> 
        <Route path="/my-quizzes" element={<Quizzes />} />
        <Route path="/leaderboard/:quizId" element={<LeaderboardPage />} />
      </Routes>
</Layout>
  );
}

export default App;
