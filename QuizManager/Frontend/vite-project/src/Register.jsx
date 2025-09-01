import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Style from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_Password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/auth/', formData);
      console.log(response.data);
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className={Style.card}>
      <h2>Register</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className={Style.input} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input className={Style.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className={Style.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input className={Style.input} type="password" name="confirm_Password" placeholder="Confirm Password" value={formData.confirm_Password} onChange={handleChange} required />
        <button type="submit" className={Style.btn}>Register</button>
      </form>

      <p className={Style.linkText}>
        Already have an account? <Link to="/login" className={Style.link}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
