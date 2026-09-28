import axios from "axios";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

let API_URL =
  configuredApiUrl ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "");

API_URL = API_URL.replace(/\/+$/, "");

if (API_URL && !/\/api$/i.test(API_URL)) {
  API_URL = `${API_URL}/api`;
}

if (!configuredApiUrl && process.env.NODE_ENV === "production") {
  console.warn(
    "SQLWhale: NEXT_PUBLIC_API_URL is not configured. API requests will not work in production."
  );
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// Auth calls intentionally use the SQLWhale frontend origin. This keeps
// OAuth/session cookies first-party in browsers with strict privacy rules.
export const authApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

export default api;
