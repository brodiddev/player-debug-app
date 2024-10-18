import React from "react";
import { Volume2, VolumeX, FastForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface PlayerControlsProps {
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

const PlayerControls: React.FC<PlayerControlsProps> = ({
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
  const handlePlaybackRateChange = (value: number[]) => {
    const newRate = value[0];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
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
            onValueChange={handlePlaybackRateChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Volume</label>
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            className="w-full"
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

export default PlayerControls;
