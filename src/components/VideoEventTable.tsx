import React from "react";
import { EventHistory } from "@/hooks/useVideoEvent";

interface VideoEventTableProps {
  events: EventHistory[];
}

const VideoEventTable: React.FC<VideoEventTableProps> = ({ events }) => {
  return (
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
            <td>{event.time}</td>
            <td>{event.type}</td>
            <td>{event.currentTime.toFixed(2)}</td>
            <td>{event.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VideoEventTable;
