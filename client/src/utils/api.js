import axios from "axios";

const API_BASE = "http://localhost:5000/api/ad";

/* AXIOS INSTANCE */

const API = axios.create({
  baseURL: API_BASE
});

/* GENERATE AD */

export const generateAd = (data) => {
  return API.post("/generate", data, {
    headers: {
      "Content-Type":
        data instanceof FormData
          ? "multipart/form-data"
          : "application/json"
    }
  });
};

/* SAVE AD */

export const saveAd = (data) => {
  return API.post("/", data);
};

/* GET ALL ADS */

export const getAds = () => {
  return API.get("/");
};

/* DELETE AD */

export const deleteAd = (id) => {
  return API.delete(`/${id}`);
};

/* DEFAULT EXPORT */

export default API;