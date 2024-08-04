import dynamic from 'next/dynamic';

const VideoDebugApp = dynamic(() => import('@/components/VideoDebugApp'), { ssr: false });

export default function Home() {
  return (
    <main>
      <VideoDebugApp />
    </main>
  );
}