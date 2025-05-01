// src/components/Admin/EditMessageModal.tsx
import React, { useState, useEffect } from "react";
import { MessageData, UpdateMessageData } from "../../types/dto"; // Sesuaikan path
import "../../styles/form.css";

interface EditMessageModalProps {
  message: MessageData;
  onSave: (updatedMessageData: UpdateMessageData) => void;
  onClose: () => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({
  message,
  onSave,
  onClose,
}) => {
  const [content, setContent] = useState(message.content);

  useEffect(() => {
    setContent(message.content);
  }, [message]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedData: UpdateMessageData = {};
    if (content !== message.content) {
      updatedData.content = content;
    }

    if (Object.keys(updatedData).length > 0) {
      onSave(updatedData);
    } else {
      console.log("No changes detected for message.");
      onClose(); // Tutup jika tidak ada perubahan
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Message (ID: {message.id})</h2>
        {/* Tampilkan info Guest dan Event (read-only) */}
        <p style={{ fontSize: "0.9em", color: "#aaa" }}>
          From: {message.guest?.name ?? `Guest ID ${message.guest_id}`} <br />
          For Event: {message.event?.title ?? `Event ID ${message.event_id}`}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-message-content">Content:</label>
            <textarea
              id="edit-message-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4} // Atur tinggi textarea
              style={{ width: "100%", boxSizing: "border-box" }} // Pastikan lebar penuh
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

export default EditMessageModal;
