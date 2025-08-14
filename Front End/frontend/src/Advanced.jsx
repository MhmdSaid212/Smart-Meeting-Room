import React, { useEffect, useState } from 'react';
import api from './axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Advanced() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users', newUser);
      fetchUsers();
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      toast.success('User added successfully!');
      confetti({ particleCount: 100, spread: 70 });
    } catch (err) {
      toast.error('Failed to add user');
    }
    setLoading(false);
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Delete failed');
    }
    setUserToDelete(null);
  };

  const filteredUsers = users
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const fieldA = a[sortField].toLowerCase();
      const fieldB = b[sortField].toLowerCase();
      if (sortOrder === 'asc') return fieldA.localeCompare(fieldB);
      else return fieldB.localeCompare(fieldA);
    });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const exportCSV = () => {
    const csv = Papa.unparse(users);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar closeOnClick />
      <h2 className="mb-4">🛠️ Admin Panel</h2>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">➕ Add New User</h5>
        <form onSubmit={handleAddUser} className="row g-3">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Name" value={newUser.name} required onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input type="email" className="form-control" placeholder="Email" value={newUser.email} required onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input type="password" className="form-control" placeholder="Password" value={newUser.password} required onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-success w-100" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>👥 Current Users</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={exportCSV}>Export CSV</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={exportExcel}>Export Excel</button>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th onClick={() => setSortField('name')}>Name</th>
              <th onClick={() => setSortField('email')}>Email</th>
              <th>Role</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select className="form-select form-select-sm" value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => setUserToDelete(user)}>Delete</button>
                </td>
              </tr>
            ))}
            {displayedUsers.length === 0 && (
              <tr><td colSpan="4" className="text-center text-muted">No users found.</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button className="btn-close" onClick={() => setUserToDelete(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{userToDelete.name}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setUserToDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
