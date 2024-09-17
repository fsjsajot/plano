import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.BASE_URL || "http://localhost:8000",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default http;
