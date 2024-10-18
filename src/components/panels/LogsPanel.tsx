import React from "react";

type Log = {
  time: string;
  message: string;
};

const LogsPanel = ({ logs }: { logs: Log[] }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
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
);

export default LogsPanel;
