'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RigidBodyApi } from '@react-three/rapier';
import { Billboard, Plane, useTexture } from '@react-three/drei';
import { Vector3 } from 'three';
import { NEXTBOT_CONFIG, NextbotType, NEXTBOT_TEXTURES } from '@/lib/constants';
import { useGameStore } from '@/lib/store';

interface NextbotProps {
  position: [number, number, number];
  onKill: (type: NextbotType) => void;
  type: NextbotType;
}

export function Nextbot({ position, onKill, type }: NextbotProps) {
  const botRef = useRef<RigidBodyApi>(null);
  const { camera } = useThree();
  const gameState = useGameStore((state) => state.gameState);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const startTime = useRef(Date.now());

  // Load the texture based on nextbot type
  const texture = useTexture(NEXTBOT_TEXTURES[type]);

  // Calculate aspect ratio from texture to prevent warping
  const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
  const billboardWidth = NEXTBOT_CONFIG.SIZE * aspectRatio;
  const billboardHeight = NEXTBOT_CONFIG.SIZE;

  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());
  const direction = useRef(new Vector3());

  const hasKilled = useRef(false);

  useFrame(() => {
    if (!botRef.current || gameState !== 'playing') return;

    // Wait for spawn delay
    const timeSinceSpawn = (Date.now() - startTime.current) / 1000;
    if (timeSinceSpawn < NEXTBOT_CONFIG.SPAWN_DELAY) return;

    const botPos = botRef.current.translation();

    currentPosition.current.set(botPos.x, botPos.y, botPos.z);
    targetPosition.current.set(playerPosition.x, botPos.y, playerPosition.z);

    // Calculate direction to player
    direction.current
      .subVectors(targetPosition.current, currentPosition.current)
      .normalize()
      .multiplyScalar(NEXTBOT_CONFIG.SPEED);

    // Move towards player
    botRef.current.setLinvel(
      { x: direction.current.x, y: 0, z: direction.current.z },
      true
    );

    // Check if close enough to kill player (horizontal distance only)
    const dx = currentPosition.current.x - playerPosition.x;
    const dz = currentPosition.current.z - playerPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < NEXTBOT_CONFIG.KILL_DISTANCE && !hasKilled.current) {
      hasKilled.current = true;
      onKill(type);
    }
  });

  return (
    <RigidBody
      ref={botRef}
      type="dynamic"
      colliders="ball"
      position={position}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      mass={0.1}
    >
      <Billboard position={[0, NEXTBOT_CONFIG.HEIGHT_OFFSET, 0]}>
        <Plane args={[billboardWidth, billboardHeight]}>
          <meshBasicMaterial map={texture} transparent />
        </Plane>
      </Billboard>

      {/* Collision sphere (invisible) */}
      <mesh>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial visible={false} />
      </mesh>
    </RigidBody>
  );
}
