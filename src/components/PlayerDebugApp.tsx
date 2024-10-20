"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Moon, Sun, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlayerLibrarySelector } from "./library/LibrarySelector";
import useVideoPlayer from "@/hooks/useVideoPlayer";
import useVideoEvents from "@/hooks/useLiveMedia";
import LogService from "./util/LogService";
import {
  SAMPLE_URLS,
  DEFAULT_HLSJS_CONFIG,
  DEFAULT_SHAKA_CONFIG,
} from "@/app/players/config";
import { ConfigEditor } from "./config/ConfigEditor";
import {
  loadConfigFromStorage,
  saveConfigToStorage,
  removeConfigFromStorage,
  loadConfigPersistence,
  saveConfigPersistence,
  loadVideoUrlFromStorage,
  loadPlayerLibraryVersionFromStorage,
  saveVideoUrlToStorage,
} from "@/components/config/configService";
import InfoPanel from "@/components/panels/InfoPanels";
import LogsPanel from "@/components/panels/LogsPanel";
import PlaybackPanel from "@/components/panels/PlaybackPanel";
import VideoEventsPanel from "@/components/panels/VideoEventsPanel";
import MediaChunksPanel from "@/components/panels/MediaChunkPanel";

export const DEBUGGER_VERSION = "v1.0.7";

const PlayerDebugApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [visibleSections, setVisibleSections] = useState({
    info: true,
    playback: true,
    videoEvents: true,
    logs: true,
    mediaChunks: true,
  });
  const [configPersistenceEnabled, setConfigPersistenceEnabled] =
    useState(false);
  const [currentConfig, setCurrentConfig] = useState<any>(null);

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
    LogService.initLogDetection(setLogs);

    // 로컬 스토리지의 url, library, config, persist 여부 상태를 가져옴
    const persistedConfig = loadConfigFromStorage(playerLibrary);
    const persistedPersistence = loadConfigPersistence();
    const persistedVideoUrl = loadVideoUrlFromStorage();
    const persistedPlayerLibrary = loadPlayerLibraryVersionFromStorage();

    setConfigPersistenceEnabled(persistedPersistence);
    setCurrentConfig(
      persistedConfig ||
        (playerLibrary.startsWith("shaka")
          ? DEFAULT_SHAKA_CONFIG
          : DEFAULT_HLSJS_CONFIG)
    );

    // 입력 URL과 선택 라이브러리 로컬 스토리지 저장
    setVideoUrl(persistedVideoUrl);
    setPlayerLibrary(persistedPlayerLibrary);
  }, [playerLibrary]);

  // 샘플 URL과 입력 URL 모두 로컬 스토리지 저장
  const handleVideoUrlUpdate = (url: string) => {
    setVideoUrl(url);
    saveVideoUrlToStorage(url);
  };

  const handleConfigChange = (newConfig: any) => {
    setCurrentConfig(newConfig);
    if (configPersistenceEnabled) {
      saveConfigToStorage(playerLibrary, newConfig);
    }
  };

  const handlePersistenceChange = (checked: boolean) => {
    setConfigPersistenceEnabled(checked);
    saveConfigPersistence(checked);
    checked
      ? saveConfigToStorage(playerLibrary, currentConfig)
      : removeConfigFromStorage(playerLibrary);
  };

  const initPlayer = useCallback(() => {
    resetVideoPlayerState();
    resetVideoEvents();
    setLogs([]);
    LogService.clearLogs();
  }, [resetVideoPlayerState, resetVideoEvents]);

  const handleLoadMedia = useCallback(() => {
    if (
      (playerLibrary === "shaka-custom" || playerLibrary === "hls-custom") &&
      !customVersion
    ) {
      alert("Please enter a custom version for the selected player library.");
      return;
    }
    initPlayer();
    loadMedia(currentConfig);
  }, [initPlayer, loadMedia, currentConfig, playerLibrary, customVersion]);

  const toggleSection = (section: keyof typeof visibleSections) => {
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
            <h1 className="text-xl font-medium">
              Player Debug App
              <span className="text-sm text-gray-400 ml-2">
                {DEBUGGER_VERSION}
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            {darkMode ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-400" />
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row space-x-4">
          {/* left side*/}
          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            {/* URL 입력 영역 */}
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter video URL"
                value={videoUrl}
                onChange={(e) => handleVideoUrlUpdate(e.target.value)}
                className="flex-grow"
              />
              <Select onValueChange={handleVideoUrlUpdate}>
                <SelectTrigger className="w-[250px]">
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

            {/* ConfigEditor */}
            <ConfigEditor
              initialConfig={currentConfig}
              onChange={handleConfigChange}
              darkMode={darkMode}
              configPersistenceEnabled={configPersistenceEnabled}
            />

            {/* Persist 체크박스 */}
            <div className="flex justify-center mt-2">
              <Checkbox
                checked={configPersistenceEnabled}
                onCheckedChange={handlePersistenceChange}
              />
              <span className="ml-2">persist</span>
            </div>

            {/* 비디오 */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <video ref={videoRef} controls className="w-full h-full" />
            </div>

            {/* Logs 패널 */}
            <div className="mt-6">
              {visibleSections.logs && <LogsPanel logs={logs} />}
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            {/* 패널 체크박스 */}
            <div className="flex space-x-4 mb-4">
              {Object.entries(visibleSections).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <Checkbox
                    checked={value}
                    onCheckedChange={() =>
                      toggleSection(key as keyof typeof visibleSections)
                    }
                  />
                  <span className="ml-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            {/* 디버그 패널들 */}
            <div className="flex flex-col space-y-4">
              {visibleSections.info && (
                <InfoPanel bufferingCount={bufferingCount} />
              )}
              {visibleSections.playback && (
                <PlaybackPanel
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
              )}
              {visibleSections.videoEvents && (
                <VideoEventsPanel events={videoEvents} />
              )}
              {visibleSections.mediaChunks && <MediaChunksPanel />}
            </div>
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

      {/* footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center text-sm">
        Contact:{" "}
        <a href="mailto:devuxr@naver.com" className="hover:underline">
          brodi
        </a>
      </footer>
    </div>
  );
};

export default PlayerDebugApp;
