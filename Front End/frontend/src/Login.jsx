import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

export default function Login({ setLoggedIn, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      console.log('✅ Login Success:', res.data);

      // Save token and user to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setLoggedIn(true);
      setUser(res.data.user);

      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      setShowNotification(true);

      // ✅ Redirect to home with loginSuccess flag
      setTimeout(() => {
        navigate('/', { state: { loginSuccess: true } });
      }, 2000);
    } catch (error) {
      console.error('❌ Login Failed:', error.response?.data || error.message);
      setMessage('Login failed: ' + (error.response?.data?.message || 'Check credentials.'));
      setMessageType('error');
      setShowNotification(true);
    }
  };

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setMessage(null);
        setMessageType(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <>
      {/* Notification bar fixed on top */}
      {showNotification && (
        <div
          className={`position-fixed top-0 start-50 translate-middle-x w-100 mx-auto px-3 py-2 text-center shadow ${
            messageType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'
          }`}
          style={{ zIndex: 1050 }}
          role="alert"
        >
          {message}
        </div>
      )}

      <div className="auth-container mt-5">
        <form className="auth-form shadow p-4 rounded" onSubmit={handleLogin} style={{ maxWidth: 400, margin: 'auto' }}>
          <h3 className="mb-4 text-center">Login</h3>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </>
  );
}
