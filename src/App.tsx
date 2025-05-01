import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GuestPage from "./pages/GuestPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RegisterPage from "./pages/RegisterPage"; // <-- Import RegisterPage
import RequireAuth from "./components/Layout/RequireAuth";
import { useAuth } from "./hooks/useAuth";

// Layout component remains the same...
function Layout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          borderBottom: "1px solid #444",
          marginBottom: "1rem",
        }}
      >
        <h1>Digital Guestbook</h1>
        <nav>
          <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
            <li>
              <Link to="/guest-form">Guest Form</Link>
            </li>
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
                {" "}
                {/* Use Fragment */}
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>{" "}
                {/* <-- Add Register Link */}
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer
        style={{
          textAlign: "center",
          marginTop: "2rem",
          padding: "1rem",
          borderTop: "1px solid #444",
          fontSize: "0.8em",
        }}
      >
        <p>© {new Date().getFullYear()} Digital Guestbook</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />{" "}
        {/* <-- Add Register Route */}
        <Route path="guest-form" element={<GuestPage />} />
        <Route index element={<GuestPage />} />
        {/* Protected Admin Route */}
        <Route
          path="admin-dashboard"
          element={
            <RequireAuth requireAdmin={true}>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}

export default App;
