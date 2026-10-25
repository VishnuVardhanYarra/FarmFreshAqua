// API Configuration
// Reads VITE_API_URL from environment variables in production,
// with safe fallback to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
