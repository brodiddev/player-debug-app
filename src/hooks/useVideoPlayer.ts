"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { loadPlayerLibrary } from "@/components/library/libraryLoader";
import LogService from "@/components/util/LogService";
import { createCustomLoader } from "@/app/players/hlsjs/customLoader";

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
  const [bufferingCount, setBufferingCount] = useState({
    initial: 0,
    playback: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

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

  const initializePlayer = useCallback(
    async (config: any) => {
      const video = videoRef.current;
      if (!video) {
        LogService.addLog("Video element not available");
        return;
      }

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
        const customConfig = {
          ...config,
          loader: createCustomLoader(), // 커스텀 로더를 설정
        };
        LogService.addLog("Creating Hls instance with custom loader");

        playerRef.current = new window.Hls(customConfig);
        playerRef.current.attachMedia(video);
        LogService.addLog(
          "HLS.js player initialized and media attached successfully"
        );
      } else {
        LogService.addLog(`${library} player not loaded`);
        throw new Error(`${library} player not loaded`);
      }

      // FIXME: muted
      video.muted = true;
      (window as any).player = playerRef.current;
    },
    [playerLibrary]
  );

  const loadMedia = useCallback(
    async (config: any) => {
      if (!videoUrl.trim()) {
        alert("Please enter a valid URL!");
        return;
      }

      try {
        await loadPlayerLibrary(
          playerLibrary,
          customVersion,
          showCustomVersion
        );
        await initializePlayer(config);

        const video = videoRef.current;
        if (!video) return;

        const [library] = playerLibrary.split("-");
        if (library === "shaka" && playerRef.current) {
          await playerRef.current.load(videoUrl);
          LogService.addLog(`Shaka player: Loaded video source ${videoUrl}`);
        } else if (library === "hls" && playerRef.current) {
          playerRef.current.loadSource(videoUrl);
          LogService.addLog(`HLS.js player: Loaded video source ${videoUrl}`);
        }

        video.play();
        LogService.addLog("Video loaded and playing successfully");
      } catch (e: unknown) {
        LogService.addLog(
          `Error: ${
            e instanceof Error ? e.message : "An unknown error occurred"
          }`
        );
      }
    },
    [
      videoUrl,
      playerLibrary,
      customVersion,
      showCustomVersion,
      initializePlayer,
    ]
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
