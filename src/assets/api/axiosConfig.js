import axios from "axios";

// Axios instance for communication with backend API (Java Spring)
const api = axios.create({
  baseURL: "https://cinecritique.mi.hdm-stuttgart.de/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
