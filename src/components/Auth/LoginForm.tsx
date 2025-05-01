import React, { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  // const navigate = useNavigate(); // Tidak perlu navigate di sini lagi
  // const location = useLocation();
  // const from = location.state?.from?.pathname || '/admin-dashboard'; // Tidak perlu 'from' di sini lagi

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    console.log(
      `LoginForm: handleSubmit initiated. Attempting login for ${email}`
    );

    try {
      console.log(`LoginForm: Calling api.post('/auth/login')...`);
      const response = await api.post("/auth/login", { email, password });
      console.log("LoginForm: API response received:", response.data);

      if (response.data && response.data.access_token) {
        const receivedToken = response.data.access_token;
        console.log(
          `LoginForm: Token received. Calling login function from useAuth...`
        );
        login(receivedToken); // Panggil fungsi login dari useAuth -> ini akan memicu update state

        // --- Tambahkan pembersihan form di sini ---
        console.log(`LoginForm: Login successful. Clearing form fields.`);
        setEmail("");
        setPassword("");
        // --- Selesai membersihkan form ---

        // Navigasi sekarang ditangani oleh useEffect di LoginPage
      } else {
        console.error(
          "LoginForm: Login successful but no access_token found in response."
        );
        setError("Login failed: Unexpected response from server.");
      }
    } catch (err: any) {
      console.error("LoginForm: catch block triggered.", err);
      setError(typeof err === "string" ? err : "Invalid email or password.");
    }
  };

  // ... (return statement JSX tetap sama) ...
  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="form-actions">
        <button type="submit">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
