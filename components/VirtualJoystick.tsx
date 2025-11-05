'use client';

import { useEffect, useRef, useState } from 'react';
import { SERBIAN_COLORS } from '@/lib/constants';

interface JoystickState {
  x: number; // -1 to 1
  y: number; // -1 to 1
  active: boolean;
}

interface VirtualJoystickProps {
  onMove: (state: JoystickState) => void;
}

export function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const [joystickState, setJoystickState] = useState<JoystickState>({
    x: 0,
    y: 0,
    active: false,
  });
  const baseRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const baseCenterRef = useRef({ x: 0, y: 0 });

  const maxDistance = 50; // Maximum distance the stick can move from center

  useEffect(() => {
    onMove(joystickState);
  }, [joystickState, onMove]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return; // Already tracking a touch

    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      baseCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    setJoystickState({ x: 0, y: 0, active: true });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;

    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    const dx = touch.clientX - baseCenterRef.current.x;
    const dy = touch.clientY - baseCenterRef.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDistance = Math.min(distance, maxDistance);
    const stickX = Math.cos(angle) * clampedDistance;
    const stickY = Math.sin(angle) * clampedDistance;

    // Update stick position visually
    if (stickRef.current) {
      stickRef.current.style.transform = `translate(${stickX}px, ${stickY}px)`;
    }

    // Normalize to -1 to 1 range
    setJoystickState({
      x: stickX / maxDistance,
      y: stickY / maxDistance,
      active: true,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touches = Array.from(e.changedTouches);
    if (!touches.some(t => t.identifier === touchIdRef.current)) return;

    touchIdRef.current = null;

    // Reset stick position
    if (stickRef.current) {
      stickRef.current.style.transform = 'translate(0px, 0px)';
    }

    setJoystickState({ x: 0, y: 0, active: false });
  };

  return (
    <div
      ref={baseRef}
      className="relative"
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: `3px solid ${SERBIAN_COLORS.WHITE}`,
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={stickRef}
        className="absolute"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: joystickState.active ? SERBIAN_COLORS.RED : SERBIAN_COLORS.BLUE,
          top: 'calc(50% - 25px)',
          left: 'calc(50% - 25px)',
          transition: joystickState.active ? 'none' : 'all 0.2s',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
