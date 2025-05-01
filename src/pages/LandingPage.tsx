// src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css"; // Buat file CSS ini jika perlu styling khusus

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to the Digital Guestbook!</h1>
        <p>Leave your mark and share your thoughts.</p>
      </header>

      <main className="landing-actions">
        <Link to="/guest-form" className="landing-button primary">
          Sign the Guestbook
        </Link>
        <p>or</p>
        <div>
          <Link to="/login" className="landing-button secondary">
            Admin Login
          </Link>
          {/* Jika Anda punya halaman register terpisah untuk admin/user biasa */}
          {/* <Link to="/register" className="landing-button secondary">
            Register
          </Link> */}
        </div>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Digital Guestbook</p>
      </footer>
    </div>
  );
};

export default LandingPage;
