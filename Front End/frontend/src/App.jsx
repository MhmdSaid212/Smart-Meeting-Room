import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import Rooms from './Rooms';
import Home from './Home';
import ProfilePage from './Profile';
import Advanced from './Advanced';
import api from './axios';
import './auth.css';
import './App.css';
import MeetingsPage from './Meetings';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setLoggedIn(true);
    }

    const validateUser = async () => {
      try {
        const response = await api.get('/user');
        const freshUser = response.data.user;

        setUser(freshUser);
        setLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch (error) {
        console.error('User validation failed:', error);
        setUser(null);
        setLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    if (token) {
      validateUser();
    }
  }, []);

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute loggedIn={loggedIn} user={user}>
              <Rooms user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute loggedIn={loggedIn} user={user}>
              <ProfilePage user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advanced"
          element={
            <ProtectedRoute loggedIn={loggedIn} user={user} adminOnly={true}>
              <Advanced />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:roomId"
          element={
            <ProtectedRoute loggedIn={loggedIn} user={user}>
              <MeetingsPage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for unknown URLs */}
        <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}