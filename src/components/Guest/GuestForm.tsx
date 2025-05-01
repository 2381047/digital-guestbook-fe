import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Adjust path

interface EventOption {
  id: number;
  title: string;
  date: string;
}

const GuestForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<EventOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch events for the dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const response = await api.get("/events"); // Assuming GET /events is public
        setEvents(response.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Could not load events. Please try again later.");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!eventId) {
      setError("Please select an event.");
      return;
    }

    try {
      // 1. Create Guest
      const guestResponse = await api.post("/guests", {
        name,
        email,
        event_id: eventId,
      });
      const newGuestId = guestResponse.data.id;

      // 2. Create Message using the new guest ID
      await api.post("/messages", {
        content: message,
        guest_id: newGuestId,
        event_id: eventId,
      });

      setSuccess(
        "Your guestbook entry and message have been submitted successfully!"
      );
      // Clear the form
      setName("");
      setEmail("");
      setEventId("");
      setMessage("");
    } catch (err: any) {
      console.error("Guest/Message submission error:", err);
      setError(
        typeof err === "string"
          ? err
          : "Failed to submit entry. Please check your input."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="event">Event:</label>
        <select
          id="event"
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
          required
          disabled={loadingEvents}
        >
          <option value="" disabled>
            {loadingEvents ? "Loading events..." : "-- Select an Event --"}
          </option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} ({new Date(event.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={1000}
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loadingEvents}>
          Submit Entry
        </button>
      </div>
      <p
        style={{
          fontSize: "0.8em",
          textAlign: "center",
          marginTop: "1rem",
          opacity: 0.7,
        }}
      >
        Your data is used only for the purpose of this guestbook and the
        selected event.
      </p>
    </form>
  );
};

export default GuestForm;
