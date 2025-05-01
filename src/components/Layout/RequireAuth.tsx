import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface RequireAuthProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  requireAdmin = false,
}) => {
  // Dapatkan isLoading juga dari context
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // --- Tambahkan Cek isLoading ---
  if (isLoading) {
    // Jika state auth masih loading dari localStorage, jangan lakukan apa-apa dulu
    // Tampilkan loading indicator atau null
    console.log(
      `RequireAuth: Auth state is loading for ${location.pathname}...`
    );
    return <div>Loading authentication...</div>; // Atau return null;
  }
  // --- Akhir Cek isLoading ---

  console.log(
    `RequireAuth: Checking route ${location.pathname}. State: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, isAdmin=${isAdmin}, requireAdmin=${requireAdmin}`
  );

  if (!isAuthenticated) {
    console.log(
      `RequireAuth: Not authenticated. Redirecting to /login from ${location.pathname}`
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.warn(
      `RequireAuth: Admin access required for ${location.pathname}, but user is not admin. Redirecting to /guest-form.`
    );
    return <Navigate to="/guest-form" replace />;
  }

  console.log(
    `RequireAuth: Access granted for ${location.pathname}. Rendering children.`
  );
  return children;
};

export default RequireAuth;
