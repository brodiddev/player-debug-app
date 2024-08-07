import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PlayerLibrarySelectorProps {
  playerLibrary: string;
  setPlayerLibrary: (library: string) => void;
  customVersion: string;
  setCustomVersion: (version: string) => void;
  showCustomVersion: boolean;
  setShowCustomVersion: (show: boolean) => void;
}

const PlayerLibrarySelector: React.FC<PlayerLibrarySelectorProps> = ({
  playerLibrary,
  setPlayerLibrary,
  customVersion,
  setCustomVersion,
  showCustomVersion,
  setShowCustomVersion,
}) => {
  const handlePlayerLibraryChange = (value: string) => {
    setPlayerLibrary(value);
    setShowCustomVersion(value === "shaka-custom" || value === "hls-custom");
    if (value !== "shaka-custom" && value !== "hls-custom") {
      setCustomVersion("");
    }
  };

  const handleCustomVersionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^(\d+\.){0,2}\d*$/.test(value)) {
      setCustomVersion(value);
    }
  };

  return (
    <>
      <Select value={playerLibrary} onValueChange={handlePlayerLibraryChange}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select player library" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="shaka-4.10.9">Shaka Player 4.10.9</SelectItem>
          <SelectItem value="shaka-4.8.4">Shaka Player 4.8.4</SelectItem>
          <SelectItem value="shaka-custom">Shaka Version Settings</SelectItem>
          <SelectItem value="hls-0.12.4">hls.js 0.12.4</SelectItem>
          <SelectItem value="hls-1.3.0">hls.js 1.3.0</SelectItem>
          <SelectItem value="hls-1.5.13">hls.js 1.5.13</SelectItem>
          <SelectItem value="hls-custom">hls.js Version Settings</SelectItem>
        </SelectContent>
      </Select>

      {showCustomVersion && (
        <Input
          type="text"
          placeholder="Enter version (x.x.x)"
          value={customVersion}
          onChange={handleCustomVersionChange}
          className="w-[150px]"
        />
      )}
    </>
  );
};

export default PlayerLibrarySelector;
