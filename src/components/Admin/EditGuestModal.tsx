// src/components/Admin/EditGuestModal.tsx
import React, { useState, useEffect } from "react";
import { GuestData, EventDataSimple, UpdateGuestData } from "../../types/dto"; // Sesuaikan path
import "../../styles/form.css";

interface EditGuestModalProps {
  guest: GuestData;
  events: EventDataSimple[]; // Daftar event untuk dropdown
  onSave: (updatedGuestData: UpdateGuestData) => void;
  onClose: () => void;
  isLoadingEvents?: boolean;
}

const EditGuestModal: React.FC<EditGuestModalProps> = ({
  guest,
  events,
  onSave,
  onClose,
  isLoadingEvents = false,
}) => {
  const [name, setName] = useState(guest.name);
  const [email, setEmail] = useState(guest.email);
  // Inisialisasi event_id ke string
  const [selectedEventId, setSelectedEventId] = useState<string>(
    String(guest.event_id)
  );

  useEffect(() => {
    // Update state jika prop 'guest' berubah
    setName(guest.name);
    setEmail(guest.email);
    setSelectedEventId(String(guest.event_id));
  }, [guest]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const updatedData: UpdateGuestData = {};
    if (name !== guest.name) updatedData.name = name;
    if (email !== guest.email) updatedData.email = email;
    if (Number(selectedEventId) !== guest.event_id)
      updatedData.event_id = Number(selectedEventId);

    if (Object.keys(updatedData).length > 0) {
      onSave(updatedData);
    } else {
      console.log("No changes detected for guest.");
      onClose(); // Tutup jika tidak ada perubahan
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>
          Edit Guest: {guest.name} (ID: {guest.id})
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-guest-name">Name:</label>
            <input
              id="edit-guest-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-guest-email">Email:</label>
            <input
              id="edit-guest-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-guest-event">Event:</label>
            <select
              id="edit-guest-event"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              required
              disabled={isLoadingEvents || events.length === 0}
            >
              <option value="" disabled>
                {isLoadingEvents ? "Loading events..." : "-- Select Event --"}
              </option>
              {/* Pastikan nilai awal (selectedEventId) ada di daftar options */}
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} (ID: {event.id})
                </option>
              ))}
            </select>
            {!isLoadingEvents && events.length === 0 && (
              <p style={{ color: "orange", fontSize: "0.9em" }}>
                Cannot change event, no events found.
              </p>
            )}
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

export default EditGuestModal;
