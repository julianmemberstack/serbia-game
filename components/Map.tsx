'use client';

import { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import { SERBIAN_COLORS, MAP_CONFIG } from '@/lib/constants';
import * as THREE from 'three';

export function Map() {
  const wallHeight = MAP_CONFIG.WALL_HEIGHT;
  const wallThickness = MAP_CONFIG.WALL_THICKNESS;
  const mazeSize = MAP_CONFIG.SIZE;

  // Load apartment texture
  const apartmentTexture = useTexture('/apartmani.jpg');

  // Configure texture wrapping - simple tiling
  useMemo(() => {
    if (apartmentTexture) {
      apartmentTexture.wrapS = THREE.RepeatWrapping;
      apartmentTexture.wrapT = THREE.RepeatWrapping;
      apartmentTexture.needsUpdate = true;
    }
    return apartmentTexture;
  }, [apartmentTexture]);

  // Larger, more complex maze layout - walls defined as [x, z, width, depth]
  const walls = [
    // Outer boundary
    [0, -mazeSize / 2, mazeSize, wallThickness], // North wall
    [0, mazeSize / 2, mazeSize, wallThickness],  // South wall
    [-mazeSize / 2, 0, wallThickness, mazeSize], // West wall
    [mazeSize / 2, 0, wallThickness, mazeSize],  // East wall

    // Complex inner maze - more open spaces with strategic corridors
    // Vertical walls
    [20, -10, wallThickness, 15],
    [20, 15, wallThickness, 20],
    [-20, 10, wallThickness, 15],
    [-20, -15, wallThickness, 20],
    [10, -20, wallThickness, 12],
    [-10, 20, wallThickness, 12],

    // Horizontal walls
    [15, 10, 12, wallThickness],
    [-15, -10, 12, wallThickness],
    [0, 20, 15, wallThickness],
    [0, -20, 15, wallThickness],
    [-8, 0, 10, wallThickness],
    [8, 5, 10, wallThickness],

    // Corner sections
    [18, 18, 8, wallThickness],
    [-18, -18, 8, wallThickness],
    [18, -18, wallThickness, 8],
    [-18, 18, wallThickness, 8],

    // Additional complexity
    [5, -10, wallThickness, 8],
    [-5, 10, wallThickness, 8],
    [12, -5, 8, wallThickness],
    [-12, 5, 8, wallThickness],
  ];

  return (
    <>
      {/* Ground with Serbian flag pattern */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[MAP_CONFIG.GROUND_SIZE, 1, MAP_CONFIG.GROUND_SIZE]} />
          <meshStandardMaterial color={SERBIAN_COLORS.WHITE} />
        </mesh>
      </RigidBody>

      {/* Ground stripes (Serbian flag pattern) */}
      <mesh receiveShadow position={[0, -0.49, -MAP_CONFIG.GROUND_SIZE / 4]}>
        <boxGeometry args={[MAP_CONFIG.GROUND_SIZE, 0.01, MAP_CONFIG.GROUND_SIZE / 3]} />
        <meshStandardMaterial color={SERBIAN_COLORS.RED} />
      </mesh>
      <mesh receiveShadow position={[0, -0.49, MAP_CONFIG.GROUND_SIZE / 4]}>
        <boxGeometry args={[MAP_CONFIG.GROUND_SIZE, 0.01, MAP_CONFIG.GROUND_SIZE / 3]} />
        <meshStandardMaterial color={SERBIAN_COLORS.BLUE} />
      </mesh>

      {/* Maze Walls with apartment texture */}
      {walls.map((wall, index) => {
        const wallWidth = wall[2];  // X dimension
        const wallDepth = wall[3];  // Z dimension

        // Determine the main visible face size
        // For walls, we care about the longest horizontal dimension
        const horizontalSize = Math.max(wallWidth, wallDepth);

        // Calculate repeat to maintain consistent texture size
        // textureSize controls how big one tile appears (smaller = more tiles)
        const textureSize = 4;
        const repeatU = horizontalSize / textureSize;
        const repeatV = wallHeight / textureSize;

        // Clone texture for each wall
        const wallTexture = apartmentTexture.clone();
        wallTexture.repeat.set(repeatU, repeatV);
        wallTexture.needsUpdate = true;

        return (
          <RigidBody key={index} type="fixed" colliders="cuboid">
            <mesh
              castShadow
              receiveShadow
              position={[wall[0], wallHeight / 2, wall[1]]}
            >
              <boxGeometry args={[wallWidth, wallHeight, wallDepth]} />
              <meshStandardMaterial
                map={wallTexture}
                color="#ffffff"
                metalness={0}
                roughness={0.8}
              />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}
