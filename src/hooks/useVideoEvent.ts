import { MEDIA_EVENTS_LIST } from "@/app/players/event";
import { LOW_BUFFER_DURATION } from "@/app/players/config";
import {
  getBufferStatus,
  getTimestamp,
  getBufferedRanges,
} from "../components/util/utils";

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
    description += generateWaitingDescription(video);
  }

  const eventRecord: EventHistory = {
    time: getTimestamp(),
    type: event.type,
    currentTime: video.currentTime,
    description: description,
  };

  addPlayerEvent(eventRecord);
};

const generateWaitingDescription = (video: HTMLMediaElement): string => {
  const bufferStatus = getBufferStatus(video);
  const bufferingCause = getBufferingCause(video);
  const tabActive = document.visibilityState === "visible" ? 1 : 0;
  return `, cause=${bufferingCause}, left=${bufferStatus.left.toFixed(
    3
  )}, tabActive=${tabActive}`;
};

const getBufferingCause = (video: HTMLMediaElement): BufferingCause => {
  const bufferStatus = getBufferStatus(video);
  const isInitializing = isInitializingVideo(video);
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

const isInitializingVideo = (video: HTMLMediaElement): boolean => {
  return (
    !video.played.length ||
    (video.currentTime === video.played.start(0) &&
      video.played.end(0) - video.played.start(0) < 0.1)
  );
};
