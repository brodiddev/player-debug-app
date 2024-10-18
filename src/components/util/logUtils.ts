import { getTimestamp } from "./debuggerUtils";

let setLogsFunction: ((logs: (prevLogs: any[]) => any[]) => void) | undefined;

export const initLogDetect = (
  setLogs: (logs: (prevLogs: any[]) => any[]) => void
) => {
  setLogsFunction = setLogs;
};

export const addLog = (message: string) => {
  if (setLogsFunction) {
    const newLog = { time: getTimestamp(), message };
    setLogsFunction((prevLogs) => [...prevLogs, newLog]);
  }
};

export const clearLogs = () => {
  if (setLogsFunction) {
    setLogsFunction(() => []);
  }
};
