// src/components/Admin/EventTable.tsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "./DataTable";
import EditEventModal from "./EditEventModal";
import CreateEventModal from "./CreateEventModal"; // <-- 1. Import Modal Create
import "../../styles/table.css";
import "../../styles/form.css"; // <-- Pastikan styling untuk button ada di sini atau di table.css

// Tipe data event dari API
interface EventData {
  id: number;
  title: string;
  date: string;
  created_at: string | Date;
  updated_at: string | Date;
}

// Tipe data untuk update event (API PUT)
interface UpdateEventData {
  title?: string;
  date?: string; // YYYY-MM-DD
}

// Tipe data untuk membuat event baru (API POST)
interface CreateEventData {
  title: string;
  date: string; // YYYY-MM-DD
}

const EventTable: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  // --- 2. STATE BARU UNTUK CREATE EVENT ---
  const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);
  // --- AKHIR STATE BARU ---

  const fetchEvents = async () => {
    /* ... fetchEvents function ... */
    console.log("EventTable: Fetching events...");
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/events");
      console.log("EventTable: API Response data:", response.data);
      setEvents(response.data);
    } catch (err: any) {
      console.error("EventTable: Failed to fetch events:", err);
      setError(typeof err === "string" ? err : "Could not load events.");
    } finally {
      setIsLoading(false);
      console.log("EventTable: Fetching complete.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditEvent = (event: EventData) => {
    /* ... handleEditEvent function ... */
    console.log("EventTable: handleEditEvent called for:", event);
    setEditingEvent(event);
    setIsEditingEvent(true);
  };
  const handleCloseEditEventModal = () => {
    /* ... handleCloseEditEventModal function ... */
    console.log("EventTable: handleCloseEditEventModal called");
    setIsEditingEvent(false);
    setEditingEvent(null);
  };
  const handleSaveEvent = async (updatedEventData: UpdateEventData) => {
    /* ... handleSaveEvent function ... */
    if (!editingEvent) {
      console.log("EventTable: handleSaveEvent called but no editingEvent.");
      return;
    }
    setError(null);
    console.log(
      "EventTable: handleSaveEvent called for ID",
      editingEvent.id,
      "with data:",
      updatedEventData
    );
    try {
      await api.put(`/events/${editingEvent.id}`, updatedEventData);
      console.log(
        "EventTable: Event update successful for ID",
        editingEvent.id
      );
      handleCloseEditEventModal();
      fetchEvents();
    } catch (err: any) {
      console.error("EventTable: Failed to update event:", err);
      setError(typeof err === "string" ? err : "Could not update event.");
    }
  };
  const handleDeleteEvent = async (eventId: number | string) => {
    /* ... handleDeleteEvent function ... */
    console.log("EventTable: handleDeleteEvent called for ID:", eventId);
    if (window.confirm(`Are you sure you want to delete event ${eventId}?`)) {
      setError(null);
      try {
        await api.delete(`/events/${eventId}`);
        console.log("EventTable: Event delete successful for ID", eventId);
        fetchEvents();
      } catch (err: any) {
        console.error("EventTable: Failed to delete event:", err);
        setError(typeof err === "string" ? err : "Could not delete event.");
      }
    } else {
      console.log("EventTable: Delete cancelled for ID:", eventId);
    }
  };

  // --- 3. FUNGSI BARU UNTUK CREATE ---
  const handleOpenCreateEventModal = () => {
    console.log("EventTable: handleOpenCreateEventModal called");
    setIsCreatingEvent(true);
  };

  const handleCloseCreateEventModal = () => {
    console.log("EventTable: handleCloseCreateEventModal called");
    setIsCreatingEvent(false);
  };

  const handleCreateEventSave = async (newEventData: CreateEventData) => {
    setError(null);
    console.log(
      "EventTable: handleCreateEventSave called with data:",
      newEventData
    );
    try {
      // Panggil API POST untuk membuat event baru
      await api.post("/events", newEventData);
      console.log("EventTable: Event creation successful");
      handleCloseCreateEventModal(); // Tutup modal
      fetchEvents(); // Refresh tabel
    } catch (err: any) {
      console.error("EventTable: Failed to create event:", err);
      setError(typeof err === "string" ? err : "Could not create event.");
      // Opsional: jangan tutup modal jika error, atau tampilkan error di modal
    }
  };
  // --- AKHIR FUNGSI BARU UNTUK CREATE ---

  const columns = [
    { key: "id", header: "ID" },
    { key: "title", header: "Title" },
    { key: "date", header: "Date" },
    { key: "created_at", header: "Created At" },
    { key: "actions", header: "Actions" },
  ];

  const formatDate = (dateInput: string | Date | undefined): string => {
    /* ... formatDate function ... */
    if (!dateInput) return "";
    try {
      const date = new Date(dateInput);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return String(dateInput);
    }
  };

  const mappedData = events.map((event) => ({
    /* ... mapping data ... */ ...event,
    created_at: formatDate(event.created_at),
  }));

  // Log sebelum return (tidak perlu diubah)
  console.log(
    "%cEventTable Rendering:",
    "color: orange; font-weight: bold;"
  ); /* ... console log lainnya ... */
  console.log(
    "  Handler 'onEdit' (handleEditEvent) is function?",
    typeof handleEditEvent === "function"
  );
  console.log(
    "  Handler 'onDelete' (handleDeleteEvent) is function?",
    typeof handleDeleteEvent === "function"
  );

  return (
    // Menggunakan React Fragment agar tidak menambah div ekstra yang tidak perlu
    <>
      <div className="table-header-actions">
        {" "}
        {/* Div untuk judul dan tombol create */}
        <h2>Events</h2>
        {/* --- 4. TOMBOL CREATE BARU --- */}
        <button onClick={handleOpenCreateEventModal} className="button-primary">
          Create New Event
        </button>
        {/* --- AKHIR TOMBOL CREATE BARU --- */}
      </div>

      {/* Render DataTable seperti sebelumnya */}
      <DataTable<EventData>
        columns={columns}
        data={mappedData}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        isLoading={isLoading}
        error={error}
      />

      {/* Render Modal Edit */}
      {isEditingEvent && editingEvent && (
        <EditEventModal
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={handleCloseEditEventModal}
        />
      )}

      {/* --- 5. RENDER MODAL CREATE BARU --- */}
      {isCreatingEvent && (
        <CreateEventModal
          onSave={handleCreateEventSave}
          onClose={handleCloseCreateEventModal}
        />
      )}
      {/* --- AKHIR RENDER MODAL CREATE BARU --- */}
    </>
  );
};

export default EventTable;
