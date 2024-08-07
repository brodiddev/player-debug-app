"use client";

import React, { useState } from "react";
import { Moon, Sun, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoControls from "./VideoControls";
import PlayerLibrarySelector from "./PlayerLibrarySelector";
import VideoEventTable from "./VideoEventTable";
import useVideoPlayer from "@/hooks/useVideoPlayer";
import useVideoEvents from "@/hooks/useLiveMedia";
import { initLogUtils } from "./util/logUtils";

const PlayerDebugApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [logs, setLogs] = useState([]);
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
  } = useVideoPlayer();
  const { videoEvents } = useVideoEvents(videoRef);

  // Initialize log utils
  initLogUtils(setLogs);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <header className="bg-gray-900 text-white py-3 px-6 shadow-md">
        {/* Header content */}
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-grow"
            />
            <PlayerLibrarySelector
              playerLibrary={playerLibrary}
              setPlayerLibrary={setPlayerLibrary}
              customVersion={customVersion}
              setCustomVersion={setCustomVersion}
              showCustomVersion={showCustomVersion}
              setShowCustomVersion={setShowCustomVersion}
            />
            <Button onClick={loadMedia}>Load</Button>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <video ref={videoRef} controls className="w-full h-full" />
            </div>
          </div>

          <Tabs defaultValue="playback">
            <TabsList className="mb-4">
              <TabsTrigger value="playback">Playback</TabsTrigger>
              <TabsTrigger value="videoEvents">Video Events</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="playback">
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
            </TabsContent>

            <TabsContent value="videoEvents">
              <VideoEventTable events={videoEvents} />
            </TabsContent>

            <TabsContent value="logs">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-sm text-gray-500">{log.time}</span>:{" "}
                    {log.message}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default PlayerDebugApp;
