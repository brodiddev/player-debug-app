"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Moon, Sun, Volume2, VolumeX, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VideoControls = ({
  playbackRate,
  setPlaybackRate,
  currentTime,
  duration,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  videoRef,
  onControlsInteraction,
}) => {
  const handleControlsClick = (e) => {
    e.stopPropagation();
    onControlsInteraction();
  };

  return (
    <div className="p-4 space-y-4" onClick={handleControlsClick}>
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

const PlayerDebugApp = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [playerLibrary, setPlayerLibrary] = useState("shaka-4.10.9");
  const [customVersion, setCustomVersion] = useState("");
  const [showCustomVersion, setShowCustomVersion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferData, setBufferData] = useState([]);
  const [networkStats, setNetworkStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const scriptRef = useRef(null);

  const destroyPlayer = () => {
    if (playerRef.current) {
      if (playerRef.current instanceof window.shaka.Player) {
        playerRef.current.destroy();
      } else if (playerRef.current instanceof Hls) {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.removeAttribute("src");
    }
  };

  const loadPlayerLibrary = () => {
    return new Promise((resolve, reject) => {
      destroyPlayer();

      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
      const script = document.createElement("script");
      scriptRef.current = script;
      const [library, version] = playerLibrary.split("-");
      const actualVersion = showCustomVersion ? customVersion : version;

      // 올바르지 않는 버전 체크
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(actualVersion)) {
        const error = new Error(`Invalid version format: ${actualVersion}`);
        addLog(`Error: ${error.message}`);
        reject(error);
        return;
      }

      if (library === "shaka") {
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/shaka-player/${actualVersion}/shaka-player.compiled.js`;
      } else {
        script.src = `https://cdn.jsdelivr.net/npm/hls.js@${actualVersion}`;
      }
      script.async = true;
      script.onload = () => {
        initPlayer();
        logPlayerInfo(library, actualVersion);
        resolve();
      };
      script.onerror = () => {
        const error = new Error(
          `Failed to load library: ${library} version ${actualVersion}`
        );
        // addLog(error.message);
        reject(error);
      };
      document.body.appendChild(script);
    });
  };

  const logPlayerInfo = (library, version) => {
    console.log(
      `Current player: ${
        library === "shaka" ? "Shaka Player" : "hls.js"
      } / Version: ${version}`
    );
    addLog(
      `Loaded ${
        library === "shaka" ? "Shaka Player" : "hls.js"
      } version ${version}`
    );
  };

  const initPlayer = () => {
    const [library] = playerLibrary.split("-");
    if (library === "shaka") {
      const shaka = window.shaka;
      shaka.polyfill.installAll();
      if (shaka.Player.isBrowserSupported()) {
        playerRef.current = new shaka.Player(videoRef.current);
        playerRef.current.addEventListener("error", onErrorEvent);
      } else {
        addLog("Browser not supported!");
      }
    } else {
      if (Hls.isSupported()) {
        playerRef.current = new Hls();
        playerRef.current.attachMedia(videoRef.current);
        playerRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
          addLog("HLS.js attached to video element");
        });
        playerRef.current.on(Hls.Events.ERROR, (event, data) => {
          addLog(`HLS.js error: ${data.type} - ${data.details}`);
        });
      } else {
        addLog("HLS not supported!");
      }
    }
  };

  const loadVideo = async () => {
    try {
      await loadPlayerLibrary();
      const [library] = playerLibrary.split("-");
      if (library === "shaka") {
        await playerRef.current.load(videoUrl);
      } else {
        playerRef.current.loadSource(videoUrl);
      }
      addLog("Video loaded successfully");
      setIsPlaying(true);
      videoRef.current.play();
    } catch (e) {
      onError(e);
    }
  };

  const onErrorEvent = (event) => {
    onError(event.detail);
  };

  const onError = (error) => {
    addLog(`Error: ${error.message || "An unknown error occurred"}`);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const addLog = (message) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      { time: new Date().toISOString(), message },
    ]);
  };

  const handleControlsInteraction = () => {
    setIsControlsVisible(true);
  };

  const handlePlayerLibraryChange = (value) => {
    setPlayerLibrary(value);
    setShowCustomVersion(value === "shaka-custom" || value === "hls-custom");
    if (value !== "shaka-custom" && value !== "hls-custom") {
      setCustomVersion("");
    }
  };

  const handleCustomVersionChange = (e) => {
    const value = e.target.value;
    if (/^(\d+\.){0,2}\d*$/.test(value)) {
      setCustomVersion(value);
    }
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
            <Input
              type="text"
              placeholder="Enter video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-grow"
            />
            <Select
              value={playerLibrary}
              onValueChange={handlePlayerLibraryChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select player library" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shaka-4.10.9">
                  Shaka Player 4.10.9
                </SelectItem>
                <SelectItem value="shaka-4.8.4">Shaka Player 4.8.4</SelectItem>
                <SelectItem value="shaka-custom">
                  Shaka Version Settings
                </SelectItem>
                <SelectItem value="hls-0.12.4">hls.js 0.12.4</SelectItem>
                <SelectItem value="hls-1.3.0">hls.js 1.3.0</SelectItem>
                <SelectItem value="hls-1.5.13">hls.js 1.5.13</SelectItem>
                <SelectItem value="hls-custom">
                  hls.js Version Settings
                </SelectItem>
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
            <Button onClick={loadVideo}>Load</Button>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setIsControlsVisible(true)}
            onMouseLeave={() => setIsControlsVisible(false)}
          >
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                controls
                className="w-full h-full"
                onTimeUpdate={handleVideoTimeUpdate}
              />
            </div>
            <div
              className={`absolute top-0 right-0 h-full bg-gray-800 bg-opacity-75 text-white transition-all duration-300 ease-in-out ${
                isControlsVisible ? "w-64 opacity-100" : "w-0 opacity-0"
              } overflow-hidden`}
            >
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
                onControlsInteraction={handleControlsInteraction}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Tabs defaultValue="buffer">
              <TabsList className="mb-4">
                <TabsTrigger value="buffer">Buffer</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="buffer">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  {/* <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bufferData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis width={50} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bufferSize"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer> */}
                </div>
              </TabsContent>

              <TabsContent value="network">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Network Statistics</h3>
                  <div>Download Speed: {networkStats.downloadSpeed} Mbps</div>
                  <div>Latency: {networkStats.latency} ms</div>
                </div>
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