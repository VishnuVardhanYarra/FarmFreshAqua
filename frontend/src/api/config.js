// API Configuration
// Automatically removes any trailing slashes to prevent double slashes (e.g. //auth/login -> 404)
const rawUrl = import.meta.env.VITE_API_URL || "https://farmfreshaqua.onrender.com";
export const API_URL = rawUrl.replace(/\/+$/, "");
