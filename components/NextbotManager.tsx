'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Nextbot } from './Nextbot';
import { useGameStore } from '@/lib/store';
import { NEXTBOT_CONFIG, NextbotType } from '@/lib/constants';

export function NextbotManager() {
  const endGame = useGameStore((state) => state.endGame);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const setTimeRemaining = useGameStore((state) => state.setTimeRemaining);
  const gameState = useGameStore((state) => state.gameState);

  // Preset spawn locations around the map
  const allSpawnLocations: [number, number, number][] = [
    // Corners
    [25, 2, 25],
    [25, 2, -25],
    [-25, 2, 25],
    [-25, 2, -25],
    // Mid edges
    [25, 2, 0],
    [-25, 2, 0],
    [0, 2, 25],
    [0, 2, -25],
    // Quarter points
    [25, 2, 12],
    [25, 2, -12],
    [-25, 2, 12],
    [-25, 2, -12],
    [12, 2, 25],
    [-12, 2, 25],
    [12, 2, -25],
    [-12, 2, -25],
  ];

  // Randomly select spawn positions and types each time component mounts
  const { spawnPositions, nextbotTypes } = useMemo(() => {
    // Shuffle the spawn locations
    const shuffledLocations = [...allSpawnLocations].sort(() => Math.random() - 0.5);
    const selectedPositions = shuffledLocations.slice(0, NEXTBOT_CONFIG.SPAWN_COUNT);

    // Randomly assign types
    const typeOptions: NextbotType[] = ['police', 'optuznica', 'speed-camera'];
    const selectedTypes: NextbotType[] = [];
    for (let i = 0; i < NEXTBOT_CONFIG.SPAWN_COUNT; i++) {
      selectedTypes.push(typeOptions[Math.floor(Math.random() * typeOptions.length)]);
    }

    return {
      spawnPositions: selectedPositions,
      nextbotTypes: selectedTypes,
    };
  }, []); // Only run once when component mounts

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
