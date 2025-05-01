import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import "../styles/form.css";

const LoginPage: React.FC = () => {
  // Dapatkan isLoading juga
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // --- Hanya jalankan redirect jika TIDAK sedang loading DAN sudah terautentikasi ---
    if (!isLoading && isAuthenticated) {
      console.log(
        "LoginPage: User is authenticated (and not loading). Redirecting..."
      );
      if (isAdmin) {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/guest-form", { replace: true });
      }
    }
    // Dependensi termasuk isLoading sekarang
  }, [isAuthenticated, isAdmin, navigate, isLoading]);

  // Jangan tampilkan apa pun atau tampilkan loading jika masih loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Jika tidak loading dan sudah login, effect di atas akan redirect,
  // tapi kita bisa juga return null di sini untuk mencegah flicker form login.
  if (isAuthenticated) {
    return null; // Atau bisa juga loading indicator
  }

  // Jika tidak loading DAN tidak terautentikasi, tampilkan form login
  return (
    <div className="form-container">
      <h1>Login</h1>
      <LoginForm />
      <p className="form-link">
        Need an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
