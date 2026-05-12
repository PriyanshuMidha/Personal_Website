const UI_PREFERENCES_KEY = "portfolio_ui_preferences";

const defaultPreferences = {
  adminSidebarCollapsed: false,
  adminDensity: "comfortable",
};

export const getUiPreferences = () => {
  try {
    const raw = localStorage.getItem(UI_PREFERENCES_KEY);
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
  } catch (_error) {
    return defaultPreferences;
  }
};

export const setUiPreferences = (updates) => {
  const next = { ...getUiPreferences(), ...updates };
  localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(next));
  return next;
};

export const getDefaultUiPreferences = () => defaultPreferences;

