import { getTimestamp } from "./utils";

class LogService {
  private static setLogsFunction:
    | ((logs: (prevLogs: any[]) => any[]) => void)
    | undefined;

  static initLogDetection(setLogs: (logs: (prevLogs: any[]) => any[]) => void) {
    this.setLogsFunction = setLogs;
  }

  static addLog(message: string) {
    if (this.setLogsFunction) {
      const newLog = { time: getTimestamp(), message };
      this.setLogsFunction((prevLogs) => [...prevLogs, newLog]);
    }
  }

  static clearLogs() {
    if (this.setLogsFunction) {
      this.setLogsFunction(() => []);
    }
  }
}

export default LogService;
