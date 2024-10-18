import LogService from "../util/LogService";

export const loadPlayerLibrary = (
  playerLibrary: string,
  customVersion: string,
  showCustomVersion: boolean
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const [library, version] = playerLibrary.split("-");
    const actualVersion = showCustomVersion ? customVersion : version;

    script.src =
      library === "shaka"
        ? `https://cdnjs.cloudflare.com/ajax/libs/shaka-player/${actualVersion}/shaka-player.compiled.js`
        : `https://cdn.jsdelivr.net/npm/hls.js@${actualVersion}`;

    script.onload = () => {
      LogService.addLog(
        `Successfully loaded ${library} player library version ${actualVersion}`
      );
      resolve();
    };

    script.onerror = () => {
      const errorMessage = `Failed to load ${library} player library version ${actualVersion}`;
      LogService.addLog(errorMessage);
      alert(errorMessage);
      reject(new Error(errorMessage));
    };

    document.body.appendChild(script);
  });
};
