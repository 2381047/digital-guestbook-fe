// src/components/Admin/EditUserModal.tsx
import React, { useState, useEffect } from "react";
import { ProfileDTO } from "../../types/dto"; // Sesuaikan path DTO
import "../../styles/form.css"; // Buat atau gunakan file CSS untuk styling form/modal

interface EditUserModalProps {
  user: ProfileDTO; // Data user awal
  onSave: (updatedUserData: Partial<ProfileDTO>) => void; // Fungsi saat save
  onClose: () => void; // Fungsi saat close
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onSave,
  onClose,
}) => {
  // State untuk menyimpan data form
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  // Anda bisa menambahkan state untuk password jika diizinkan untuk diubah di sini
  // const [password, setPassword] = useState('');

  useEffect(() => {
    // Update state jika prop 'user' berubah (meskipun jarang terjadi untuk modal)
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Kumpulkan data yang diubah saja (atau semua field jika API Anda mengharapkannya)
    const updatedData: Partial<ProfileDTO> = {};
    if (name !== user.name) updatedData.name = name;
    if (email !== user.email) updatedData.email = email;
    if (role !== user.role) updatedData.role = role;
    // Jika ada field password:
    // if (password) updatedData.password = password; // Pastikan DTO/API backend menerima 'password'

    // Panggil fungsi onSave dari parent dengan data yang diubah
    onSave(updatedData);
  };

  // Simple modal using basic HTML/CSS (replace with library component if desired)
  return (
    <div className="modal-backdrop" onClick={onClose}>
      {" "}
      {/* Klik backdrop untuk menutup */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Klik konten tidak menutup */}
        <h2>
          Edit User: {user.name} (ID: {user.id})
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as ProfileDTO["role"])} // Pastikan role sesuai tipe
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
              {/* Tambahkan role lain jika ada */}
            </select>
          </div>
          {/* Tambahkan input password jika diperlukan */}
          {/* <div className="form-group">
            <label htmlFor="password">New Password (optional):</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep unchanged"
            />
          </div> */}
          <div className="form-actions">
            <button type="submit" className="button-primary">
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
