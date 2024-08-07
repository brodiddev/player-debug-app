import { LOW_BUFFER_DURATION, MEDIA_EVENTS_LIST } from "@/constant/player";
import { getBufferStatus, getTimestamp, getBufferedRanges } from "./utils";

export enum BufferingCause {
  INITIALIZING = "initializing",
  SEEKING = "seeking",
  FRAME_DROP = "frameDrop",
  BUFFER_LACK = "bufferLack",
  UNKNOWN = "unknown",
}

export interface EventHistory {
  time: string;
  type: string;
  currentTime: number;
  description: string;
}

export const setEventRecord = (
  video: HTMLMediaElement,
  event: Event,
  addPlayerEvent: (event: EventHistory) => void
) => {
  if (event.type === MEDIA_EVENTS_LIST.timeupdate) {
    return;
  }

  const bufferedRanges = getBufferedRanges(video);
  if (bufferedRanges.length === 0) return;

  let description = `buffered=${bufferedRanges.join(" ")}`;

  if (event.type === MEDIA_EVENTS_LIST.waiting) {
    const bufferStatus = getBufferStatus(video);
    const bufferingCause = getBufferingCause(video);
    const tabActive = document.visibilityState === "visible" ? 1 : 0;
    description += `, cause=${bufferingCause}, left=${bufferStatus.left.toFixed(
      3
    )}, tabActive=${tabActive}`;
  }

  const eventRecord: EventHistory = {
    time: getTimestamp(),
    type: event.type,
    currentTime: video.currentTime,
    description: description,
  };

  addPlayerEvent(eventRecord);
};

const getBufferingCause = (video: HTMLMediaElement): BufferingCause => {
  const bufferStatus = getBufferStatus(video);
  const isInitializing =
    !video.played.length ||
    (video.currentTime === video.played.start(0) &&
      video.played.end(0) - video.played.start(0) < 0.1);
  const isSeeking = video.seeking;
  const isBuffering =
    video.readyState <= 2 && bufferStatus.left < LOW_BUFFER_DURATION;
  const frameDrop = !isSeeking && video.readyState <= 2;

  if (isInitializing) return BufferingCause.INITIALIZING;
  if (isBuffering) return BufferingCause.BUFFER_LACK;
  if (isSeeking) return BufferingCause.SEEKING;
  if (frameDrop) return BufferingCause.FRAME_DROP;

  return BufferingCause.UNKNOWN;
};
