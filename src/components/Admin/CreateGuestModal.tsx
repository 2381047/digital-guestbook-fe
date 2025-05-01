// src/components/Admin/CreateGuestModal.tsx
import React, { useState } from "react";
import { EventDataSimple, CreateGuestData } from "../../types/dto"; // Sesuaikan path
import "../../styles/form.css";

interface CreateGuestModalProps {
  events: EventDataSimple[]; // Daftar event untuk dropdown
  onSave: (newGuestData: CreateGuestData) => void;
  onClose: () => void;
  isLoadingEvents?: boolean; // Opsional: Tampilkan loading jika event belum ada
}

const CreateGuestModal: React.FC<CreateGuestModalProps> = ({
  events,
  onSave,
  onClose,
  isLoadingEvents = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Inisialisasi event_id ke string kosong atau ID event pertama jika ada
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events.length > 0 ? String(events[0].id) : ""
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !selectedEventId) {
      alert("Please fill in all fields and select an event.");
      return;
    }
    onSave({ name, email, event_id: Number(selectedEventId) });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Guest Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-guest-name">Name:</label>
            <input
              id="new-guest-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-guest-email">Email:</label>
            <input
              id="new-guest-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-guest-event">Event:</label>
            <select
              id="new-guest-event"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              required
              disabled={isLoadingEvents || events.length === 0}
            >
              <option value="" disabled>
                {isLoadingEvents ? "Loading events..." : "-- Select Event --"}
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} (ID: {event.id})
                </option>
              ))}
            </select>
            {!isLoadingEvents && events.length === 0 && (
              <p style={{ color: "orange", fontSize: "0.9em" }}>
                No events found. Please create an event first.
              </p>
            )}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="button-primary"
              disabled={isLoadingEvents || events.length === 0}
            >
              Create Guest
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

export default CreateGuestModal;
