import React from "react";
import { EventHistory } from "@/hooks/useVideoEvent";

interface VideoEventTableProps {
  events: EventHistory[];
}

const VideoEventTable: React.FC<VideoEventTableProps> = ({ events }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-96 overflow-y-auto">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pr-4">Timestamp</th>
            <th className="pr-4">Event</th>
            <th className="pr-4">Current Time</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr
              key={index}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="pr-4">{event.time}</td>
              <td className="pr-4">{event.type}</td>
              <td className="pr-4">{event.currentTime.toFixed(6)}</td>
              <td>{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoEventTable;
