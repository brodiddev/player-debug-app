import React from "react";
import VideoControls from "@/components/VideoControls";

const PlaybackPanel = ({
  playbackRate,
  setPlaybackRate,
  currentTime,
  duration,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  videoRef,
}: {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Playback Controls</h2>
    <VideoControls
      playbackRate={playbackRate}
      setPlaybackRate={setPlaybackRate}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
      setVolume={setVolume}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
      videoRef={videoRef}
    />
  </div>
);

export default PlaybackPanel;
