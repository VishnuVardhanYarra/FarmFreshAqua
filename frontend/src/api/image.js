// src/api/image.js
import axios from "axios";
import { API_URL } from "./config";

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Let browser/Axios set Content-Type with the multipart boundary automatically
    const res = await axios.post(`${API_URL}/images/predict`, formData);
    return res.data;
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
};
