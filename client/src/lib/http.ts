import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

http.interceptors.response.use((response) => {
  const data = response.data;

  if (Object.prototype.hasOwnProperty.call(data, "data") && !data.links) {
    return data;
  }

  return response;
});
