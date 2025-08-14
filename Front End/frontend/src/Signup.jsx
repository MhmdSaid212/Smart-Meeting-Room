import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

export default function Signup() {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_picture: null,
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, profile_picture: file });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    if (formData.profile_picture) {
      payload.append('profile_picture', formData.profile_picture);
    }

    try {
      const res = await api.post('/register', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Registration Success:', res.data);

      setMessage('Account created successfully! Redirecting to login...');
      setMessageType('success');
      setShowNotification(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('❌ Registration Error:', error.response?.data || error.message);
      setMessage('Signup failed: ' + (error.response?.data?.message || 'Please check your inputs.'));
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
        <form className="auth-form shadow p-4 rounded" onSubmit={handleSignup} style={{ maxWidth: 400, margin: 'auto' }}>
          <h3 className="mb-4 text-center">Sign Up</h3>
          <div className="mb-3">
            <label>Full Name</label>
            <input name="name" type="text" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input name="email" type="email" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input name="password" type="password" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Profile Picture</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
          </div>
          {preview && (
            <div className="text-center mb-3">
              <img
                src={preview}
                alt="Preview"
                className="img-thumbnail rounded-circle"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          )}
          <button type="submit" className="btn btn-success w-100">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}
