import axios from "axios";

// All browser API traffic goes through the SQLWhale Next.js proxy.
// This keeps the SQLWhale session cookie first-party while the proxy
// forwards requests to the configured backend.
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// Auth routes have a dedicated proxy, so authentication and session
// cookies stay on the SQLWhale frontend origin.
export const authApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

export default api;
