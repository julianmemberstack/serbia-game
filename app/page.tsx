import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <main className="flex flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-7xl font-bold text-white drop-shadow-2xl">
          LAW ABIDING SERBIAN CITIZEN SIMULATOR
        </h1>
        <p className="text-2xl text-white/90 max-w-2xl drop-shadow-lg">
          Experience the daily life of a law-abiding Serbian citizen!
        </p>
        <div className="flex gap-6 text-5xl my-4">
          <span className="text-red-600">█</span>
          <span className="text-blue-800">█</span>
          <span className="text-white">█</span>
        </div>
        <Link
          href="/game"
          className="px-16 py-6 text-3xl font-bold text-white rounded-lg transition-all hover:scale-110 shadow-2xl"
          style={{ backgroundColor: '#0C4076' }}
        >
          PLAY NOW
        </Link>
        <div className="mt-8 text-white/70 text-lg">
          <p>🎮 WASD to Move • SHIFT to Sprint • Mouse to Look</p>
          <p className="mt-2">⏱️ Survive for 60 seconds to win!</p>
        </div>
      </main>
    </div>
  );
}
