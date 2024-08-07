export const getTimestamp = (): string => {
  const now = new Date();
  return (
    now.toLocaleTimeString("en-US", { hour12: false }) +
    "." +
    String(now.getMilliseconds()).padStart(3, "0")
  );
};

export const getBufferedRanges = (video: HTMLMediaElement): string[] => {
  const bufferedRanges = [];
  for (let i = 0; i < video.buffered.length; i++) {
    bufferedRanges.push(
      `[${video.buffered.start(i).toFixed(3)}, ${video.buffered
        .end(i)
        .toFixed(3)}]`
    );
  }
  return bufferedRanges;
};

export const getBufferStatus = (video: HTMLMediaElement) => {
  const bufferedLength = video.buffered.length;
  let position = video.currentTime;
  let played = 0;
  let left = 0;
  let total = 0;

  for (let i = 0; i < bufferedLength; i++) {
    const start = video.buffered.start(i);
    const end = video.buffered.end(i);
    let duration = Math.max(0, end - start);
    if (start <= position && position < end) {
      played += Math.max(0, position - start);
      left += Math.max(0, end - position);
    } else if (start > position) {
      left += duration;
    } else {
      played += duration;
    }
    total += duration;
  }
  return { played, left, total };
};
