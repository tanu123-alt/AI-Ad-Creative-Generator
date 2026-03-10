import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  timeout: 180000,
});

// Auth
export const signup = (data) => API.post("/auth/signup", data);
export const signin = (data) => API.post("/auth/signin", data);

// Ad generation
export const generateAd = (data) => {
  if (data instanceof FormData) {
    return API.post("/ad/generate", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/ad/generate", data);
};

export const getAds = () => API.get("/ad");
export const deleteAd = (id) => API.delete(`/ad/${id}`);

export default API;