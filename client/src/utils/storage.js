const TOKEN_KEY = "adminToken";
const LEGACY_TOKEN_KEY = "portfolio_admin_token";

/** Reads JWT from localStorage (`adminToken`); migrates legacy `portfolio_admin_token` once. */
export const getToken = () => {
  const next = localStorage.getItem(TOKEN_KEY);
  if (next) return next;
  const legacy = localStorage.getItem(LEGACY_TOKEN_KEY);
  if (!legacy) return null;
  localStorage.setItem(TOKEN_KEY, legacy);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  return legacy;
};

export const setToken = (token) => {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

