import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const generateAd = (data) => API.post("/ads/generate", data);
export const getAds = () => API.get("/ads");