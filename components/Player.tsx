'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useGameStore } from '@/lib/store';
import { PLAYER_CONFIG } from '@/lib/constants';

export function Player() {
  const playerRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();

  const stamina = useGameStore((state) => state.stamina);
  const setStamina = useGameStore((state) => state.setStamina);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);

  // Touch controls
  const touchMovement = useGameStore((state) => state.touchMovement);
  const touchSprint = useGameStore((state) => state.touchSprint);
  const touchCamera = useGameStore((state) => state.touchCamera);
  const setTouchCamera = useGameStore((state) => state.setTouchCamera);

  const direction = useRef(new Vector3());
  const frontVector = useRef(new Vector3());
  const sideVector = useRef(new Vector3());
  const rotation = useRef({ x: 0, y: 0 });
  const velocity = useRef(new Vector3());

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, PLAYER_CONFIG.CAMERA_HEIGHT, 0);
    camera.rotation.order = 'YXZ';
  }, [camera]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const keys = getKeys();

    // Combine keyboard and touch inputs
    const forward = keys.forward || touchMovement.y < -0.3;
    const backward = keys.backward || touchMovement.y > 0.3;
    const left = keys.left || touchMovement.x < -0.3;
    const right = keys.right || touchMovement.x > 0.3;
    const sprint = keys.sprint || touchSprint;

    // Get player position
    const position = playerRef.current.translation();

    // Update player position in store for nextbots
    setPlayerPosition(new Vector3(position.x, position.y, position.z));

    // Update camera position to follow player
    camera.position.set(
      position.x,
      position.y + PLAYER_CONFIG.CAMERA_HEIGHT,
      position.z
    );

    // Handle touch camera movement with higher sensitivity
    if (touchCamera.x !== 0 || touchCamera.y !== 0) {
      const touchSensitivity = PLAYER_CONFIG.MOUSE_SENSITIVITY * 2.5; // 2.5x more sensitive for touch
      rotation.current.y -= touchCamera.x * touchSensitivity;
      rotation.current.x -= touchCamera.y * touchSensitivity;

      // Clamp vertical rotation
      rotation.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.x)
      );

      camera.rotation.set(rotation.current.x, rotation.current.y, 0);

      // Reset touch camera delta
      setTouchCamera({ x: 0, y: 0 });
    }

    // Calculate movement direction
    // For touch controls, use normalized joystick values
    const touchForward = -touchMovement.y;
    const touchSide = -touchMovement.x;

    frontVector.current.set(
      0,
      0,
      touchMovement.x !== 0 || touchMovement.y !== 0
        ? touchForward
        : Number(backward) - Number(forward)
    );
    sideVector.current.set(
      touchMovement.x !== 0 || touchMovement.y !== 0
        ? touchSide
        : Number(left) - Number(right),
      0,
      0
    );

    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(
        sprint && stamina > 0
          ? PLAYER_CONFIG.SPRINT_SPEED
          : PLAYER_CONFIG.WALK_SPEED
      )
      .applyEuler(camera.rotation);

    // Check if player is moving
    const isMoving = forward || backward || left || right ||
                     Math.abs(touchMovement.x) > 0.1 || Math.abs(touchMovement.y) > 0.1;

    // Handle stamina
    if (sprint && isMoving && stamina > 0) {
      setStamina(Math.max(0, stamina - PLAYER_CONFIG.STAMINA_DRAIN_RATE * delta));
    } else if (stamina < PLAYER_CONFIG.STAMINA_MAX) {
      setStamina(Math.min(PLAYER_CONFIG.STAMINA_MAX, stamina + PLAYER_CONFIG.STAMINA_REGEN_RATE * delta));
    }

    // Apply movement
    velocity.current.set(direction.current.x, 0, direction.current.z);
    playerRef.current.setLinvel(
      { x: velocity.current.x, y: playerRef.current.linvel().y, z: velocity.current.z },
      true
    );
  });

  // Handle mouse movement for looking around
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        rotation.current.y -= e.movementX * PLAYER_CONFIG.MOUSE_SENSITIVITY;
        rotation.current.x -= e.movementY * PLAYER_CONFIG.MOUSE_SENSITIVITY;

        // Clamp vertical rotation
        rotation.current.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, rotation.current.x)
        );

        camera.rotation.set(rotation.current.x, rotation.current.y, 0);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);

  return (
    <>
      {/* Pointer Lock Controls */}
      <PointerLockControls />

      {/* Player Physics Body */}
      <RigidBody
        ref={playerRef}
        colliders="ball"
        mass={1}
        type="dynamic"
        position={[0, 2, 0]}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
      >
        <mesh castShadow>
          <sphereGeometry args={[PLAYER_CONFIG.RADIUS]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </RigidBody>
    </>
  );
}
