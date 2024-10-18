export const SAMPLE_URLS = [
  {
    label: "BBB - adaptive qualities",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  {
    label: "BBB - 480 only",
    url: "https://test-streams.mux.dev/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8",
  },
  {
    label: "HLS fMP4",
    url: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s-fmp4/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
  },
];

export const LOW_BUFFER_DURATION = 0.2;

export const DEFAULT_HLSJS_CONFIG = {
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

export const DEFAULT_SHAKA_CONFIG = {
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
