import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './axios';
import './Home.css';

export default function Home({ user }) {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: 0, color: '#4e73df' },
    { label: 'Available Rooms', value: 0, color: '#1cc88a' },
    { label: 'Admins', value: 0, color: '#f6c23e' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, roomsRes, adminsRes] = await Promise.all([
          api.get('/users'),
          api.get('/rooms'),
          api.get('/users?role=admin')
        ]);

        setStats([
          { label: 'Total Users', value: usersRes.data.length, color: '#4e73df' },
          { label: 'Available Rooms', value: roomsRes.data.length, color: '#1cc88a' },
          { label: 'Admins', value: adminsRes.data.length, color: '#f6c23e' },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
      const target = circle.getAttribute('data-value');
      circle.style.strokeDasharray = `0, 100`;
      let progress = 0;
      const interval = setInterval(() => {
        progress++;
        circle.style.strokeDasharray = `${progress * 2.78}, 100`;
        if (progress >= target) clearInterval(interval);
      }, 10);
    });
  }, [stats]);

  return (
    <div className="home-wrapper">
      {user?.role?.trim().toLowerCase() === 'admin' && (
        <div className="admin-bar text-white d-flex justify-content-center align-items-center mb-3">
          <Link to="/advanced" className="me-3 text-white">Admin Dashboard</Link>
          <Link to="/rooms" className="me-3 text-white">Manage Rooms</Link>
          <Link to="/profile" className="text-white">Manage Users</Link>
        </div>
      )}

      {/* Hero */}
      <section className="hero-section text-white text-center d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Smart Meeting Room Manager</h1>
          <p className="lead">Easily manage your meeting spaces, schedules, and team collaboration.</p>
          <Link to="/signup" className="btn btn-primary btn-lg mt-3">Get Started</Link>
        </div>
      </section>

      {/* Stats / Meters */}
      <section className="stats-section py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">Platform Stats</h2>
          <div className="row justify-content-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="stat-meter-wrapper">
                  <svg viewBox="0 0 36 36" className="circular-chart" style={{ color: stat.color }}>
                    <path className="circle-bg"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle"
                          data-value={stat.value}
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{stat.value}</text>
                  </svg>
                  <h5 className="mt-2">{stat.label}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-5">
        <div className="container text-center">
          <h2 className="mb-4">Why Use Our Platform?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Book Smart Rooms</h5>
                  <p className="card-text">Reserve meeting spaces instantly and avoid conflicts.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Live Scheduling</h5>
                  <p className="card-text">See live availability of rooms and upcoming meetings.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Manage Users</h5>
                  <p className="card-text">Organize and assign team access and meeting roles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Illustration 
      <section className="text-center py-5 bg-light">
        <div className="container">
          <img src="https://via.placeholder.com/800x400?text=Smart+Meeting+Dashboard+Illustration" alt="Dashboard Illustration" className="img-fluid rounded shadow" />
        </div>
      </section>*/}

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-3">
        <div className="container">
          &copy; {new Date().getFullYear()} Smart Meeting Room App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
