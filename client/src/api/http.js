const rawBase = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";
const BASE_URL = rawBase.replace(/\/$/, "");
const isDev = import.meta.env.DEV;
const hasBody = (body) => body !== undefined && body !== null;
const isJsonLikeBody = (body) =>
  hasBody(body) &&
  !(body instanceof FormData) &&
  (Array.isArray(body) || (typeof body === "object" && body.constructor === Object));

const serializeBodyForDebug = (body) => {
  if (!body) return null;
  if (body instanceof FormData) {
    return Object.fromEntries(body.entries());
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (_error) {
      return body;
    }
  }

  return body;
};

export const apiRequest = async (path, options = {}) => {
  const method = options.method || "GET";
  const originalBody = options.body;
  const body = isJsonLikeBody(originalBody) ? JSON.stringify(originalBody) : originalBody;
  const headers = {
    ...(options.headers || {}),
  };

  if (hasBody(body) && !(originalBody instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  const payload = await response.json().catch(() => ({}));

  if (isDev && path.startsWith("/admin") && method !== "GET") {
    console.log("[cms-debug] request", {
      method,
      url: `${BASE_URL}${path}`,
      payload: serializeBodyForDebug(body),
    });
  }

  if (response.ok) {
    if (isDev && path.startsWith("/admin") && method !== "GET") {
      console.log("[cms-debug] response", payload);
    }
    return payload;
  }

  if (isDev && path.startsWith("/admin") && method !== "GET") {
    console.log("[cms-debug] error.response.data", payload);
  }

  const errors = Array.isArray(payload.errors) ? payload.errors : [];
  const detailsMessage = errors.map((entry) => `${entry.field}: ${entry.message}`).join(" | ");
  const error = new Error(detailsMessage || payload.message || "Request failed");
  error.status = response.status;
  error.errors = errors;
  error.payload = payload;
  throw error;
};

export default BASE_URL;
