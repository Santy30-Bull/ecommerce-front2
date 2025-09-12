import axios from "axios";

const API_URL = "http://localhost:3000"; // Ajusta según tu backend Nest

export const loginRequest = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const signUpRequest = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
    return response.data;
};
