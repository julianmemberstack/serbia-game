'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls } from '@react-three/drei';
import { Player } from './Player';
import { Map } from './Map';
import { NextbotManager } from './NextbotManager';
import { GameHUD } from './GameHUD';
import { TouchControls } from './TouchControls';
import { useGameStore } from '@/lib/store';

// Keyboard control mapping
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'sprint', keys: ['Space'] },
];

export function Game() {
  const gameState = useGameStore((state) => state.gameState);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 75 }}
        style={{
          width: '100vw',
          height: '100dvh', // Dynamic viewport height for mobile Safari
          position: 'fixed',
          top: 0,
          left: 0
        }}
      >
        {/* Blue sky background */}
        <color attach="background" args={['#5B9BD5']} />

        {/* Lighting - increased for better texture visibility */}
        <ambientLight intensity={0.7} />

        {/* Sun (directional light with visible sphere) */}
        <directionalLight
          position={[50, 80, 30]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Visible sun sphere */}
        <mesh position={[50, 80, 30]}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#FDB813" />
        </mesh>

        <fog attach="fog" args={['#5B9BD5', 40, 100]} />

        {/* Physics World */}
        <Physics gravity={[0, -9.81, 0]}>
          <KeyboardControls map={keyboardMap}>
            {/* Game Objects */}
            <Suspense fallback={null}>
              <Map />
            </Suspense>
            {gameState === 'playing' && (
              <Suspense fallback={null}>
                <>
                  <Player />
                  <NextbotManager />
                </>
              </Suspense>
            )}
          </KeyboardControls>
        </Physics>
      </Canvas>

      {/* UI Overlay */}
      <GameHUD />

      {/* Touch Controls */}
      <TouchControls />
    </>
  );
}
