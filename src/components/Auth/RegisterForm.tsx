import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust path if needed

const RegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Optional: Add confirm password for better UX
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Optional: Add client-side check for password confirmation
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }

    try {
      // Call the backend registration endpoint
      await api.post("/auth/register", { name, email, password });
      setSuccess("Registration successful! You can now log in.");
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      // setConfirmPassword('');

      // Optional: Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err: any) {
      console.error("Registration error:", err);
      // Use the error message processed by the Axios interceptor or fallback
      setError(
        typeof err === "string" ? err : "Registration failed. Please try again."
      );
      // setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password (min 6 characters):</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      {/* Optional: Confirm Password Field */}
      {/* <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div> */}

      <div className="form-actions">
        <button type="submit">Register</button>
      </div>
    </form>
  );
};

export default RegisterForm;
