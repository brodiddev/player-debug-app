let setLogsFunction: (logs: any[]) => void;

export const initLogUtils = (setLogs: (logs: any[]) => void) => {
  setLogsFunction = setLogs;
};

export const addLog = (message: string) => {
  if (setLogsFunction) {
    setLogsFunction((prevLogs) => [
      ...prevLogs,
      { time: new Date().toISOString(), message },
    ]);
  }
};
