import { DEBUGGER_VERSION } from "../PlayerDebugApp";

const InfoPanel = ({ bufferingCount }: { bufferingCount: any }) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold mb-4">Info</h2>

    {/* Debugger Version */}
    <div className="mb-2">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Debugger Version:{" "}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {DEBUGGER_VERSION}
      </span>
    </div>

    {/* User Agent */}
    <div className="mb-2">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        User Agent:{" "}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {navigator.userAgent}
      </span>
    </div>

    {/* Buffering Count */}
    <div>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Buffering Count (Initial/Playback):{" "}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {bufferingCount.initial}/{bufferingCount.playback}
      </span>
    </div>
  </div>
);

export default InfoPanel;
