import dynamic from "next/dynamic";

const PlayerDebugApp = dynamic(() => import("@/components/PlayerDebugApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <PlayerDebugApp />
    </main>
  );
}
