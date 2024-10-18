import { DEBUGGER_VERSION } from "../PlayerDebugApp";

const InfoPanel = ({ bufferingCount }: { bufferingCount: any }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Info</h2>
    <p>Debugger Version: {DEBUGGER_VERSION}</p>
    <p>User Agent: {navigator.userAgent}</p>
    <p>
      Buffering Count (Initial/Playback): {bufferingCount.initial}/
      {bufferingCount.playback}
    </p>
  </div>
);

export default InfoPanel;
