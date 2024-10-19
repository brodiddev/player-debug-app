import { addChunkInfo } from "@/components/mediaChunkLogger";
import { getTimestamp } from "@/components/util/utils";

export function createCustomLoader() {
  return class CustomLoader {
    private stats: any;
    private context: any;
    private request?: XMLHttpRequest;
    private destroyed: boolean = false;

    constructor() {
      this.stats = {
        aborted: false, // 요청이 중단(aborted)되었는지 여부
        loaded: 0, // 로드된 바이트 수
        total: 0, // 전체 바이트 수 (알 수 있을 경우)
        retry: 0, // 재시도 횟수
        chunkCount: 0, // 청크로 로드된 횟수
        bwEstimate: 0, // 대역폭 추정치 (bits/s)
        loading: { start: 0, first: 0, end: 0 }, // 로딩 시간 측정
        parsing: { start: 0, end: 0 }, // 파싱 시간 측정
        buffering: { start: 0, first: 0, end: 0 }, // 버퍼링 시간 측정
      };
    }

    load(context: any, config: any, callbacks: any) {
      const { stats } = this;
      const uri = context.url;
      this.context = context;
      this.request = new XMLHttpRequest();

      // HTTP GET 요청을 설정
      this.request.open("GET", uri, true);
      this.request.responseType = context.responseType || "text";

      // 요청 시작 시간 기록
      stats.loading.start = performance.now();

      // 요청이 완료되었을 때 호출되는 이벤트 핸들러
      this.request.onload = () => {
        if (this.destroyed || stats.aborted) return;

        if (this.request!.status >= 200 && this.request!.status < 300) {
          let data;

          // manifest: responseText를 사용
          // fragment: raw response 사용
          if (this.request!.responseType === "text") {
            data = this.request!.responseText;
          } else {
            data = this.request!.response;
          }

          console.info("@@ response data: ", data);

          stats.loading.end = performance.now();
          stats.total = data.byteLength || data.length;
          stats.loaded = data.byteLength || data.length;

          // 성공 응답 객체 생성
          const response = {
            url: uri,
            data,
          };

          // 성공 콜백 호출 (hls.js 라이브 내에서 데이터 처리함)
          callbacks.onSuccess(response, stats, context);

          // 청크 정보를 기록하는 디버깅
          const currentTime = performance.now();
          const delay = (stats.loading.end - stats.loading.start).toFixed(2);
          const type = uri.split(".").pop() || "unknown"; // 우선 파일 확장자로 타입 결정

          addChunkInfo({
            time: getTimestamp(),
            type,
            currentTime: currentTime.toFixed(2),
            delay,
          });
        } else {
          // HTTP 상태 코드가 200-299가 아닐 경우 에러 처리
          callbacks.onError(
            { code: this.request!.status, text: this.request!.statusText },
            context,
            this.request,
            stats
          );
        }
      };

      // 네트워크 에러 이벤트 핸들러
      this.request.onerror = () => {
        if (stats.aborted || this.destroyed) return;
        callbacks.onError(
          { code: this.request!.status, text: "Network Error" },
          context,
          this.request,
          stats
        );
      };

      // 타임아웃 이벤트 핸들러
      this.request.ontimeout = () => {
        if (stats.aborted || this.destroyed) return;
        callbacks.onTimeout(stats, context, this.request);
      };

      // 요청 전송
      this.request.send();
    }

    abort() {
      if (this.stats.aborted) return; // 이미 중단된 경우

      this.stats.aborted = true;
      this.request?.abort();
    }

    destroy() {
      this.destroyed = true;
      this.request?.abort();
      this.request = undefined;
    }
  };
}
