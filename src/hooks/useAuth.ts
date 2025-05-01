import { useContext } from "react";
// Impor tipe dan context dari file context yang baru dibuat
import { AuthContextType, AuthContext } from "../context/AuthContext"; // Sesuaikan path jika perlu

// Hook kustom ini sekarang hanya mengembalikan context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Pesan error ini penting jika provider lupa dipasang
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
