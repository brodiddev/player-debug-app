import { useState, useEffect, useCallback, RefObject } from "react";
import { MEDIA_EVENTS_LIST } from "@/constant/player";
import { setEventRecord, EventHistory } from "./useVideoEvent";

const useVideoEvents = (videoRef: RefObject<HTMLVideoElement>) => {
  const [videoEvents, setVideoEvents] = useState<EventHistory[]>([]);

  const resetVideoEvents = useCallback(() => {
    setVideoEvents([]);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoElEventHandler = (event: Event) => {
      setEventRecord(video, event, addPlayerEvent);
    };

    const bindVideoElEvents = () => {
      Object.entries(MEDIA_EVENTS_LIST).forEach(([key, value]) => {
        video.addEventListener(key, videoElEventHandler);
      });
    };

    const unbindVideoElEvents = () => {
      Object.entries(MEDIA_EVENTS_LIST).forEach(([key, value]) => {
        video.removeEventListener(key, videoElEventHandler);
      });
    };

    bindVideoElEvents();
    return unbindVideoElEvents;
  }, [videoRef]);

  const addPlayerEvent = (event: EventHistory) => {
    setVideoEvents((prev) => [...prev, event]);
  };

  return { videoEvents, resetVideoEvents };
};

export default useVideoEvents;
