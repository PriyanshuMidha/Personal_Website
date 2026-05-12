const dbState = {
  status: "idle",
  message: "Database connection has not started yet.",
  originalError: null,
};

export const setDatabaseState = (updates) => {
  Object.assign(dbState, updates);
};

export const getDatabaseState = () => ({ ...dbState });

export const isDatabaseReady = () => dbState.status === "connected";

export default dbState;
