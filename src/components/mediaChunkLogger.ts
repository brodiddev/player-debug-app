// TODO: hls.js에 국한되지 않고 다른 플레이어(shaka, videojs)도 해당 파일을 공통 컴포넌트로 사용하자

let chunkInfoList: ChunkInfo[] = [];

export interface ChunkInfo {
  time: string;
  type: string;
  currentTime: string;
  delay: string;
}

// 청크 정보 추가 (마지막 100개만 유지)
export function addChunkInfo(info: ChunkInfo) {
  if (chunkInfoList.length >= 100) {
    chunkInfoList.shift();
  }
  chunkInfoList.push(info);
}

// 청크 정보를 반환
export function getChunkInfoList() {
  return chunkInfoList;
}
