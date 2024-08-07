import React from "react";
import { Volume2, VolumeX } from "lucide-react";
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
}) => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Playback Rate: {playbackRate}x
        </label>
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
        />
      </div>

      <div>
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
          />
        </div>
      </div>

      <div>
        <div>Current Time: {currentTime.toFixed(2)}s</div>
        <div>Duration: {duration.toFixed(2)}s</div>
      </div>
    </div>
  );
};

export default VideoControls;
