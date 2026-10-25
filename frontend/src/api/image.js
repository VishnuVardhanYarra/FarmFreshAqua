// src/api/image.js
import axios from "axios";
import { API_URL } from "./config";

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${API_URL}/images/predict`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
};
