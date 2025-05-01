// src/components/Admin/GuestTable.tsx
import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import api from "../../services/api";
import CreateGuestModal from "./CreateGuestModal"; // Import modal create
import EditGuestModal from "./EditGuestModal"; // Import modal edit
import {
  GuestData,
  EventDataSimple,
  CreateGuestData,
  UpdateGuestData,
} from "../../types/dto"; // Sesuaikan path
import "../../styles/table.css";
import "../../styles/form.css";

const GuestTable: React.FC = () => {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [events, setEvents] = useState<EventDataSimple[]>([]); // State untuk daftar event
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Loading state untuk events
  const [error, setError] = useState<string | null>(null);
  const [isCreatingGuest, setIsCreatingGuest] = useState<boolean>(false);
  const [isEditingGuest, setIsEditingGuest] = useState<boolean>(false);
  const [editingGuest, setEditingGuest] = useState<GuestData | null>(null);

  // Fetch Guests
  const fetchGuests = async () => {
    setIsLoadingGuests(true);
    // Jangan reset error di sini agar error fetch event tetap terlihat jika ada
    try {
      const response = await api.get("/guests"); // Backend sudah menyertakan relasi event
      setGuests(response.data);
    } catch (err: any) {
      console.error("Failed to fetch guests:", err);
      setError(typeof err === "string" ? err : "Could not load guests.");
    } finally {
      setIsLoadingGuests(false);
    }
  };

  // Fetch Events (untuk dropdown)
  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    // Jangan reset error di sini
    try {
      const response = await api.get("/events"); // Ambil semua event
      setEvents(response.data);
    } catch (err: any) {
      console.error("Failed to fetch events for dropdown:", err);
      setError(
        typeof err === "string" ? err : "Could not load events for selection."
      );
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchGuests();
    fetchEvents(); // Panggil fetchEvents juga
  }, []);

  // Handlers untuk Create Modal
  const handleOpenCreateGuestModal = () => setIsCreatingGuest(true);
  const handleCloseCreateGuestModal = () => setIsCreatingGuest(false);
  const handleCreateGuestSave = async (newGuestData: CreateGuestData) => {
    setError(null);
    try {
      await api.post("/guests", newGuestData);
      handleCloseCreateGuestModal();
      fetchGuests(); // Refresh tabel guest
    } catch (err: any) {
      console.error("Failed to create guest:", err);
      setError(typeof err === "string" ? err : "Could not create guest.");
    }
  };

  // Handlers untuk Edit Modal
  const handleEditGuest = (guest: GuestData) => {
    setEditingGuest(guest);
    setIsEditingGuest(true);
  };
  const handleCloseEditGuestModal = () => {
    setIsEditingGuest(false);
    setEditingGuest(null);
  };
  const handleSaveGuest = async (updatedGuestData: UpdateGuestData) => {
    if (!editingGuest) return;
    setError(null);
    try {
      await api.put(`/guests/${editingGuest.id}`, updatedGuestData);
      handleCloseEditGuestModal();
      fetchGuests();
    } catch (err: any) {
      console.error("Failed to update guest:", err);
      setError(typeof err === "string" ? err : "Could not update guest.");
    }
  };

  // Handler untuk Delete
  const handleDeleteGuest = async (guestId: number | string) => {
    if (window.confirm(`Are you sure you want to delete guest ${guestId}?`)) {
      setError(null);
      try {
        await api.delete(`/guests/${guestId}`);
        fetchGuests();
      } catch (err: any) {
        console.error("Failed to delete guest:", err);
        setError(typeof err === "string" ? err : "Could not delete guest.");
      }
    }
  };

  // Definisi kolom, termasuk render kustom untuk nama event
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    // Render kustom untuk menampilkan nama event, bukan hanya ID
    {
      key: "eventInfo", // Kunci kustom
      header: "Event",
      render: (item: GuestData) => item.event?.title ?? `ID: ${item.event_id}`, // Tampilkan title jika ada, fallback ke ID
    },
    { key: "created_at", header: "Submitted At" }, // Ubah header jika perlu
    { key: "actions", header: "Actions" },
  ];

  // Helper format date (jika diperlukan, bisa ditaruh di utils)
  const formatDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return "";
    try {
      const date = new Date(dateInput);
      return date.toLocaleString(); // Atau format lain yang Anda inginkan
    } catch (e) {
      return String(dateInput);
    }
  };

  return (
    <>
      <div className="table-header-actions">
        <h2>Guest Entries</h2>
        <button onClick={handleOpenCreateGuestModal} className="button-primary">
          Create New Guest Entry
        </button>
      </div>

      <DataTable<GuestData>
        columns={columns}
        // Format tanggal sebelum dikirim ke DataTable
        data={guests.map((guest) => ({
          ...guest,
          created_at: formatDate(guest.created_at),
        }))}
        onEdit={handleEditGuest} // <-- Teruskan handler yang benar
        onDelete={handleDeleteGuest} // <-- Teruskan handler yang benar
        isLoading={isLoadingGuests} // Gunakan loading state spesifik
        error={error}
      />

      {/* Render Create Modal */}
      {isCreatingGuest && (
        <CreateGuestModal
          events={events} // Teruskan daftar event
          onSave={handleCreateGuestSave}
          onClose={handleCloseCreateGuestModal}
          isLoadingEvents={isLoadingEvents} // Beri tahu modal jika event sedang loading
        />
      )}

      {/* Render Edit Modal */}
      {isEditingGuest && editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          events={events} // Teruskan daftar event
          onSave={handleSaveGuest}
          onClose={handleCloseEditGuestModal}
          isLoadingEvents={isLoadingEvents}
        />
      )}
    </>
  );
};

export default GuestTable;
