/**
 * useVideoPlayer 훅에서 비디오 요소(CurrentTime, Duration, ReadyState..) 상태를 갱신하고 있고,
 * playerDebugApp 에서 이 곳으로 요소들을 전달한다.
 */
import React from "react";
import { Volume2, VolumeX, FastForward } from "lucide-react";

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
  networkState,
  readyState,
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
  networkState: string;
  readyState: string;
}) => {
  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setVolume(isMuted ? videoRef.current.volume : 0);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Playback Controls
      </h2>

      {/* Playback Rate */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Playback Rate:{" "}
          <span className="text-gray-900 dark:text-gray-100">
            {playbackRate}x
          </span>
        </label>
        <div className="flex items-center space-x-2">
          <FastForward size={20} className="text-gray-900 dark:text-gray-100" />
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            className="w-1/2 h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(
                to right,
                #001f3f ${((playbackRate - 0.5) / 1.5) * 100}%,
                gray ${((playbackRate - 0.5) / 1.5) * 100}%
              )`,
            }}
          />
        </div>
      </div>

      {/* Volume */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Volume:{" "}
          <span className="text-gray-900 dark:text-gray-100">
            {Math.round(volume * 100)}%
          </span>
        </label>
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute}>
            {isMuted ? (
              <VolumeX size={20} className="text-gray-900 dark:text-gray-100" />
            ) : (
              <Volume2 size={20} className="text-gray-900 dark:text-gray-100" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-1/2 h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(
                to right,
                #001f3f ${volume * 100}%,
                gray ${volume * 100}%
              )`,
            }}
          />
        </div>
      </div>

      {/* Current Time and Duration */}
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Current Time:{" "}
          <span className="text-gray-900 dark:text-gray-100">
            {currentTime.toFixed(2)}s
          </span>{" "}
          / Duration:{" "}
          <span className="text-gray-900 dark:text-gray-100">
            {duration.toFixed(2)}s
          </span>
        </p>
      </div>

      {/* Network State */}
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Network State:{" "}
          <span className="text-gray-900 dark:text-gray-100">
            {networkState}
          </span>
        </p>
      </div>

      {/* Ready State */}
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Ready State:{" "}
          <span className="text-gray-900 dark:text-gray-100">{readyState}</span>
        </p>
      </div>
    </div>
  );
};

export default PlaybackPanel;
