import { getTimestamp } from "./debuggerUtils";
let setLogsFunction: (logs: any[]) => void;

export const initLogUtils = (setLogs: (logs: any[]) => void) => {
  setLogsFunction = setLogs;
};

export const addLog = (message: string) => {
  if (setLogsFunction) {
    setLogsFunction((prevLogs) => [
      ...prevLogs,
      { time: getTimestamp(), message },
    ]);
  }
};

export const clearLogs = () => {
  if (setLogsFunction) {
    setLogsFunction([]);
  }
};
