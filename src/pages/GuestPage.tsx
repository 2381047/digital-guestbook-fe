import React from "react";
import GuestForm from "../components/Guest/GuestForm"; // Adjust path
import "../styles/form.css"; // Import form styles

const GuestPage: React.FC = () => {
  return (
    <div className="form-container">
      <h1>Guestbook Entry</h1>
      <GuestForm />
      {/* Optionally display recent messages here later */}
    </div>
  );
};

export default GuestPage;
