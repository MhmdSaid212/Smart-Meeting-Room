import React, { useState, useEffect } from 'react';
import api from './axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { useNavigate } from 'react-router-dom';





export default function Rooms({ user }) {
  // Room data states
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Room management modal
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    capacity: '',
    features: ''
  });

  // Booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStart, setBookingStart] = useState(new Date());
  const [bookingDuration, setBookingDuration] = useState(60); // Default 60 minutes
  const [bookingLoading, setBookingLoading] = useState(false);
  const [roomBookings, setRoomBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookingListModal, setShowBookingListModal] = useState(false);
  const [selectedRoomForBookings, setSelectedRoomForBookings] = useState(null);
  const [selectedRoomBookings, setSelectedRoomBookings] = useState([]);
  const [showBookingDeleteModal, setShowBookingDeleteModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);




// State management
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [roomToDelete, setRoomToDelete] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);

// Delete initiation
const handleDeleteClick = (roomId) => {
  setRoomToDelete(roomId);
  setShowDeleteModal(true);
};

// Actual deletion
const confirmDelete = async () => {
  if (!roomToDelete) return;
  
  setIsDeleting(true);
  try {
    await api.delete(`/rooms/${roomToDelete}`);
    toast.success('Room deleted successfully');
    fetchRooms(); // Refresh your room list
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to delete room');
    console.error('Delete error:', error);
  } finally {
    setIsDeleting(false);
    setShowDeleteModal(false);
    setRoomToDelete(null);
  }
};



  // Fetch bookings for all rooms
  const fetchBookings = async () => {
    try {
      // Fetch all bookings (optionally you can filter by user or rooms)
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    }
  };

  // Fetch bookings after rooms fetched
  useEffect(() => {
    fetchBookings();
  }, []);

  const showBookings = async (room) => {
    setSelectedRoomForBookings(room);
    setShowBookingListModal(true);

    try {
      const res = await api.get('/bookings', { params: { room_id: room.id } });
      setSelectedRoomBookings(res.data);
    } catch (error) {
      toast.error('Failed to load bookings for the room');
      setSelectedRoomBookings([]);
    }
  };
const navigate = useNavigate();


  // Fetch rooms from API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      toast.error('Failed to fetch rooms');
    }
    setLoading(false);
  };

  // Load rooms on mount and setup refresh
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Room management functions
  const openAddModal = () => {
    setModalMode('add');
    setForm({ name: '', location: '', capacity: '', features: '' });
    setCurrentRoom(null);
    setShowRoomModal(true);
  };

  const openEditModal = (room) => {
    setModalMode('edit');
    setForm({
      name: room.name,
      location: room.location,
      capacity: room.capacity,
      features: room.features
    });
    setCurrentRoom(room);
    setShowRoomModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      await api.delete(`/bookings/${bookingToCancel.id}`);
      toast.success('Booking cancelled');
      setShowBookingDeleteModal(false);
      setBookingToCancel(null);

      // Refresh bookings list for the current room
      if (selectedRoom) {
        const res = await api.get(`/bookings?room_id=${selectedRoom.id}`);
        setRoomBookings(res.data);
      }
      fetchRooms();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };


  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
  await api.post('/rooms', { ...form, availability: 'available' });
  toast.success('Room added');
} else {
  await api.put(`/rooms/${currentRoom.id}`, form);
  toast.success('Room updated');
}
      setShowRoomModal(false);
      fetchRooms();
    } catch (err) {
      toast.error('Failed to save room');
    }
  };

  

