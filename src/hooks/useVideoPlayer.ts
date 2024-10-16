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

  const resetVideoPlayerState = useCallback(() => {
    setPlaybackRate(1);
    setCurrentTime(0);
    setDuration(0);
    setVolume(1);
    setIsMuted(false);
    setBufferingCount({ initial: 0, playback: 0 });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const handleWaiting = () => {
      if (currentTime === 0) {
        setBufferingCount((prev) => ({ ...prev, initial: prev.initial + 1 }));
      } else {
        setBufferingCount((prev) => ({ ...prev, playback: prev.playback + 1 }));
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("waiting", handleWaiting);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, [videoRef, currentTime]);

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

  // 플레이어가 완전히 초기화되고 비디오를 로드하도록 보장
  const initializePlayer = useCallback(
    async (config: any) => {
      if (!videoRef.current) return;

      // 기존 플레이어 인스턴스가 있는 경우 destroy
      if (playerRef.current) {
        if (playerRef.current.destroy) {
          await playerRef.current.destroy();
        }
        playerRef.current = null;
      }

      const [library] = playerLibrary.split("-");
      if (library === "shaka") {
        if (window.shaka) {
          playerRef.current = new window.shaka.Player();
          await playerRef.current.attach(videoRef.current);
          playerRef.current.configure(config); // Apply the configuration
          console.log("Shaka player instance:", playerRef.current);
          console.log(
            "Current Shaka config:",
            playerRef.current.getConfiguration()
          );
          addLog("Shaka player initialized and attached successfully");
        } else {
          throw new Error("Shaka player not loaded");
        }
      } else if (library === "hls") {
        if (window.Hls) {
          playerRef.current = new window.Hls(config); // Pass config to HLS.js
          playerRef.current.attachMedia(videoRef.current);
          console.log("HLS.js player instance:", playerRef.current);
          console.log("Current HLS.js config:", playerRef.current.config);
          addLog("HLS.js player initialized successfully");
        } else {
          throw new Error("HLS.js not loaded");
        }
      }
      (window as any).player = playerRef.current;
    },
    [playerLibrary]
  );

  const loadMedia = useCallback(
    async (config: any) => {
      try {
        await loadPlayerLibrary();
        await initializePlayer(config);

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
      } catch (e: unknown) {
        addLog(
          `Error: ${
            e instanceof Error ? e.message : "An unknown error occurred"
          }`
        );
      }
    },
    [videoUrl, playerLibrary, loadPlayerLibrary, initializePlayer]
  );

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
  };
};

export default useVideoPlayer;
