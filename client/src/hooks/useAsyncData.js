import { useCallback, useEffect, useState } from "react";
import { clearInFlightRequest, getCachedEntry, getInFlightRequest, setCachedEntry, setInFlightRequest } from "../utils/apiCache";

const useAsyncData = (loader, deps = [], options = {}) => {
  const { cacheKey = "", staleTime = 0, enabled = true, initialData = null } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const execute = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return null;
    }

    const cached = getCachedEntry(cacheKey);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      setLoading(false);
      setError("");
      return cached.data;
    }

    setLoading(true);
    setError("");

    try {
      const existingRequest = getInFlightRequest(cacheKey);
      const request = existingRequest || loader();

      if (!existingRequest) {
        setInFlightRequest(cacheKey, request);
      }

      const response = await request;
      clearInFlightRequest(cacheKey);
      setData(response.data);
      if (cacheKey) {
        setCachedEntry(cacheKey, response.data);
      }
      return response.data;
    } catch (loadError) {
      clearInFlightRequest(cacheKey);
      setError(loadError.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, enabled, staleTime, ...deps]);

  useEffect(() => {
    if (initialData !== null && initialData !== undefined) {
      setData(initialData);
      setLoading(false);
      return;
    }

    execute();
  }, [execute, initialData]);

  return { data, loading, error, refetch: execute };
};

export default useAsyncData;
