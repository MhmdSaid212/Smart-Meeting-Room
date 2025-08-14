import React, { useState, useEffect, useRef } from 'react';
import api from './axios';
import { toast } from 'react-toastify';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
      console.error(err);
    }
  };

const markAsRead = async (id) => {
  try {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );
    return true; // so it can be awaited
  } catch (err) {
    console.error(err);
    return false;
  }
};

const markAllAsRead = async () => {
  const unread = notifications.filter((n) => n.status === 'unread');
  if (unread.length === 0) return;

  try {
    await Promise.all(
      unread.map((n) => api.put(`/notifications/${n.id}/read`))
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
  } catch (err) {
    console.error('Error marking all as read:', err);
  }
};

const handleJoin = async (notification) => {
  try {
    const readSuccess = await markAsRead(notification.id);
    if (!readSuccess) return;

    if (notification.meeting_id) {
      window.location.href = `/meetings/${notification.room_id}`;
    } else {
      toast.error('No meeting linked to this notification.');
    }
  } catch (err) {
    console.error('Error joining room:', err);
  }
};



  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const toggleDropdown = async () => {
    const newState = !open;
    setOpen(newState);
    if (newState) {
      await markAllAsRead(); // mark all as read when opening
    }
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-outline-secondary position-relative"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-menu show" style={{ right: 0, left: 'auto', minWidth: 300 }}>
          {notifications.length === 0 && (
            <div className="dropdown-item text-muted">No notifications</div>
          )}
          {notifications.map((n) => (
            
            <div
              key={n.id}
              className={`dropdown-item d-flex justify-content-between align-items-center ${n.status === 'unread' ? 'fw-bold' : ''}`}
              style={{ whiteSpace: 'normal' }}
            >
                
              <div style={{ flex: 1 }}>
                {n.message}
              </div>

              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleJoin(n)}
                >
                  Join
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(n.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
