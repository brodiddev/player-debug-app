import { getTimestamp } from "./debuggerUtils";
let setLogsFunction: (logs: any[]) => void;
let logs: any[] = [];

export const initLogUtils = (setLogs: (logs: any[]) => void) => {
  setLogsFunction = setLogs;
};

export const addLog = (message: string) => {
  if (setLogsFunction) {
    const newLog = { time: getTimestamp(), message };
    logs.push(newLog);
    setLogsFunction([...logs]);
  }
};

export const clearLogs = () => {
  if (setLogsFunction) {
    setLogsFunction([]);
  }
};
