// src/components/Admin/MessageTable.tsx
import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import api from "../../services/api";
import EditMessageModal from "./EditMessageModal"; // Import modal edit
import { MessageData, UpdateMessageData } from "../../types/dto"; // Sesuaikan path
import "../../styles/table.css";
import "../../styles/form.css";

const MessageTable: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<MessageData | null>(
    null
  );

  // Fetch Messages
  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Asumsi endpoint GET /messages mengembalikan data termasuk relasi guest dan event
      const response = await api.get("/messages");
      setMessages(response.data);
    } catch (err: any) {
      console.error("Failed to fetch messages:", err);
      setError(typeof err === "string" ? err : "Could not load messages.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Handlers untuk Edit Modal
  const handleEditMessage = (message: MessageData) => {
    setEditingMessage(message);
    setIsEditingMessage(true);
  };
  const handleCloseEditMessageModal = () => {
    setIsEditingMessage(false);
    setEditingMessage(null);
  };
  const handleSaveMessage = async (updatedMessageData: UpdateMessageData) => {
    if (!editingMessage) return;
    setError(null);
    try {
      await api.put(`/messages/${editingMessage.id}`, updatedMessageData);
      handleCloseEditMessageModal();
      fetchMessages();
    } catch (err: any) {
      console.error("Failed to update message:", err);
      setError(typeof err === "string" ? err : "Could not update message.");
    }
  };

  // Handler untuk Delete
  const handleDeleteMessage = async (messageId: number | string) => {
    if (
      window.confirm(`Are you sure you want to delete message ${messageId}?`)
    ) {
      setError(null);
      try {
        await api.delete(`/messages/${messageId}`);
        fetchMessages();
      } catch (err: any) {
        console.error("Failed to delete message:", err);
        setError(typeof err === "string" ? err : "Could not delete message.");
      }
    }
  };

  // Definisi kolom, termasuk render kustom untuk guest/event
  const columns = [
    { key: "id", header: "ID" },
    { key: "content", header: "Message Content" },
    {
      key: "guestInfo", // Kunci kustom
      header: "Guest",
      render: (item: MessageData) => item.guest?.name ?? `ID: ${item.guest_id}`,
    },
    {
      key: "eventInfo", // Kunci kustom
      header: "Event",
      render: (item: MessageData) =>
        item.event?.title ?? `ID: ${item.event_id}`,
    },
    { key: "created_at", header: "Submitted At" },
    { key: "actions", header: "Actions" },
  ];

  // Helper format date (jika diperlukan)
  const formatDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return "";
    try {
      const date = new Date(dateInput);
      return date.toLocaleString(); // Atau format lain
    } catch (e) {
      return String(dateInput);
    }
  };

  return (
    <>
      {/* Tidak perlu tombol Create untuk Messages di Admin Dashboard */}
      <h2>Messages</h2>

      <DataTable<MessageData>
        columns={columns}
        // Format data sebelum dikirim ke DataTable
        data={messages.map((msg) => ({
          ...msg,
          created_at: formatDate(msg.created_at),
        }))}
        onEdit={handleEditMessage} // <-- Teruskan handler yang benar
        onDelete={handleDeleteMessage} // <-- Teruskan handler yang benar
        isLoading={isLoading}
        error={error}
      />

      {/* Render Edit Modal */}
      {isEditingMessage && editingMessage && (
        <EditMessageModal
          message={editingMessage}
          onSave={handleSaveMessage}
          onClose={handleCloseEditMessageModal}
        />
      )}
    </>
  );
};

export default MessageTable;
