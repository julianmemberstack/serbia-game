'use client';

import { RigidBody } from '@react-three/rapier';
import { SERBIAN_COLORS, MAP_CONFIG } from '@/lib/constants';

export function Map() {
  const wallHeight = MAP_CONFIG.WALL_HEIGHT;
  const wallThickness = MAP_CONFIG.WALL_THICKNESS;
  const mazeSize = MAP_CONFIG.SIZE;

  // Simple maze layout - walls defined as [x, z, width, depth]
  const walls = [
    // Outer boundary
    [0, -mazeSize / 2, mazeSize, wallThickness], // North wall
    [0, mazeSize / 2, mazeSize, wallThickness],  // South wall
    [-mazeSize / 2, 0, wallThickness, mazeSize], // West wall
    [mazeSize / 2, 0, wallThickness, mazeSize],  // East wall

    // Inner maze walls (creating paths)
    [15, 0, wallThickness, 20],
    [-15, 0, wallThickness, 20],
    [0, 15, 20, wallThickness],
    [0, -15, 20, wallThickness],
    [10, 10, 15, wallThickness],
    [-10, -10, 15, wallThickness],
    [10, -10, wallThickness, 15],
    [-10, 10, wallThickness, 15],
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

      {/* Maze Walls */}
      {walls.map((wall, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            position={[wall[0], wallHeight / 2, wall[1]]}
          >
            <boxGeometry args={[wall[2], wallHeight, wall[3]]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? SERBIAN_COLORS.RED : SERBIAN_COLORS.BLUE}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
