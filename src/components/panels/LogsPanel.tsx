import React from "react";

type Log = {
  time: string;
  message: string;
};

// URL을 하이퍼링크로 변환
const convertToLink = (message: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return message.split(urlPattern).map((part, index) => {
    if (part.match(urlPattern)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const LogsPanel = ({ logs }: { logs: Log[] }) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">Logs</h2>
    <div className="h-64 overflow-y-auto space-y-1">
      {logs.map((log, index) => (
        <div key={index} className="flex flex-col border-b pb-1 mb-1">
          {" "}
          {/* 타임스탬프 */}
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
            {log.time}
          </span>
          {/* 로그 메시지 */}
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
            {convertToLink(log.message)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default LogsPanel;
