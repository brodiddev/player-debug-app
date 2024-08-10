import React from "react";
import { Volume2, VolumeX, FastForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoControlsProps {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  readyState: number;
  networkState: number;
  displayedFrameRate: number;
  droppedFrames: number[];
  totalFrames: { dropped: number; total: number };
  mediaSourceUrl: string;
  mediaSourceState: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  playbackRate,
  setPlaybackRate,
  currentTime,
  duration,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  videoRef,
  readyState,
  networkState,
  displayedFrameRate,
  droppedFrames,
  totalFrames,
  mediaSourceUrl,
  mediaSourceState,
}) => {
  const getReadyStateText = (state: number) => {
    const states = [
      "HAVE_NOTHING",
      "HAVE_METADATA",
      "HAVE_CURRENT_DATA",
      "HAVE_FUTURE_DATA",
      "HAVE_ENOUGH_DATA",
    ];
    return `${state} (${states[state]})`;
  };

  const getNetworkStateText = (state: number) => {
    const states = [
      "NETWORK_EMPTY",
      "NETWORK_IDLE",
      "NETWORK_LOADING",
      "NETWORK_NO_SOURCE",
    ];
    return `${state} (${states[state]})`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">
          Playback Rate: {playbackRate}x
        </label>
        <div className="flex items-center space-x-2">
          <FastForward size={20} />
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[playbackRate]}
            onValueChange={(value) => {
              setPlaybackRate(value[0]);
              if (videoRef.current) {
                videoRef.current.playbackRate = value[0];
              }
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Volume</label>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[isMuted ? 0 : volume]}
            onValueChange={(value) => {
              setVolume(value[0]);
              setIsMuted(value[0] === 0);
              if (videoRef.current) {
                videoRef.current.volume = value[0];
                videoRef.current.muted = value[0] === 0;
              }
            }}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <div>Current Time: {currentTime.toFixed(2)}s</div>
        <div>Duration: {duration.toFixed(2)}s</div>
      </div>

      <div className="space-y-2">
        <p>ReadyState: {getReadyStateText(readyState)}</p>
        <p>NetworkState: {getNetworkStateText(networkState)}</p>
        <p>DisplayedFrameRate: {displayedFrameRate.toFixed(2)}</p>
        <p>DroppedFramesPerSec: [{droppedFrames.join(",")}]</p>
        <p>
          Total Frames (dropped/total): {totalFrames.dropped} /{" "}
          {totalFrames.total}
        </p>
        <p>MediaSource Extension</p>
        <p>{mediaSourceUrl}</p>
        <p>readyState: {mediaSourceState}</p>
      </div>
    </div>
  );
};

export default VideoControls;
