import React from 'react';

export default function AuthForm({ isLogin, toggleForm }) {
  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>

      <form>
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input type="text" className="form-control" id="name" placeholder="Enter your full name" />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" placeholder="Enter your email" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter your password" />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-3 text-center">
        <button
          className="btn btn-link"
          onClick={toggleForm}
          type="button"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
