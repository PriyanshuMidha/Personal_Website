import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { clearToken, getToken, setToken } from "../utils/storage";

let hydratePromise = null;
let hydratedAdmin = null;

const useAuth = () => {
  const [admin, setAdmin] = useState(hydratedAdmin);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    const hydrate = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      if (hydratedAdmin) {
        setAdmin(hydratedAdmin);
        setLoading(false);
        return;
      }

      try {
        hydratePromise = hydratePromise || adminApi.me();
        const response = await hydratePromise;
        hydratedAdmin = response.data;
        setAdmin(response.data);
      } catch (_error) {
        clearToken();
        hydratedAdmin = null;
      } finally {
        hydratePromise = null;
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (credentials) => {
    const response = await adminApi.login(credentials);
    setToken(response.data.token);
    hydratedAdmin = response.data.admin;
    setAdmin(response.data.admin);
    return response;
  };

  const logout = () => {
    clearToken();
    hydratedAdmin = null;
    setAdmin(null);
  };

  return { admin, loading, login, logout, isAuthenticated: Boolean(admin) };
};

export default useAuth;
