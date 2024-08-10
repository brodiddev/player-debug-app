"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Moon, Sun, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoControls from "./VideoControls";
import PlayerLibrarySelector from "./PlayerLibrarySelector";
import VideoEventTable from "./VideoEventTable";
import useVideoPlayer from "@/hooks/useVideoPlayer";
import useVideoEvents from "@/hooks/useLiveMedia";
import { initLogUtils, clearLogs } from "./util/logUtils";
import { SAMPLE_URLS } from "@/constant/player";

const DEBUGGER_VERSION = "1.0.0";

const PlayerDebugApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [logs, setLogs] = useState([]);
  const [visibleSections, setVisibleSections] = useState({
    info: true,
    playback: true,
    videoEvents: true,
    logs: true,
  });
  const [userIp, setUserIp] = useState("");

  const {
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
  } = useVideoPlayer();

  const { videoEvents, resetVideoEvents } = useVideoEvents(videoRef);

  useEffect(() => {
    initLogUtils(setLogs);
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  const resetAllData = useCallback(() => {
    resetVideoPlayerState();
    resetVideoEvents();
    clearLogs();
    setLogs([]);
  }, [resetVideoPlayerState, resetVideoEvents]);

  const handleLoadMedia = useCallback(() => {
    resetAllData();
    loadMedia();
  }, [resetAllData, loadMedia]);

  const handleSampleUrlSelect = (url: string) => {
    setVideoUrl(url);
  };

  const toggleSection = (
    section: "info" | "playback" | "videoEvents" | "logs"
  ) => {
    setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <header className="bg-gray-900 text-white py-3 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-medium">Player Debug App</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Dark Mode</span>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="mr-2"
            />
            {darkMode ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-400" />
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Enter video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Select onValueChange={handleSampleUrlSelect}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select sample URL" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_URLS.map((sample, index) => (
                  <SelectItem key={index} value={sample.url}>
                    {sample.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <PlayerLibrarySelector
              playerLibrary={playerLibrary}
              setPlayerLibrary={setPlayerLibrary}
              customVersion={customVersion}
              setCustomVersion={setCustomVersion}
              showCustomVersion={showCustomVersion}
              setShowCustomVersion={setShowCustomVersion}
            />
            <Button onClick={handleLoadMedia}>Load</Button>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <video ref={videoRef} controls className="w-full h-full" />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <Checkbox
              checked={visibleSections.info}
              onCheckedChange={() => toggleSection("info")}
              label="Info"
            />
            <Checkbox
              checked={visibleSections.playback}
              onCheckedChange={() => toggleSection("playback")}
              label="Playback"
            />
            <Checkbox
              checked={visibleSections.videoEvents}
              onCheckedChange={() => toggleSection("videoEvents")}
              label="Video Events"
            />
            <Checkbox
              checked={visibleSections.logs}
              onCheckedChange={() => toggleSection("logs")}
              label="Logs"
            />
          </div>

          <div className="flex space-x-4">
            {visibleSections.info && (
              <div className="w-[40%] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Info</h2>
                <p>Debugger Version: {DEBUGGER_VERSION}</p>
                <p>User Agent: {navigator.userAgent}</p>
                <p>User IP: {userIp}</p>
                <p>
                  Buffering Count (Initial/Playback): {bufferingCount.initial}/
                  {bufferingCount.playback}
                </p>
              </div>
            )}

            {visibleSections.logs && (
              <div className="w-[60%] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Logs</h2>
                <div className="h-48 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-sm text-gray-500">{log.time}</span>:{" "}
                      {log.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            {visibleSections.playback && (
              <div className="w-[30%] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">
                  Playback Controls
                </h2>
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
            )}

            {visibleSections.videoEvents && (
              <div className="w-[70%] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Video Events</h2>
                <div className="h-64 overflow-y-auto">
                  <VideoEventTable events={videoEvents} />
                </div>
              </div>
            )}
          </div>
        </div>

        <Alert className="mt-6">
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            This is a debug page. Some features may not work as expected in all
            browsers or with all video sources.
          </AlertDescription>
        </Alert>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Contact:{" "}
            <a href="mailto:brodi@sooplive.com" className="hover:underline">
              brodi@sooplive.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlayerDebugApp;
