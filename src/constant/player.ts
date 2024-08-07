export const LOW_BUFFER_DURATION = 0.2;

/**
 * video element event
 */
export const MEDIA_EVENTS_LIST = {
  resize: "resize",
  ended: "ended",
  seeking: "seeking",
  seeked: "seeked",
  pause: "pause",
  play: "play",
  canplay: "canplay",
  canplaythrough: "canplaythrough",
  playing: "playing",
  timeupdate: "timeupdate",
  error: "error",
  loadedmetadata: "loadedmetadata",
  loadeddata: "loadeddata",
  loadstart: "loadstart",
  durationchange: "durationchange",
  stalled: "stalled",
  waiting: "waiting",
  volumechange: "volumechange",
};

/**
 * shaka event
 */
export const SHAKA_EVENTS_LIST = {
  loaded: "loaded",
  loading: "loading",
  manifestparsed: "manifestparsed",
  manifestupdated: "manifestupdated",
  abrstatuschanged: "abrstatuschanged",
  buffering: "buffering",
  complete: "complete",
  error: "error",
  unloading: "unloading",
  trackschanged: "trackschanged",
  variantchanged: "variantchanged",
  adaptation: "adaptation",
  downloadfailed: "downloadfailed",
  downloadheadersreceived: "downloadheadersreceived",
  drmsessionupdate: "drmsessionupdate",
  emsg: "emsg",
  expirationupdated: "expirationupdated",
  firstquartile: "firstquartile",
  midpoint: "midpoint",
  thirdquartile: "thirdquartile",
  gapjumped: "gapjumped",
  keystatuschanged: "keystatuschanged",
  timelineregionadded: "timelineregionadded",
  timelineregionenter: "timelineregionenter",
  timelineregionexit: "timelineregionexit",
  mediaqualitychanged: "mediaqualitychanged",
  metadata: "metadata",
  ratechange: "ratechange",
  segmentappended: "segmentappended",
  sessiondata: "sessiondata",
  stalldetected: "stalldetected",
  started: "started",
  statechanged: "statechanged",
  onstatechange: "onstatechange",
  streaming: "streaming",
  textchanged: "textchanged",
  texttrackvisibility: "texttrackvisibility",
};

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
