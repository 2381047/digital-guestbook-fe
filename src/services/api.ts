import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Fallback if env var is missing
});

// Request Interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (optional: for global error handling like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - redirecting to login");
      localStorage.removeItem("authToken");
      // Check if we are already on the login page to prevent redirect loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"; // Simple redirect
      }
    }
    // You might want to extract the actual error message from the response
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    // Instead of rejecting with the whole error, reject with a more specific message
    // This makes error handling in components simpler
    return Promise.reject(message);
    // return Promise.reject(error); // Original behavior
  }
);

export default api;

// Example API function structure (add more as needed)
// export const loginUser = async (credentials: LoginData) => {
//   const response = await api.post('/auth/login', credentials);
//   return response.data; // { access_token: string }
// };

// export const getAdminUsers = async () => {
//    const response = await api.get('/users');
//    return response.data; // ProfileDTO[]
// }
