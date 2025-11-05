import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <main className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
          LAW ABIDING SERBIAN CITIZEN SIMULATOR
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl drop-shadow-lg">
          Experience the daily life of a law-abiding Serbian citizen!
        </p>
        <Link
          href="/game"
          className="px-10 py-4 text-xl md:text-2xl font-bold text-white rounded-lg transition-all hover:scale-110 shadow-2xl"
          style={{ backgroundColor: '#0C4076' }}
        >
          PLAY NOW
        </Link>
        <div className="mt-4 text-white/70 text-sm md:text-base">
          <p>🎮 WASD to Move • SPACE to Sprint • Mouse to Look</p>
          <p className="mt-1">⏱️ Survive for 60 seconds to win!</p>
        </div>
      </main>
    </div>
  );
}
