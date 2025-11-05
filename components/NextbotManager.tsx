'use client';

import { useFrame } from '@react-three/fiber';
import { Nextbot } from './Nextbot';
import { useGameStore } from '@/lib/store';
import { NEXTBOT_CONFIG } from '@/lib/constants';

export function NextbotManager() {
  const endGame = useGameStore((state) => state.endGame);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const setTimeRemaining = useGameStore((state) => state.setTimeRemaining);
  const gameState = useGameStore((state) => state.gameState);

  // Generate spawn positions for nextbots (around the perimeter)
  const spawnPositions: [number, number, number][] = [];
  for (let i = 0; i < NEXTBOT_CONFIG.SPAWN_COUNT; i++) {
    const angle = (i / NEXTBOT_CONFIG.SPAWN_COUNT) * Math.PI * 2;
    const radius = 25; // Increased from 20 to match larger map
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    spawnPositions.push([x, 2, z]);
  }

  // Timer countdown
  useFrame((state, delta) => {
    if (gameState !== 'playing') return;

    const newTime = timeRemaining - delta;

    if (newTime <= 0) {
      setTimeRemaining(0);
      endGame(true); // Player won!
    } else {
      setTimeRemaining(newTime);
    }
  });

  const handleKill = () => {
    endGame(false); // Player died
  };

  return (
    <>
      {/* Spawn nextbots */}
      {spawnPositions.map((pos, i) => (
        <Nextbot
          key={i}
          position={pos}
          onKill={handleKill}
          texturePath={i === 0 ? '/optuznica.webp' : '/policijska-vozila.png'}
        />
      ))}
    </>
  );
}
