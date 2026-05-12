import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { clearToken, getToken, setToken } from "../utils/storage";

const useAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    const hydrate = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const response = await adminApi.me();
        setAdmin(response.data);
      } catch (_error) {
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (credentials) => {
    const response = await adminApi.login(credentials);
    setToken(response.data.token);
    setAdmin(response.data.admin);
    return response;
  };

  const logout = () => {
    clearToken();
    setAdmin(null);
  };

  return { admin, loading, login, logout, isAuthenticated: Boolean(admin) };
};

export default useAuth;

