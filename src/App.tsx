// src/App.tsx
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GuestPage from "./pages/GuestPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RegisterPage from "./pages/RegisterPage";
import RequireAuth from "./components/Layout/RequireAuth";
import { useAuth } from "./hooks/useAuth";
import { UserRole } from "./types/dto";
// Import komponen 404 Anda (jika ada)
// import NotFoundPage from './pages/NotFoundPage';

// Layout component (tidak ada perubahan)
function Layout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header /* ... styling ... */>
        <h1>Digital Guestbook</h1>
        <nav>
          <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
            <li>
              <Link to="/guest-form">Guest Form</Link>
            </li>
            {/* Tampilkan link Admin hanya jika user adalah Admin */}
            {isAdmin && (
              <li>
                <Link to="/admin-dashboard">Admin Dashboard</Link>
              </li>
            )}
            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="container">
        <Outlet /> {/* Konten halaman akan dirender di sini */}
      </main>
      <footer /* ... styling ... */>
        <p>© {new Date().getFullYear()} Digital Guestbook</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Semua rute berada di dalam Layout */}
      <Route path="/" element={<Layout />}>
        {/* Rute Publik */}
        <Route index element={<GuestPage />} /> {/* Halaman utama */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="guest-form" element={<GuestPage />} />
        {/* Halaman lain yang bisa diakses publik */}
        {/* <Route path="about" element={<AboutPage />} /> */}
        {/* --- PERBAIKAN ROUTING ADMIN --- */}
        {/* Bungkus rute admin dengan RequireAuth */}
        <Route
          path="admin-dashboard"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />
        {/* Jika ada rute admin lain, bungkus juga */}
        {/* <Route
          path="admin-settings"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminSettingsPage />
            </RequireAuth>
          }
        /> */}
        {/* --- AKHIR PERBAIKAN ROUTING ADMIN --- */}
        {/* Halaman Not Found (Catch-all Route) */}
        {/* Pastikan ini adalah Route terakhir di dalam <Routes> */}
        <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
        {/* Ganti <div> dengan komponen 404 Anda: */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>{" "}
      {/* Akhir Route Layout */}
    </Routes>
  );
}
export default App;
