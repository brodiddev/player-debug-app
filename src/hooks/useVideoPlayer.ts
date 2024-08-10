"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { addLog } from "@/components/util/logUtils";
declare global {
  interface Window {
    shaka: any;
    Hls: any;
  }
}

const useVideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playerLibrary, setPlayerLibrary] = useState("shaka-4.10.9");
  const [customVersion, setCustomVersion] = useState("");
  const [showCustomVersion, setShowCustomVersion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [bufferingCount, setBufferingCount] = useState({
    initial: 0,
    playback: 0,
  });
  const [readyState, setReadyState] = useState(0);
  const [networkState, setNetworkState] = useState(0);
  const [displayedFrameRate, setDisplayedFrameRate] = useState(0);
  const [droppedFrames, setDroppedFrames] = useState<number[]>([]);
  const [totalFrames, setTotalFrames] = useState({ dropped: 0, total: 0 });
  const [mediaSourceUrl, setMediaSourceUrl] = useState("");
  const [mediaSourceState, setMediaSourceState] = useState("");

  const resetVideoPlayerState = useCallback(() => {
    setPlaybackRate(1);
    setCurrentTime(0);
    setDuration(0);
    setVolume(1);
    setIsMuted(false);
    setBufferingCount({ initial: 0, playback: 0 });
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const updateVideoInfo = () => {
      setReadyState(video.readyState);
      setNetworkState(video.networkState);

      // Frame rate and dropped frames
      if ("getVideoPlaybackQuality" in video) {
        const quality = video.getVideoPlaybackQuality();
        setDisplayedFrameRate(quality.totalVideoFrames / video.currentTime);
        setTotalFrames({
          dropped: quality.droppedVideoFrames,
          total: quality.totalVideoFrames,
        });

        setDroppedFrames((prev) => {
          const newDropped = [
            ...prev,
            quality.droppedVideoFrames -
              (prev.length > 0 ? prev[prev.length - 1] : 0),
          ];
          return newDropped.slice(-20); // 마지막 20개
        });
      }

      // MSE
      if (video.src.startsWith("blob:")) {
        setMediaSourceUrl(video.src);
        const mediaSource = video.srcObject as MediaSource;
        if (mediaSource) {
          setMediaSourceState(mediaSource.readyState);
        }
      }
    };

    const intervalId = setInterval(updateVideoInfo, 1000); // 1초마다 업데이트

    return () => clearInterval(intervalId);
  }, [videoRef]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const loadPlayerLibrary = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      const [library, version] = playerLibrary.split("-");
      const actualVersion = showCustomVersion ? customVersion : version;

      if (library === "shaka") {
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/shaka-player/${actualVersion}/shaka-player.compiled.js`;
      } else if (library === "hls") {
        script.src = `https://cdn.jsdelivr.net/npm/hls.js@${actualVersion}`;
      } else {
        reject(new Error("Unsupported library"));
        return;
      }

      script.onload = () => {
        addLog(
          `Successfully loaded ${library} player library version ${actualVersion}`
        );
        resolve();
      };

      script.onerror = () => {
        const errorMessage = `Failed to load ${library} player library version ${actualVersion}`;
        addLog(errorMessage);
        reject(new Error(errorMessage));
      };

      document.body.appendChild(script);
    });
  }, [playerLibrary, showCustomVersion, customVersion]);

  const initializePlayer = useCallback(() => {
    if (!videoRef.current) return;

    const [library] = playerLibrary.split("-");
    if (library === "shaka") {
      if (window.shaka) {
        playerRef.current = new window.shaka.Player(videoRef.current);
        addLog("Shaka player initialized successfully");
      } else {
        throw new Error("Shaka player not loaded");
      }
    } else if (library === "hls") {
      if (window.Hls) {
        playerRef.current = new window.Hls();
        playerRef.current.attachMedia(videoRef.current);
        addLog("HLS.js player initialized successfully");
      } else {
        throw new Error("HLS.js not loaded");
      }
    }
  }, [playerLibrary]);

  const loadMedia = useCallback(async () => {
    try {
      await loadPlayerLibrary();
      initializePlayer();

      if (!videoRef.current || !playerRef.current) {
        throw new Error("Video element or player not initialized");
      }

      const [library] = playerLibrary.split("-");
      if (library === "shaka") {
        await playerRef.current.load(videoUrl);
        addLog(`Shaka player: Loaded video source ${videoUrl}`);
      } else if (library === "hls") {
        playerRef.current.loadSource(videoUrl);
        addLog(`HLS.js player: Loaded video source ${videoUrl}`);
      }

      addLog("Video loaded successfully");
      videoRef.current.play();
    } catch (e) {
      addLog(`Error: ${e.message || "An unknown error occurred"}`);
    }
  }, [videoUrl, playerLibrary, loadPlayerLibrary, initializePlayer]);

  return {
    videoUrl,
    setVideoUrl,
    videoRef,
    loadMedia,
    playbackRate,
    setPlaybackRate,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    playerLibrary,
    setPlayerLibrary,
    customVersion,
    setCustomVersion,
    showCustomVersion,
    setShowCustomVersion,
    handleTimeUpdate,
    bufferingCount,
    resetVideoPlayerState,
    readyState,
    networkState,
    displayedFrameRate,
    droppedFrames,
    totalFrames,
    mediaSourceUrl,
    mediaSourceState,
  };
};

export default useVideoPlayer;
