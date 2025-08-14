import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// ---------------- Create Meeting Form ----------------
function CreateMeetingForm({ onCreated }) {
  const { roomId } = useParams();
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/rooms/${roomId}/meetings`, {
        title,
        agenda
      });
      onCreated(res.data); // pass meeting to parent
    } catch (err) {
      console.error('Failed to create meeting:', err);
    }
  };

    useEffect(() => {
    async function fetchLatestMeeting() {
      try {
        const res = await api.get(`/rooms/${roomId}/latest-meeting`);
        if (res.data) {
          setMeeting(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch latest meeting:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestMeeting();
  }, [roomId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Create Meeting</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Agenda</label>
            <textarea
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>
          <button className="btn btn-success">Create</button>
        </form>
      </div>
    </div>
  );
}

// ---------------- Attachment Modal ----------------
function AttachmentModal({ meetingId, onClose, onAdded }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleAttach = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);


    try {
      const res = await api.post(`/meetings/${meetingId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onAdded(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to attach file:', err);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleAttach}>
            <div className="modal-header">
              <h5 className="modal-title">Attach File</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">File</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} className="form-control" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success">Attach</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------- Attachments & Invites ----------------
function AttachmentsAndInvites({ meeting, setMeeting, currentUser }) {
  const [attachments, setAttachments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(meeting.title);
  const [agenda, setAgenda] = useState(meeting.agenda);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);


const handleClearAll = async () => {
  if (!meeting?.id) {
    toast.error('No meeting selected');
    return;
  }

  try {
    // 1. Clear all attachments first
    await Promise.all(
      attachments.map(att => 
        api.delete(`/attachments/${att.id}`)
          .catch(e => console.error('Failed to delete attachment:', e))
      )
    );

    // 2. Prepare validated clear data
    const clearData = {
      title: '(Cleared Meeting)', // Explicit string value
      agenda: '(No agenda)',      // Explicit string value
      room_id: meeting.room_id,   // Required field
      // Include any other required fields from your Meeting model
      status: 'cleared'           // Optional status field
    };

    // 3. Update meeting with cleared values
    const response = await api.put(`/meetings/${meeting.id}`, clearData);

    // 4. Update local state
    setAttachments([]);
    setTitle(clearData.title);
    setAgenda(clearData.agenda);
    setEditMode(false);
    setMeeting(response.data);

    toast.success('Meeting cleared successfully!');
  } catch (err) {
    console.error('Clear All Error:', {
      error: err,
      response: err.response?.data
    });

    if (err.response?.status === 422) {
      // Display all validation errors
      const errorMessages = Object.values(err.response.data.errors)
        .flat()
        .join(', ');
      toast.error(`Validation error: ${errorMessages}`);
    } else {
      toast.error(err.response?.data?.message || 'Failed to clear meeting');
    }
  }
};



  // Update title and agenda states if meeting changes
  useEffect(() => {
    setTitle(meeting.title);
    setAgenda(meeting.agenda);
  }, [meeting]);

  useEffect(() => {
  if (!meeting.id) return;
  api.get(`/meetings/${meeting.id}/attachments`).then(res => setAttachments(res.data));
  api.get('/users').then(res => setUsers(res.data));
}, [meeting.id]);

  const handleDeleteAttachment = async (id) => {
    try {
      await api.delete(`/attachments/${id}`);
      setAttachments(attachments.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete attachment:', err);
    }
  };

const handleInvite = async (userId) => {
  if (!meeting?.id) {
    console.error("Meeting ID is missing");
    toast.error("Meeting not found");
    return;
  }
  
  try {
    await api.post(`/meetings/${meeting.id}/invite`, { user_ids: [userId] });
    toast.success('User invited!');
  } catch (err) {
    console.error('Failed to invite user:', err);
    toast.error('Failed to invite user');
  }
};


const handleSaveEdits = async () => {
  try {
    const res = await api.put(`/meetings/${meeting.id}`, {
      room_id: meeting.room_id,  // add this
      title,
      agenda
    });
    setEditMode(false);
    setMeeting(prev => ({ ...prev, ...res.data }));
  } catch (err) {
    console.error('Failed to update meeting:', err);
    if (err.response?.data) console.error('Validation errors:', err.response.data);
  }
};

 useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        
        // Filter out the current user
        const otherUsers = response.data.filter(user => 
          user.id !== currentUser?.id
        );
        
        setUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);
  return (

    
    <div className="mt-4">
        {showClearModal && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Clear All</h5>
          <button type="button" className="btn-close" onClick={() => setShowClearModal(false)}></button>
        </div>
        <div className="modal-body">
          Are you sure you want to clear the title, agenda, and all attachments? This action cannot be undone.
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-danger"
            onClick={async () => {
              setShowClearModal(false);
              await handleClearAll();
            }}
          >
            Yes, Clear All
          </button>
          <button className="btn btn-secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
)}


      {/* Title & Agenda */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          {editMode ? (
            <>
              <input className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="form-control mb-2" value={agenda} onChange={e => setAgenda(e.target.value)} rows="3" />
              <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdits}>Save</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <h4>{title}</h4>
              <p>{agenda}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </div>
      </div>

      {/* Attachments Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-header d-flex justify-content-between">
          <h5 className="mb-0">Attachments</h5>
          <button className="btn btn-sm btn-primary" onClick={() => setShowAttachModal(true)}>+ Add</button>
        </div>
        <ul className="list-group list-group-flush">
          {attachments.map(att => (
  <li key={att.id} className="list-group-item d-flex justify-content-between align-items-center">
    <a
      href={att.url}
      download={att.name}           // suggests filename for download
      target="_blank"
      rel="noopener noreferrer"
    >
      {att.name}
    </a>
    <div>
        
      <a
  href={`http://localhost:8000/api/attachments/${att.id}/download`}
  className="btn btn-sm btn-outline-secondary me-2"
  target="_blank"
  rel="noopener noreferrer"
>
  Download
</a>


      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleDeleteAttachment(att.id)}
      >
        Delete
      </button>
    </div>
  </li>
))}

        </ul>
      </div>

      {/* Invite Users Dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-3">
  <button className="btn btn-danger btn-sm" onClick={() => setShowClearModal(true)}>
    Clear All
  </button>

  <div className="dropdown">
  <button
    className="btn btn-outline-secondary dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
  >
    Invite Users
  </button>
  <ul className="dropdown-menu">
    {users.length > 0 ? (
      users.map(user => (
        <li key={user.id} className="dropdown-item d-flex justify-content-between">
          {user.name}
          <span 
            className="text-primary" 
            style={{ cursor: 'pointer' }} 
            onClick={() => handleInvite(user.id)}
          >
            ➕
          </span>
        </li>
      ))
    ) : (
      <li className="dropdown-item text-muted">
        No other users available
      </li>
    )}
  </ul>

</div>
</div>

      {showAttachModal && (
        <AttachmentModal
          meetingId={meeting.id}
          onClose={() => setShowAttachModal(false)}
          onAdded={att => setAttachments([...attachments, att])}
        />
      )}
    </div>
  );
}






// ---------------- Page ----------------
const STORAGE_KEY = (roomId) => `currentMeeting_${roomId}`;


export default function CreateMeetingPage() {
  const { roomId } = useParams();
const [meeting, setMeeting] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY(roomId));
  return saved ? JSON.parse(saved) : null;
});
  const [loading, setLoading] = useState(!meeting);

  useEffect(() => {
    async function fetchLatestMeeting() {
      if (meeting) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/rooms/${roomId}/latest-meeting`);
        if (res.data) {
          setMeeting(res.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        }
        if (!res.data) {
  setMeeting(null);
  localStorage.removeItem(STORAGE_KEY);
}

      } catch (error) {
        console.error('Failed to fetch latest meeting:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestMeeting();
  }, [roomId, meeting]);

   const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage (where you stored it after login)
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  
useEffect(() => {
  if (meeting) {
    localStorage.setItem(STORAGE_KEY(roomId), JSON.stringify(meeting));
  } else {
    localStorage.removeItem(STORAGE_KEY(roomId));
  }
}, [meeting, roomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {!meeting || !meeting.id ? (
        <CreateMeetingForm onCreated={setMeeting} />
      ) : (
        <AttachmentsAndInvites meeting={meeting} setMeeting={setMeeting} currentUser={currentUser}/>
      )}
    </div>
  );
}
