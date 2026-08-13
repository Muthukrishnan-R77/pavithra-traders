export type AppMode = "full" | "customer" | "admin";

export function getAppMode(): AppMode {
  const mode = process.env.APP_MODE;
  if (mode === "customer" || mode === "admin") return mode;
  return "full";
}

export function isCustomerMode() {
  return getAppMode() === "customer";
}

export function isAdminMode() {
  return getAppMode() === "admin";
}

export function isSplitDeployment() {
  return isCustomerMode() || isAdminMode();
}
