import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("splms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("splms_token"));

  useEffect(() => {
    if (!token) return;

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem("splms_user", JSON.stringify(response.data.user));
      })
      .catch(() => logout());
  }, [token]);

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("splms_token", response.data.token);
    localStorage.setItem("splms_user", JSON.stringify(response.data.user));
    setToken(response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("splms_token");
    localStorage.removeItem("splms_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, login, logout, isAuthenticated: Boolean(token && user) }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
