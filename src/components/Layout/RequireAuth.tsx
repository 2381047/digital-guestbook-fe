// src/components/Layout/RequireAuth.tsx
import { ReactNode } from "react"; // Impor ReactNode untuk children
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/dto"; // <-- Impor UserRole

interface RequireAuthProps {
  children: ReactNode; // <-- Tambahkan children
  allowedRoles: UserRole[]; // <-- Ubah tipe menjadi array UserRole
}

// Tidak perlu React.FC jika menggunakan children secara eksplisit
const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  // Dapatkan isLoading juga dari context
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth(); // Asumsi ada 'user' untuk log role
  const location = useLocation();

  // --- Cek isLoading ---
  if (isLoading) {
    console.log(
      `RequireAuth: Auth state is loading for ${location.pathname}...`
    );
    return <div>Loading authentication...</div>; // Atau komponen skeleton/spinner
  }

  // Hitung apakah peran admin secara spesifik dibutuhkan oleh rute ini
  const requiresAdminRole = allowedRoles.includes(UserRole.ADMIN);

  // Log yang diperbaiki
  console.log(
    `RequireAuth: Checking route ${location.pathname}. State: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, userRole=${user?.role}, requiresAdmin=${requiresAdminRole}, actualIsAdmin=${isAdmin}`
    // Menghapus 'requireAdmin' yang tidak terdefinisi
    // Menambahkan user?.role (jika ada), requiresAdminRole, dan actualIsAdmin untuk kejelasan
  );

  // --- Cek Autentikasi ---
  if (!isAuthenticated) {
    console.log(
      `RequireAuth: Not authenticated. Redirecting to /login from ${location.pathname}`
    );
    // Redirect ke login, simpan lokasi asal agar bisa kembali setelah login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- Cek Autorisasi (Peran) ---
  // Jika rute ini memerlukan peran admin (berdasarkan allowedRoles) TAPI user BUKAN admin
  if (requiresAdminRole && !isAdmin) {
    console.warn(
      `RequireAuth: Admin access required for ${location.pathname}, but user is not admin (User role: ${user?.role}). Redirecting to /unauthorized (atau halaman lain).`
      // Pertimbangkan redirect ke halaman 'Unauthorized' daripada guest-form
    );
    // Redirect ke halaman Unauthorized atau halaman default user yang login
    return <Navigate to="/guest-form" state={{ from: location }} replace />;
    // Atau: return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Jika lolos semua cek (loading, autentikasi, autorisasi)
  console.log(
    `RequireAuth: Access granted for ${location.pathname}. Rendering children.`
  );
  // Render komponen anak yang diproteksi
  return <>{children}</>; // <-- Kembalikan children
};

export default RequireAuth;
