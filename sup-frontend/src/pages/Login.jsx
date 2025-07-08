import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';




function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      localStorage.setItem('latitude', latitude);
      localStorage.setItem('longitude', longitude);
    });
  }
}, []);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const latitude = localStorage.getItem('latitude');
      const longitude = localStorage.getItem('longitude');
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        //usernameOrEmail: formData.usernameOrEmail,
        username: formData.usernameOrEmail,
        password: formData.password,
        latitude,
        longitude
      });

      const token = res.data.token;
      localStorage.setItem('token', token); // store for later

      //alert('Login successful!');
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="usernameOrEmail"
          placeholder="Username or Email"
          value={formData.usernameOrEmail}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
