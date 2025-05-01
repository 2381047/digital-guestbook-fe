// src/components/Admin/CreateEventModal.tsx
import React, { useState } from "react";
import "../../styles/form.css"; // Gunakan styling yang sama

interface CreateEventData {
  title: string;
  date: string; // YYYY-MM-DD
}

interface CreateEventModalProps {
  onSave: (newEventData: CreateEventData) => void;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !date) {
      alert("Please fill in all fields."); // Validasi sederhana
      return;
    }
    onSave({ title, date });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-event-title">Title:</label>
            <input
              id="new-event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-event-date">Date:</label>
            <input
              id="new-event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="button-primary">
              Create Event
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

export default CreateEventModal;
