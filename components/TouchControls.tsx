'use client';

import { useEffect, useState, useRef } from 'react';
import { VirtualJoystick } from './VirtualJoystick';
import { useGameStore } from '@/lib/store';
import { SERBIAN_COLORS } from '@/lib/constants';

export function TouchControls() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const gameState = useGameStore((state) => state.gameState);
  const setTouchMovement = useGameStore((state) => state.setTouchMovement);
  const setTouchSprint = useGameStore((state) => state.setTouchSprint);
  const setTouchCamera = useGameStore((state) => state.setTouchCamera);

  // Track which touch IDs belong to controls
  const controlTouchIdsRef = useRef<Set<number>>(new Set());
  const cameraLastPosRef = useRef<{ [key: number]: { x: number; y: number } }>({});

  useEffect(() => {
    // Detect if device has touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  // Don't show controls if not a touch device or not playing
  if (!isTouchDevice || gameState !== 'playing') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Camera control overlay - covers most of screen */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          touchAction: 'none',
          zIndex: 1,
        }}
        onTouchMove={(e) => {
          // Handle all touches except those on controls
          Array.from(e.touches).forEach((touch) => {
            if (!controlTouchIdsRef.current.has(touch.identifier)) {
              const lastPos = cameraLastPosRef.current[touch.identifier];
              if (lastPos) {
                const movementX = touch.clientX - lastPos.x;
                const movementY = touch.clientY - lastPos.y;
                setTouchCamera({ x: movementX, y: movementY });
              }
              cameraLastPosRef.current[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY,
              };
            }
          });
        }}
        onTouchStart={(e) => {
          // Track new touches for camera (excluding control touches)
          Array.from(e.touches).forEach((touch) => {
            if (!controlTouchIdsRef.current.has(touch.identifier)) {
              cameraLastPosRef.current[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY,
              };
            }
          });
        }}
        onTouchEnd={(e) => {
          // Clean up ended touches
          Array.from(e.changedTouches).forEach((touch) => {
            delete cameraLastPosRef.current[touch.identifier];
          });
        }}
      />

      {/* Left side - Virtual Joystick */}
      <div
        className="absolute bottom-8 left-8 pointer-events-auto"
        style={{ zIndex: 10 }}
        onTouchStart={(e) => {
          // Mark this touch as belonging to joystick
          Array.from(e.touches).forEach((touch) => {
            controlTouchIdsRef.current.add(touch.identifier);
          });
        }}
        onTouchEnd={(e) => {
          // Remove joystick touch IDs
          Array.from(e.changedTouches).forEach((touch) => {
            controlTouchIdsRef.current.delete(touch.identifier);
          });
        }}
      >
        <VirtualJoystick
          onMove={(state) => {
            setTouchMovement({ x: state.x, y: state.y });
          }}
        />
      </div>

      {/* Right side - Sprint Button */}
      <div
        className="absolute bottom-8 right-8 pointer-events-auto"
        style={{ zIndex: 10 }}
        onTouchStart={(e) => {
          // Mark this touch as belonging to sprint button
          Array.from(e.touches).forEach((touch) => {
            controlTouchIdsRef.current.add(touch.identifier);
          });
        }}
        onTouchEnd={(e) => {
          // Remove sprint button touch IDs
          Array.from(e.changedTouches).forEach((touch) => {
            controlTouchIdsRef.current.delete(touch.identifier);
          });
        }}
      >
        <button
          className="w-24 h-24 rounded-full font-bold text-white text-lg shadow-lg active:scale-95 transition-transform"
          style={{
            backgroundColor: SERBIAN_COLORS.RED,
            border: `3px solid ${SERBIAN_COLORS.WHITE}`,
            touchAction: 'none',
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setTouchSprint(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setTouchSprint(false);
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            setTouchSprint(false);
          }}
        >
          SPRINT
        </button>
      </div>
    </div>
  );
}
