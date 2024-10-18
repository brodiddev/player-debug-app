"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import LogService from "@/components/util/LogService";

declare global {
  interface Window {
    shaka: any;
    Hls: any;
  }
}

const useVideoPlayer = () => {
  // State management
  const [videoUrl, setVideoUrl] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playerLibrary, setPlayerLibrary] = useState("shaka-4.10.9");
  const [customVersion, setCustomVersion] = useState("");
  const [showCustomVersion, setShowCustomVersion] = useState(false);
  const [bufferingCount, setBufferingCount] = useState({
    initial: 0,
    playback: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  // Resets player state
  const resetVideoPlayerState = useCallback(() => {
    setPlaybackRate(1);
    setCurrentTime(0);
    setDuration(0);
    setVolume(1);
    setIsMuted(false);
    setBufferingCount({ initial: 0, playback: 0 });
  }, []);

  // 이벤트 리스너 등록
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const handleWaiting = () => {
      setBufferingCount((prev) => ({
        ...prev,
        [currentTime === 0 ? "initial" : "playback"]:
          prev[currentTime === 0 ? "initial" : "playback"] + 1,
      }));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("waiting", handleWaiting);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, [currentTime]);

  // 라이브러리 로드 콜백
  const loadPlayerLibrary = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      const [library, version] = playerLibrary.split("-");
      const actualVersion = showCustomVersion ? customVersion : version;

      script.src =
        library === "shaka"
          ? `https://cdnjs.cloudflare.com/ajax/libs/shaka-player/${actualVersion}/shaka-player.compiled.js`
          : `https://cdn.jsdelivr.net/npm/hls.js@${actualVersion}`;

      script.onload = () => {
        LogService.addLog(
          `Successfully loaded ${library} player library version ${actualVersion}`
        );
        resolve();
      };

      script.onerror = () => {
        const errorMessage = `Failed to load ${library} player library version ${actualVersion}`;
        LogService.addLog(errorMessage);
        alert(errorMessage);
        reject(new Error(errorMessage));
      };

      document.body.appendChild(script);
    });
  }, [playerLibrary, showCustomVersion, customVersion]);

  // Initializes the player
  const initializePlayer = useCallback(
    async (config: any) => {
      const video = videoRef.current;
      if (!video) return;

      // Destroy existing player
      if (playerRef.current?.destroy) {
        await playerRef.current.destroy();
        playerRef.current = null;
      }

      const [library] = playerLibrary.split("-");
      if (library === "shaka" && window.shaka) {
        playerRef.current = new window.shaka.Player();
        await playerRef.current.attach(video);
        playerRef.current.configure(config);
        LogService.addLog("Shaka player initialized and attached successfully");
      } else if (library === "hls" && window.Hls) {
        playerRef.current = new window.Hls(config);
        playerRef.current.attachMedia(video);
        LogService.addLog("HLS.js player initialized successfully");
      } else {
        throw new Error(`${library} player not loaded`);
      }

      // FIXME: muted
      video.muted = true;
      (window as any).player = playerRef.current;
    },
    [playerLibrary]
  );

  // 미디어 재생
  const loadMedia = useCallback(
    async (config: any) => {
      if (!videoUrl.trim()) {
        alert("Please enter a valid URL!");
        return;
      }

      try {
        await loadPlayerLibrary();
        await initializePlayer(config);

        const [library] = playerLibrary.split("-");
        if (library === "shaka") {
          await playerRef.current.load(videoUrl);
          LogService.addLog(`Shaka player: Loaded video source ${videoUrl}`);
        } else if (library === "hls") {
          playerRef.current.loadSource(videoUrl);
          LogService.addLog(`HLS.js player: Loaded video source ${videoUrl}`);
        }

        videoRef.current?.play();
        LogService.addLog("Video loaded successfully");
      } catch (e: unknown) {
        LogService.addLog(
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
    bufferingCount,
    resetVideoPlayerState,
  };
};

export default useVideoPlayer;
