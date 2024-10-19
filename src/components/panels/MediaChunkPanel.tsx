import React from "react";
import { getChunkInfoList } from "@/components/mediaChunkLogger";

const MediaChunksPanel: React.FC = () => {
  const chunkInfoList = getChunkInfoList(); // 청크 정보 가져오기

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Media Chunks</h2>
      <div className="h-64 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Time</th>
              <th className="text-left">Type</th>
              <th className="text-left">Current Time</th>
              <th className="text-left">Delay (ms)</th>
            </tr>
          </thead>
          <tbody>
            {chunkInfoList.map((chunk, index) => (
              <tr key={index}>
                <td>
                  <span className="text-sm text-gray-500">{chunk.time}</span>
                </td>
                <td>{chunk.type}</td>
                <td>{chunk.currentTime}</td>
                <td>{chunk.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MediaChunksPanel;
