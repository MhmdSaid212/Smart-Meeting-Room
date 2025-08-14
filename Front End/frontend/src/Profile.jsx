// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import api from "./axios";
import axios from "axios"; // for CSRF call
import { useNavigate } from "react-router-dom";

export default function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.profile_picture || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setPreview(user?.profile_picture || "");
  }, [user]);

  const handleImageChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("profile_picture", file);
    if (password) {
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword); // ✅ Important for Laravel
    }

    try {
      setLoading(true);

      // Step 1: Get CSRF cookie for Sanctum
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Step 2: Submit profile update
      const { data } = await api.post("/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setUser(data.user);
      alert("✅ Profile updated successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h3 className="mb-4 text-center">Edit Profile</h3>

            {/* Profile Picture Preview */}
            <div className="text-center mb-3">
              <img
                src={preview || "https://via.placeholder.com/120"}
                alt="avatar preview"
                className="rounded-circle border"
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Upload Picture */}
              <div className="mb-3">
                <label className="form-label">Profile Picture</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">New Password (optional)</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
