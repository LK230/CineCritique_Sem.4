import api from "../api/axiosConfig";

// Cheks if backend is available, if not show backend error page
const checkBackend = async () => {
  try {
    const response = await api.get("/movies");
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Backend-Check-Fehler:", error);
  }
  return false;
};

export default checkBackend;
