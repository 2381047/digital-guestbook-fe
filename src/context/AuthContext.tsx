import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

// --- TAMBAHKAN 'export' DI SINI ---
// Hook useAuth perlu mengimpor Context object ini
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
// --- SELESAI MENAMBAHKAN ---

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Export tipe agar bisa digunakan oleh hook dan komponen lain
export interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Export AuthProvider seperti sebelumnya
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    console.log("AuthProvider: logout called");
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  useEffect(() => {
    console.log("AuthProvider: Initial check for token in localStorage");
    const initialToken = localStorage.getItem("authToken");
    if (initialToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(initialToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          console.log("AuthProvider: Initial token valid. Setting state.");
          setToken(initialToken);
          setUser(decoded);
          setIsAuthenticated(true);
          setIsAdmin(decoded.role === "admin");
        } else {
          console.warn("AuthProvider: Initial token expired.");
          logout();
        }
      } catch (error) {
        console.error("AuthProvider: Initial token invalid.", error);
        logout();
      }
    } else {
      console.log("AuthProvider: No initial token found.");
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    console.log(
      "AuthProvider: Token state changed:",
      token ? "Exists" : "Null"
    );
    if (!token) {
      if (isAuthenticated || isAdmin || user) {
        console.log("AuthProvider: Token became null, ensuring state reset.");
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    }
  }, [token, isAuthenticated, isAdmin, user]);

  const login = useCallback(
    (newToken: string) => {
      console.log("AuthProvider: login called");
      if (!newToken) {
        console.error("AuthProvider: login called with invalid token!");
        return;
      }
      try {
        const decoded = jwtDecode<DecodedToken>(newToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          console.log(
            "AuthProvider: New token is valid. Setting state & localStorage."
          );
          localStorage.setItem("authToken", newToken);
          setToken(newToken);
          setUser(decoded);
          setIsAuthenticated(true);
          setIsAdmin(decoded.role === "admin");
        } else {
          console.error(
            "AuthProvider: Attempted to login with an expired token."
          );
          logout();
        }
      } catch (error) {
        console.error(
          "AuthProvider: Attempted to login with an invalid token format.",
          error
        );
        logout();
      }
    },
    [logout]
  );

  const value = {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    isLoading,
  };

  console.log("AuthProvider rendering with values:", {
    token: !!token,
    isAuthenticated,
    isAdmin,
    isLoading,
  });

  // Gunakan AuthContext yang sudah didefinisikan (dan sekarang diekspor) di atas
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Tidak perlu export useAuth dari sini, karena sudah ada di file useAuth.ts sendiri