// Separate function for actual deletion
const deleteRoom = async (roomId) => {
  try {
    await api.delete(`/rooms/${roomId}`);
    toast.success('Room deleted successfully');
    fetchRooms();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to delete room');
  }
};

  // Booking functions
  const openBookingModal = async (room) => {
    setSelectedRoom(room);
    setBookingStart(new Date());
    setBookingDuration(60);
    setShowBookingModal(true);

    try {
      const res = await api.get(`/rooms/${room.id}/booked-slots`);

      setRoomBookings(res.data);  // FullCalendar expects array of events { title, start, end }
    } catch (error) {
      toast.error('Failed to load room bookings');
      setRoomBookings([]);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled');

      // Refresh bookings shown in modal if open
      if (selectedRoomForBookings) {
        const res = await api.get('/bookings', { params: { room_id: selectedRoomForBookings.id } });
        setSelectedRoomBookings(res.data);
      }

      fetchRooms(); // optional: refresh rooms if they depend on booking state
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };




  const handleBookRoom = async () => {
    if (!user) {
      toast.error('Please login to book');
      return;
    }

    setBookingLoading(true);
    try {
      const endTime = new Date(bookingStart);
      endTime.setMinutes(endTime.getMinutes() + bookingDuration);

      await api.post('/bookings', {
        room_id: selectedRoom.id,
        user_id: user.id,
        start_time: bookingStart.toISOString(),
        end_time: endTime.toISOString(),
        status: 'booked'
      });

      toast.success(`Room booked until ${endTime.toLocaleString()}`);
      fetchRooms();
      setShowBookingModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBookingLoading(false);
  };

  // Helper to format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (

    
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Meeting Rooms</h2>
        {user?.role === 'admin' && (
          <button className="btn btn-success" onClick={openAddModal}>
            + Add Room
          </button>
        )}
      </div>

      {/* Room List */}
      {loading ? (
        
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : rooms.length === 0 ? (
        <p className="text-muted">No rooms available</p>
      ) : (
        <div className="row g-4" >
          {rooms.map(room => (
            <div key={room.id} className="col-md-6" >
              <div className="card h-100 shadow-sm">
                <div className="card-body"  style={{ cursor: 'pointer' }}
    onClick={() => navigate(`/meetings/${room.id}`)} >
                  <h5 className="card-title">{room.name}</h5>
                  <p className="card-text">
                    <strong>Location:</strong> {room.location}<br />
                    <strong>Capacity:</strong> {room.capacity}<br />
                    <strong>Features:</strong> {room.features || 'None'}
                  </p>


                </div>


                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    disabled={!!room.booking_id}
                    onClick={() => openBookingModal(room)}
                  >
                    Book Room
                  </button>
                  <button
                    className="btn btn-info ms-2 me-0"
                    onClick={() => showBookings(room)}
                  >
                    Show Bookings
                  </button>


                  {user?.role === 'admin' && (
                    <div>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => openEditModal(room)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteClick(room.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {showBookingListModal && (
            <div
              className="modal show d-block booking-list-modal"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setShowBookingListModal(false)}
            >
              <div
                className="modal-dialog modal-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Bookings for {selectedRoomForBookings?.name}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowBookingListModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
  {selectedRoomBookings.length === 0 ? (
    <p className="text-muted">No bookings found for this room.</p>
  ) : (
    selectedRoomBookings.map(booking => (
      <div
        key={booking.id}
        className="booking-item"
      >
        <div className="booking-info">
          <strong>
            {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
          </strong>
          <br />
          By: {booking.user?.name || 'Unknown'}
        </div>

        {(user.role === 'admin' || user.id === booking.user_id) && (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              setBookingToCancel(booking);
              setShowBookingDeleteModal(true);
            }}
          >
            Cancel
          </button>

                          )}

                          
                          {showBookingDeleteModal && (
                            <div
                              className="modal show d-block  delete-booking-modal"
                              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                              onClick={() => setShowBookingDeleteModal(false)}
                            >
                              <div
                                className="modal-dialog"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">Confirm Booking Cancellation</h5>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      onClick={() => setShowBookingDeleteModal(false)}
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    Are you sure you want to cancel the booking from <strong>{new Date(bookingToCancel?.start_time).toLocaleString()}</strong> to <strong>{new Date(bookingToCancel?.end_time).toLocaleString()}</strong>?
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() => setShowBookingDeleteModal(false)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={confirmCancelBooking}
                                    >
                                      Confirm Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      ))
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowBookingListModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Room Delete Confirmation Modal */}
    {showDeleteModal && (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              />
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this room?</p>
              {rooms.find(r => r.id === roomToDelete) && (
                <div className="alert alert-warning">
                  <strong>{rooms.find(r => r.id === roomToDelete).name}</strong> will be permanently removed.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Deleting...
                  </>
                ) : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  

      {/* Room Management Modal */}
      {showRoomModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalMode === 'add' ? 'Add Room' : 'Edit Room'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowRoomModal(false)}></button>
              </div>
              <form onSubmit={handleRoomSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location *</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      className="form-control"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Features</label>
                    <input
                      type="text"
                      name="features"
                      className="form-control"
                      value={form.features}
                      onChange={(e) => setForm({ ...form, features: e.target.value })}
                      placeholder="Projector, Whiteboard, AC"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRoomModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === 'add' ? 'Add Room' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div
            className="modal-dialog modal-xl"
            style={{ maxWidth: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Book {selectedRoom?.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBookingModal(false)}
                ></button>
              </div>




              <div className="modal-body">
                {/* Calendar */}
                <div style={{ height: '500px' }}>
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin, momentPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'timeGridDay,timeGridWeek',
                    }}
                    allDaySlot={false}
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    events={roomBookings.map(event => ({
                      ...event,
                      className: 'booked-slot'
                    }))}
                    selectable={false}
                    nowIndicator={true}
                    height="100%"
                  />
                </div>

                {/* Start Time Picker */}
                <div className="mt-3">
                  <label className="form-label">Start Time</label>
                  <DatePicker
                    selected={bookingStart}
                    onChange={(date) => setBookingStart(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="form-control"
                  />

                </div>

                {/* Duration Input */}
                <div className="mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    className="form-control"
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBookRoom}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    
  );

  
};