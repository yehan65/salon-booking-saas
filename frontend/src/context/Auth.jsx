import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../services/api";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  async function loadUser() {
    try {
      setLoading(true);

      const response = await api.get("/user/auth/me");
      setUser(response.data.data);
    } catch (error) {
      console.error("❌ Error message:", error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  function storeToken(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isEmailVerified: user?.isEmailVerified || false,
    loading,
    setLoading,
    storeToken,
    token,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
