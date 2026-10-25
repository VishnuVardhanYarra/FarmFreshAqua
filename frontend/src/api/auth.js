import axios from "axios";
import { API_URL } from "./config";

export const registerFarmer = (data) =>
  axios.post(`${API_URL}/auth/register`, data);

export const loginFarmer = async (phone, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { phone, password });
  return res.data;
};

export const getFarmerProfile = (phone) =>
  axios.get(`${API_URL}/auth/profile`, { params: { phone } });
