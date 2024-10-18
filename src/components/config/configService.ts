const STORAGE_KEYS = {
  CONFIG_PERSISTENCE: "config-persistence",
  HLSJS_PLAYER_CONFIG: "hlsJs-player-config",
  SHAKA_PLAYER_CONFIG: "shaka-player-config",
  VIDEO_URL: "video-url",
  PLAYER_LIBRARY_VERSION: "player-library-version",
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

export const saveVideoUrlToStorage = (url: string) => {
  localStorage.setItem(STORAGE_KEYS.VIDEO_URL, url);
};

export const loadVideoUrlFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.VIDEO_URL) || "";
};

export const savePlayerLibraryVersionToStorage = (playerLibrary: string) => {
  localStorage.setItem(STORAGE_KEYS.PLAYER_LIBRARY_VERSION, playerLibrary);
};

export const loadPlayerLibraryVersionFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.PLAYER_LIBRARY_VERSION) || "";
};
