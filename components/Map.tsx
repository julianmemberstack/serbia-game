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

  // Load textures
  const apartmentTexture = useTexture('/apartmani.jpg');
  const concreteTexture = useTexture('/concrete.jpg');

  // Configure texture wrapping - simple tiling
  useMemo(() => {
    if (apartmentTexture) {
      apartmentTexture.wrapS = THREE.RepeatWrapping;
      apartmentTexture.wrapT = THREE.RepeatWrapping;
      apartmentTexture.needsUpdate = true;
    }
    if (concreteTexture) {
      concreteTexture.wrapS = THREE.RepeatWrapping;
      concreteTexture.wrapT = THREE.RepeatWrapping;
      // Tile the concrete texture across the ground
      const tileSize = 5; // Size of one concrete tile
      const repeat = MAP_CONFIG.GROUND_SIZE / tileSize;
      concreteTexture.repeat.set(repeat, repeat);
      concreteTexture.needsUpdate = true;
    }
    return apartmentTexture;
  }, [apartmentTexture, concreteTexture]);

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
      {/* Ground with concrete texture */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[MAP_CONFIG.GROUND_SIZE, 1, MAP_CONFIG.GROUND_SIZE]} />
          <meshStandardMaterial
            map={concreteTexture}
            metalness={0}
            roughness={0.9}
          />
        </mesh>
      </RigidBody>

      {/* Maze Walls with apartment texture */}
      {walls.map((wall, index) => {
        const wallWidth = wall[2];  // X dimension
        const wallDepth = wall[3];  // Z dimension

        // Calculate repeat to maintain consistent texture size
        // textureSize controls how big one tile appears (smaller = more tiles)
        const textureSize = 4;

        // Create materials for each face of the box to prevent stretching
        // Order: [right, left, top, bottom, front, back]
        const materials = [
          // Right face (X+) - depth x height
          (() => {
            const tex = apartmentTexture.clone();
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(wallDepth / textureSize, wallHeight / textureSize);
            tex.needsUpdate = true;
            return new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.8 });
          })(),
          // Left face (X-) - depth x height
          (() => {
            const tex = apartmentTexture.clone();
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(wallDepth / textureSize, wallHeight / textureSize);
            tex.needsUpdate = true;
            return new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.8 });
          })(),
          // Top face (Y+) - width x depth
          (() => {
            const tex = apartmentTexture.clone();
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(wallWidth / textureSize, wallDepth / textureSize);
            tex.needsUpdate = true;
            return new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.8 });
          })(),
          // Bottom face (Y-) - width x depth
          (() => {
            const tex = apartmentTexture.clone();
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(wallWidth / textureSize, wallDepth / textureSize);
            tex.needsUpdate = true;
            return new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.8 });
          })(),
          // Front face (Z+) - width x height
          (() => {
            const tex = apartmentTexture.clone();
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(wallWidth / textureSize, wallHeight / textureSize);
            tex.needsUpdate = true;
            return new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.8 });
          })(),
          // Back face (Z-) - width x height
          (() => {
            const tex = apartmentTexture.clone();
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(wallWidth / textureSize, wallHeight / textureSize);
            tex.needsUpdate = true;
            return new THREE.MeshStandardMaterial({ map: tex, metalness: 0, roughness: 0.8 });
          })(),
        ];

        return (
          <RigidBody key={index} type="fixed" colliders="cuboid">
            <mesh
              castShadow
              receiveShadow
              position={[wall[0], wallHeight / 2, wall[1]]}
              material={materials}
            >
              <boxGeometry args={[wallWidth, wallHeight, wallDepth]} />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}
