// src/types/dto.ts

// --- Authentication & User ---

// Data yang dibutuhkan untuk Login
export interface LoginDTO {
  email: string;
  password: string;
}

// Data yang dibutuhkan untuk Register
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

// Struktur data dalam JWT Payload setelah didecode
export interface JwtPayload {
  sub: number; // User ID
  email: string;
  role: string; // 'admin' or 'guest'
  iat?: number; // Issued at (optional)
  exp?: number; // Expiration time (optional)
}

// Tipe untuk state dan fungsi yang disediakan oleh AuthContext
export interface AuthContextType {
  token: string | null;
  user: JwtPayload | null; // Menggunakan JwtPayload untuk data user yang login
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// Data user yang ditampilkan (misalnya di profile atau list admin)
// (Tanpa password_hash, sesuai return Omit<> dari backend service)
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "guest"; // Gunakan tipe literal jika memungkinkan
  created_at: string | Date;
  updated_at: string | Date;
}

// Data untuk mengupdate profile user sendiri (PUT /api/users/profile)
export interface UpdateProfileDTO {
  name?: string;
  password?: string; // Opsional, untuk ganti password
}

// Data untuk mengupdate user oleh Admin (PUT /api/users/{id})
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: "admin" | "guest";
  password?: string; // Opsional, untuk reset password
}

// --- Events ---

// Data Event lengkap dari API (GET /events, GET /events/{id})
export interface EventData {
  id: number;
  title: string;
  date: string; // API mengembalikan string 'YYYY-MM-DD'
  created_at: string | Date;
  updated_at: string | Date;
  // Mungkin ada relasi lain seperti guests, messages jika API menyertakannya
}

// Data Event sederhana (untuk relasi atau dropdown)
export interface EventDataSimple {
  id: number;
  title: string;
}

// Data untuk membuat Event baru (POST /api/events)
export interface CreateEventData {
  title: string;
  date: string; // 'YYYY-MM-DD'
}

// Data untuk update Event (PUT /api/events/{id})
export interface UpdateEventData {
  title?: string;
  date?: string; // 'YYYY-MM-DD'
}

// --- Guests ---

// Data Guest sederhana (untuk relasi)
export interface GuestDataSimple {
  id: number;
  name: string;
}

// Data Guest lengkap dari API (GET /guests, GET /guests/{id})
export interface GuestData {
  id: number;
  name: string;
  email: string;
  event_id: number;
  event?: EventDataSimple; // Relasi event (opsional dari API)
  created_at: string | Date;
  updated_at: string | Date;
}

// Data untuk membuat Guest baru (POST /api/guests)
export interface CreateGuestData {
  name: string;
  email: string;
  event_id: number;
}

// Data untuk update Guest (PUT /api/guests/{id})
export interface UpdateGuestData {
  name?: string;
  email?: string;
  event_id?: number;
}

// --- Messages ---

// Data Message lengkap dari API (GET /messages, GET /messages/{id})
export interface MessageData {
  id: number;
  content: string;
  guest_id: number;
  event_id: number;
  guest?: GuestDataSimple; // Relasi guest (opsional dari API)
  event?: EventDataSimple; // Relasi event (opsional dari API)
  created_at: string | Date;
  updated_at: string | Date;
}

// Data untuk membuat Message baru (POST /api/messages)
export interface CreateMessageData {
  content: string;
  guest_id: number;
  event_id: number;
}

// Data untuk update Message (PUT /api/messages/{id})
export interface UpdateMessageData {
  content?: string; // Biasanya hanya konten yang bisa diubah
}
