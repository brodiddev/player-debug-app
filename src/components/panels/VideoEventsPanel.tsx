import React from "react";
import { EventHistory } from "@/hooks/useVideoEvent";

interface VideoEventsPanelProps {
  events: EventHistory[];
}

const VideoEventsPanel: React.FC<VideoEventsPanelProps> = ({ events }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Video Events</h2>
    <div className="h-64 overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Time</th>
            <th className="text-left">Type</th>
            <th className="text-left">Current Time</th>
            <th className="text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>
                <span className="text-sm text-gray-500">{event.time}</span>
              </td>
              <td>{event.type}</td>
              <td>{event.currentTime.toFixed(2)}</td>
              <td>{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default VideoEventsPanel;
