import { useCallback, useEffect, useState } from "react";

const useAsyncData = (loader, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const execute = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await loader();
      setData(response.data);
    } catch (loadError) {
      setError(loadError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useAsyncData;

