'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls } from '@react-three/drei';
import { Player } from './Player';
import { Map } from './Map';
import { NextbotManager } from './NextbotManager';
import { GameHUD } from './GameHUD';
import { useGameStore } from '@/lib/store';

// Keyboard control mapping
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
];

export function Game() {
  const gameState = useGameStore((state) => state.gameState);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 75 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <fog attach="fog" args={['#0C4076', 10, 50]} />

        {/* Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          <KeyboardControls map={keyboardMap}>
            {/* Game Objects */}
            <Map />
            {gameState === 'playing' && (
              <>
                <Player />
                <NextbotManager />
              </>
            )}
          </KeyboardControls>
        </Physics>
      </Canvas>

      {/* UI Overlay */}
      <GameHUD />
    </>
  );
}
