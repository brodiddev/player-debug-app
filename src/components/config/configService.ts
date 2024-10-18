const STORAGE_KEYS = {
  CONFIG_PERSISTENCE: "config-persistence",
  HLSJS_PLAYER_CONFIG: "hlsJs-player-config",
  SHAKA_PLAYER_CONFIG: "shaka-player-config",
};

export const getConfigKey = (playerLibrary: string) => {
  return playerLibrary.startsWith("shaka")
    ? STORAGE_KEYS.SHAKA_PLAYER_CONFIG
    : STORAGE_KEYS.HLSJS_PLAYER_CONFIG;
};

export const loadConfigFromStorage = (playerLibrary: string) => {
  const storageKey = getConfigKey(playerLibrary);
  const persistedConfig = localStorage.getItem(storageKey);
  return persistedConfig ? JSON.parse(persistedConfig) : null;
};

export const saveConfigToStorage = (playerLibrary: string, config: any) => {
  const storageKey = getConfigKey(playerLibrary);
  localStorage.setItem(storageKey, JSON.stringify(config));
};

export const removeConfigFromStorage = (playerLibrary: string) => {
  const storageKey = getConfigKey(playerLibrary);
  localStorage.removeItem(storageKey);
};

export const loadConfigPersistence = () => {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEYS.CONFIG_PERSISTENCE) || "false"
  );
};

export const saveConfigPersistence = (enabled: boolean) => {
  localStorage.setItem(
    STORAGE_KEYS.CONFIG_PERSISTENCE,
    JSON.stringify(enabled)
  );
};
