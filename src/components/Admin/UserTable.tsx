// src/components/Admin/UserTable.tsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "./DataTable";
// Sesuaikan path DTO jika perlu. Asumsi ProfileDTO berisi id, name, email, role.
// Anda mungkin perlu membuat atau mengimpor tipe UpdateUserDto jika fieldnya berbeda
import { UserData } from "../../types/dto"; // Contoh path ke DTO Anda

// Import komponen Modal yang akan kita buat
import EditUserModal from "./EditUserModal";
import "../../styles/table.css"; // Pastikan path style benar

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE BARU UNTUK EDIT ---
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  // --- AKHIR STATE BARU ---

  const fetchUsers = async () => {
    // ... (fetchUsers tetap sama) ...
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(typeof err === "string" ? err : "Could not load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- MODIFIKASI handleEdit ---
  const handleEdit = (user: UserData) => {
    console.log("Opening edit modal for user:", user);
    setEditingUser(user); // Simpan user yang akan diedit
    setIsEditing(true); // Buka modal
  };
  // --- AKHIR MODIFIKASI handleEdit ---

  // --- FUNGSI BARU UNTUK MENUTUP MODAL ---
  const handleCloseEditModal = () => {
    setIsEditing(false);
    setEditingUser(null);
  };
  // --- AKHIR FUNGSI BARU ---

  // --- FUNGSI BARU UNTUK MENYIMPAN PERUBAHAN ---
  const handleSaveUser = async (updatedUserData: Partial<UserData>) => {
    if (!editingUser) return; // Safety check

    setError(null);
    // Tambahkan state loading spesifik untuk save jika diinginkan
    console.log("Saving user:", editingUser.id, updatedUserData);
    try {
      // Kirim request PUT ke backend
      // Ganti '/users/' dengan endpoint update user Anda jika berbeda
      await api.put(`/users/${editingUser.id}`, updatedUserData);

      handleCloseEditModal(); // Tutup modal setelah sukses
      fetchUsers(); // Ambil ulang data untuk menampilkan perubahan
      // Anda bisa juga update state 'users' secara manual untuk performa lebih baik
    } catch (err: any) {
      console.error("Failed to update user:", err);
      // Tampilkan error spesifik dari API jika ada
      setError(typeof err === "string" ? err : "Could not update user.");
      // Mungkin jangan tutup modal jika error agar user bisa coba lagi
    }
  };
  // --- AKHIR FUNGSI BARU ---

  const handleDelete = async (userId: number | string) => {
    // ... (handleDelete tetap sama, tapi pastikan 'setError' di try/catch menampilkan pesan) ...
    if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
      setError(null);
      // Tambahkan state loading spesifik untuk delete jika diinginkan
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
        // Mungkin tambahkan pesan sukses di sini (e.g., menggunakan library toast)
      } catch (err: any) {
        console.error("Failed to delete user:", err);
        setError(typeof err === "string" ? err : "Could not delete user.");
      }
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "created_at", header: "Created At" },
    { key: "actions", header: "Actions" },
  ];

  return (
    <>
      {/* Render DataTable seperti sebelumnya */}
      <DataTable<UserData>
        columns={columns}
        data={users}
        onEdit={handleEdit} // onEdit sekarang memanggil handleEdit yang sudah dimodifikasi
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error} // Pastikan error ditampilkan jika ada
      />

      {/* --- RENDER MODAL SECARA KONDISIONAL --- */}
      {isEditing && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={handleCloseEditModal}
        />
      )}
      {/* --- AKHIR RENDER MODAL --- */}
    </>
  );
};

export default UserTable;
