const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const trimString = (value) => (typeof value === "string" ? value.trim() : value);

const toTrimmedArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : item))
      .filter((item) => item !== "" && item !== null && item !== undefined);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const clampNonNegativeNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(0, parsed);
};

const normalizeTextValue = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return trimString(String(value));
};

const normalizeUrlValue = (value) => normalizeTextValue(value, "");

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch (_error) {
    return false;
  }
};

const getSelectDefault = (field) => field.defaultValue ?? field.options?.[0] ?? "";

export const getFieldDefaultValue = (field) => {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  if (field.type === "checkbox") {
    return field.name === "isPublished";
  }

  if (field.type === "array") {
    return [];
  }

  if (field.type === "number") {
    return field.name === "displayOrder" ? 0 : "";
  }

  if (field.type === "select") {
    return getSelectDefault(field);
  }

  return "";
};

export const buildResourceInitialState = (config) =>
  config.fields.reduce(
    (accumulator, field) => ({
      ...accumulator,
      [field.name]: getFieldDefaultValue(field),
    }),
    config.endpoint === "/admin/projects" ? { screenshots: [] } : {}
  );

const normalizeFieldValue = (field, value) => {
  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "array") {
    return toTrimmedArray(value);
  }

  if (field.type === "number") {
    if (field.name === "displayOrder") {
      return clampNonNegativeNumber(value, 0);
    }

    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }

  if (field.type === "date") {
    return value ? String(value) : null;
  }

  if (field.type === "select") {
    const normalized = normalizeTextValue(value, "");
    const options = field.options || [];

    if (!normalized) {
      return getSelectDefault(field);
    }

    return options.includes(normalized) ? normalized : getSelectDefault(field);
  }

  return normalizeTextValue(value, "");
};

export const normalizeResourcePayload = (form, config) =>
  config.fields.reduce((payload, field) => {
    payload[field.name] = normalizeFieldValue(field, form[field.name]);
    return payload;
  }, config.endpoint === "/admin/projects" ? { screenshots: Array.isArray(form.screenshots) ? form.screenshots : [] } : {});

export const validateResourcePayload = (payload, config) => {
  const errors = [];

  config.fields.forEach((field) => {
    const value = payload[field.name];

    if (field.required) {
      const isMissing =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (isMissing) {
        errors.push(`${field.label}: ${field.label.toLowerCase()} is required`);
        return;
      }
    }

    if (field.type === "number" && field.name === "displayOrder" && Number(value) < 0) {
      errors.push("Display Order: display order cannot be negative");
    }

    if ((field.name.endsWith("Url") || field.name === "icon") && !isValidUrl(value)) {
      errors.push(`${field.label}: enter a valid URL`);
    }
  });

  return errors;
};

export const normalizeProfilePayload = (form) => {
  const socialLinks = (Array.isArray(form.socialLinks) ? form.socialLinks : [])
    .map((link) => ({
      platform: normalizeTextValue(link?.platform, ""),
      url: normalizeUrlValue(link?.url),
      icon: normalizeTextValue(link?.icon, ""),
      displayOrder: clampNonNegativeNumber(link?.displayOrder, 0),
    }))
    .filter((link) => link.platform && link.url);

  const profileImage = isPlainObject(form.profileImage) ? form.profileImage : null;
  const resume = isPlainObject(form.resume) ? form.resume : null;

  return {
    name: normalizeTextValue(form.name || form.fullName, ""),
    fullName: normalizeTextValue(form.fullName || form.name, ""),
    headline: normalizeTextValue(form.headline, ""),
    shortIntro: normalizeTextValue(form.shortIntro || form.subheadline, ""),
    subheadline: normalizeTextValue(form.subheadline || form.shortIntro, ""),
    about: normalizeTextValue(form.about || form.aboutDescription, ""),
    profileImageUrl: normalizeUrlValue(form.profileImageUrl || profileImage?.url),
    resumeUrl: normalizeUrlValue(form.resumeUrl || resume?.url),
    email: normalizeTextValue(form.email, ""),
    phone: normalizeTextValue(form.phone, ""),
    location: normalizeTextValue(form.location, ""),
    githubUrl: normalizeUrlValue(form.githubUrl),
    linkedinUrl: normalizeUrlValue(form.linkedinUrl),
    instagramUrl: normalizeUrlValue(form.instagramUrl),
    currentRole: normalizeTextValue(form.currentRole, ""),
    currentCompany: normalizeTextValue(form.currentCompany, ""),
    heroDescription: normalizeTextValue(form.heroDescription, ""),
    bio: normalizeTextValue(form.bio, ""),
    aboutTitle: normalizeTextValue(form.aboutTitle, ""),
    aboutDescription: normalizeTextValue(form.aboutDescription || form.about, ""),
    yearsOfExperience: clampNonNegativeNumber(form.yearsOfExperience, 0),
    highlights: toTrimmedArray(form.highlights),
    specialties: toTrimmedArray(form.specialties),
    socialLinks,
    seoTitle: normalizeTextValue(form.seoTitle, ""),
    seoDescription: normalizeTextValue(form.seoDescription, ""),
    isPublished: Boolean(form.isPublished),
    profileImage,
    resume,
  };
};

export const validateProfilePayload = (payload) => {
  const errors = [];

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push("Contact Email: enter a valid email address");
  }

  ["githubUrl", "linkedinUrl", "instagramUrl", "profileImageUrl", "resumeUrl"].forEach((fieldName) => {
    if (!isValidUrl(payload[fieldName])) {
      errors.push(`${fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}: enter a valid URL`);
    }
  });

  if (payload.yearsOfExperience < 0) {
    errors.push("Years Of Experience: value cannot be negative");
  }

  return errors;
};
