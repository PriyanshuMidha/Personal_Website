const cacheStore = new Map();
const inFlightStore = new Map();

export const getCachedEntry = (key) => {
  if (!key) return null;
  return cacheStore.get(key) || null;
};

export const setCachedEntry = (key, data) => {
  if (!key) return;
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const deleteCachedEntry = (key) => {
  if (!key) return;
  cacheStore.delete(key);
  inFlightStore.delete(key);
};

export const invalidateCache = (prefixes = []) => {
  const normalized = Array.isArray(prefixes) ? prefixes : [prefixes];

  Array.from(cacheStore.keys()).forEach((key) => {
    if (normalized.some((prefix) => key === prefix || key.startsWith(`${prefix}:`))) {
      cacheStore.delete(key);
    }
  });

  Array.from(inFlightStore.keys()).forEach((key) => {
    if (normalized.some((prefix) => key === prefix || key.startsWith(`${prefix}:`))) {
      inFlightStore.delete(key);
    }
  });
};

export const getInFlightRequest = (key) => {
  if (!key) return null;
  return inFlightStore.get(key) || null;
};

export const setInFlightRequest = (key, promise) => {
  if (!key) return;
  inFlightStore.set(key, promise);
};

export const clearInFlightRequest = (key) => {
  if (!key) return;
  inFlightStore.delete(key);
};
