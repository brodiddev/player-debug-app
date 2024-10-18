export const defaultHlsJsConfig = {
  debug: true,
  startFragPrefetch: true,
  liveDurationInfinity: true,
  liveSyncDuration: 4,
  liveMaxLatencyDuration: 6,
  abrEwmaFastLive: 2.0,
  abrEwmaSlowLive: 6.0,
  maxBufferHole: 0.5,
  highBufferWatchdogPeriod: 3,
  playlistLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 4000,
      maxLoadTimeMs: 5000,
      timeoutRetry: {
        maxNumRetry: 9999999,
        retryDelayMs: 500,
        maxRetryDelayMs: 4000,
      },
      errorRetry: {
        maxNumRetry: 9999999,
        retryDelayMs: 500,
        maxRetryDelayMs: 1000,
      },
    },
  },
  fragLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 4000,
      maxLoadTimeMs: 5000,
      timeoutRetry: {
        maxNumRetry: 9999999,
        retryDelayMs: 500,
        maxRetryDelayMs: 1000,
      },
      errorRetry: {
        maxNumRetry: 9999999,
        retryDelayMs: 500,
        maxRetryDelayMs: 1000,
      },
    },
  },
};

export const defaultShakaConfig = {
  streaming: {
    bufferingGoal: 5,
    bufferBehind: 30,
    rebufferingGoal: 2,
    useNativeHlsOnSafari: false,
  },
  preferredAudioLanguage: "ko",
  abr: {
    enabled: false,
    switchInterval: 15,
    bandwidthUpgradeTarget: 0.7,
    bandwidthDowngradeTarget: 0.8,
    advanced: {
      fastHalfLife: 4,
      slowHalfLife: 10,
    },
  },
};
