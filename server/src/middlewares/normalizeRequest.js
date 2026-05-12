const arrayToTrimmedList = (value) =>
  (Array.isArray(value) ? value : String(value).split(/[\n,]/))
    .flatMap((item) => (typeof item === "string" ? item.split(/\n/) : [item]))
    .map((item) => (typeof item === "string" ? item.trim() : item))
    .filter((item) => item !== "" && item !== null && item !== undefined);

const trimNestedValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(trimNestedValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [key, trimNestedValue(nestedValue)])
        .filter(([, nestedValue]) => nestedValue !== undefined)
    );
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return value;
};

const toNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

const toDateOrNull = (value) => {
  if (value === "") return null;
  return value;
};

export const createNormalizer = (config = {}, source = "body") => (req, _res, next) => {
  const target = req[source];

  if (!target || typeof target !== "object" || Array.isArray(target)) {
    next();
    return;
  }

  const arrayFields = new Set(config.arrayFields || []);
  const booleanFields = new Set(config.booleanFields || []);
  const numberFields = new Set(config.numberFields || []);
  const dateFields = new Set(config.dateFields || []);

  const normalizedEntries = Object.entries(target).map(([key, value]) => {
    if (arrayFields.has(key)) {
      return [key, value === undefined ? value : arrayToTrimmedList(value)];
    }

    if (booleanFields.has(key)) {
      return [key, toBoolean(value)];
    }

    if (numberFields.has(key)) {
      return [key, toNumber(value)];
    }

    if (dateFields.has(key)) {
      return [key, toDateOrNull(value)];
    }

    return [key, trimNestedValue(value)];
  });

  req[source] = Object.fromEntries(
    normalizedEntries.filter(([, value]) => value !== undefined)
  );

  if (process.env.NODE_ENV !== "production" && source === "body") {
    console.log(`[cms-debug] normalized ${req.method} ${req.originalUrl}`, req[source]);
  }

  next();
};

export default createNormalizer;
