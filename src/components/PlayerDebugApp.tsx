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
  const [playerLibrary, setPlayerLibrary] = useState("shaka-latest");
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

  useEffect(() => {
    loadPlayerLibrary();
  }, [playerLibrary]);

  const loadPlayerLibrary = () => {
    const script = document.createElement("script");
    const [library, version] = playerLibrary.split("-");
    if (library === "shaka") {
      script.src = `https://cdnjs.cloudflare.com/ajax/libs/shaka-player/${version}/shaka-player.compiled.js`;
    } else {
      script.src = `https://cdn.jsdelivr.net/npm/hls.js@${version}`;
    }
    script.async = true;
    script.onload = initPlayer;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
    if (playerRef.current) {
      try {
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
    }
  };

  const onErrorEvent = (event) => {
    onError(event.detail);
  };

  const onError = (error) => {
    addLog(`Error: ${error.message}`);
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
            <Select value={playerLibrary} onValueChange={setPlayerLibrary}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select player library" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shaka-latest">
                  Shaka Player (Latest)
                </SelectItem>
                <SelectItem value="shaka-3.0.0">Shaka Player 3.0.0</SelectItem>
                <SelectItem value="hls-latest">HLS.js (Latest)</SelectItem>
                <SelectItem value="hls-1.0.0">HLS.js 1.0.0</SelectItem>
              </SelectContent>
            </Select>
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
                  <ResponsiveContainer width="100%" height={300}>
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
                  </ResponsiveContainer>
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
