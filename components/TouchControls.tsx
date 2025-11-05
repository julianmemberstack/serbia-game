'use client';

import { useEffect, useState } from 'react';
import { VirtualJoystick } from './VirtualJoystick';
import { useGameStore } from '@/lib/store';
import { SERBIAN_COLORS } from '@/lib/constants';

export function TouchControls() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const gameState = useGameStore((state) => state.gameState);
  const setTouchMovement = useGameStore((state) => state.setTouchMovement);
  const setTouchSprint = useGameStore((state) => state.setTouchSprint);
  const setTouchCamera = useGameStore((state) => state.setTouchCamera);

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
      {/* Camera control overlay - covers most of screen except controls */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          touchAction: 'none',
          zIndex: 1,
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const movementX = touch.clientX - (e.target as any).lastX || 0;
            const movementY = touch.clientY - (e.target as any).lastY || 0;

            (e.target as any).lastX = touch.clientX;
            (e.target as any).lastY = touch.clientY;

            setTouchCamera({ x: movementX, y: movementY });
          }
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            (e.target as any).lastX = e.touches[0].clientX;
            (e.target as any).lastY = e.touches[0].clientY;
          }
        }}
        onTouchEnd={(e) => {
          delete (e.target as any).lastX;
          delete (e.target as any).lastY;
        }}
      />

      {/* Left side - Virtual Joystick */}
      <div className="absolute bottom-8 left-8 pointer-events-auto" style={{ zIndex: 10 }}>
        <VirtualJoystick
          onMove={(state) => {
            setTouchMovement({ x: state.x, y: state.y });
          }}
        />
      </div>

      {/* Right side - Sprint Button */}
      <div className="absolute bottom-8 right-8 pointer-events-auto" style={{ zIndex: 10 }}>
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
