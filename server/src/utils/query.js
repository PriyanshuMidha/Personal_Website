export const buildPublicQueryOptions = (query = {}) => ({
  sort: query.sort || "displayOrder",
});

export const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

