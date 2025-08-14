import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './Imgs/logo.png';
import NotificationsBell from './NotificationsBell';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar({ loggedIn, setLoggedIn, user, setUser }) {
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show banner after login
  useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowBanner(true);

      const timer = setTimeout(() => {
        setShowBanner(false);
        navigate(location.pathname, { replace: true }); // clear the state
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/login', { replace: true }); 
    setUser(null);
  };

  const avatar = user?.profile_picture
    ? user.profile_picture
    : 'https://via.placeholder.com/40';

  return (
    <>
      {/* ✅ Top Login Success Banner */}
      {showBanner && (
        <div
          className="w-100 bg-success text-white text-center py-2 fixed-top"
          style={{ zIndex: 1050 }}
        >
           Login successful
        </div>
      )}

      {/* ✅ Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light shadow-sm"
        style={{ marginTop: showBanner ? '40px' : '0px' }}
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="Logo"
              style={{ width: 75, height: 75, marginLeft: -50, marginTop: -10 }}
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/rooms">
                  Rooms
                </Link>
              </li>
              {loggedIn && user?.role?.toLowerCase() === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/advanced">
                    Advanced
                  </Link>
                </li>
              )}
            </ul>

            <ul className="navbar-nav align-items-center">
              {!loggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item me-3">
  <NotificationsBell />
</li>
<li className="nav-item">
  <Link to="/profile" className="d-inline-block">
    <img
      src={avatar}
      alt="profile"
      className="rounded-circle border"
      style={{ width: 40, height: 40, objectFit: 'cover' }}
    />
  </Link>
</li>
<li className="nav-item me-2">
  <button
    className="btn btn-outline-danger btn-sm ms-2"
    onClick={handleLogout}
  >
    Logout
  </button>
</li>

                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
