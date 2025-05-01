// src/components/Admin/EditEventModal.tsx
import React, { useState, useEffect } from "react";
import "../../styles/form.css"; // Use existing or create new form styles

// Interface for the event data passed to the modal
interface EventData {
  id: number;
  title: string;
  date: string | Date; // Can be string or Date initially
  // Include other fields if they are needed for display or context
}

// Interface for the data sent back on save
interface UpdateEventData {
  title?: string;
  date?: string; // Expecting 'YYYY-MM-DD' format string
}

interface EditEventModalProps {
  event: EventData; // Data event awal
  onSave: (updatedEventData: UpdateEventData) => void; // Fungsi saat save
  onClose: () => void; // Fungsi saat close
}

// Helper to format date to YYYY-MM-DD for input field
const formatDateForInput = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "";
  try {
    // Handles both Date objects and various date string formats
    const date = new Date(dateInput);
    // Ensure month and day are two digits
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date for input:", e);
    // Fallback or handle invalid initial date string
    return "";
  }
};

const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  onSave,
  onClose,
}) => {
  // State untuk menyimpan data form
  const [title, setTitle] = useState(event.title);
  // Initialize date state with formatted string for input type="date"
  const [date, setDate] = useState(formatDateForInput(event.date));

  // Update state if the event prop changes (though unlikely for a modal)
  useEffect(() => {
    setTitle(event.title);
    setDate(formatDateForInput(event.date));
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kumpulkan data yang diubah
    const updatedData: UpdateEventData = {};
    // Hanya sertakan field jika nilainya berubah dari nilai asli
    // Atau sertakan semua field jika API Anda memerlukannya
    if (title !== event.title) {
      updatedData.title = title;
    }
    // Bandingkan tanggal yang diformat
    if (date !== formatDateForInput(event.date)) {
      updatedData.date = date; // Kirim string YYYY-MM-DD
    }

    // Panggil fungsi onSave hanya jika ada data yang berubah
    // atau selalu panggil jika API Anda menerima update kosong
    if (Object.keys(updatedData).length > 0) {
      onSave(updatedData);
    } else {
      console.log("No changes detected.");
      onClose(); // Tutup modal jika tidak ada perubahan
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>
          Edit Event: {event.title} (ID: {event.id})
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event-title">Title:</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-date">Date:</label>
            <input
              id="event-date"
              type="date" // Input type for date selection
              value={date} // Value should be in 'YYYY-MM-DD' format
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
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

export default EditEventModal;
