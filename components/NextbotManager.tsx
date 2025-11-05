'use client';

import { useFrame } from '@react-three/fiber';
import { Nextbot } from './Nextbot';
import { useGameStore } from '@/lib/store';
import { NEXTBOT_CONFIG, NextbotType } from '@/lib/constants';

export function NextbotManager() {
  const endGame = useGameStore((state) => state.endGame);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const setTimeRemaining = useGameStore((state) => state.setTimeRemaining);
  const gameState = useGameStore((state) => state.gameState);

  // Define the nextbot types to spawn (mix of all three)
  const nextbotTypes: NextbotType[] = ['police', 'optuznica', 'speed-camera', 'police', 'speed-camera'];

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

  const handleKill = (type: NextbotType) => {
    endGame(false, type); // Player died - pass the nextbot type
  };

  return (
    <>
      {/* Spawn nextbots with different types */}
      {spawnPositions.map((pos, i) => (
        <Nextbot
          key={i}
          position={pos}
          onKill={handleKill}
          type={nextbotTypes[i]}
        />
      ))}
    </>
  );
}
