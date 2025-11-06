'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { SERBIAN_COLORS, PLAYER_CONFIG, GAME_CONFIG, DEATH_TITLES } from '@/lib/constants';

export function GameHUD() {
  const gameState = useGameStore((state) => state.gameState);
  const stamina = useGameStore((state) => state.stamina);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const deathMessage = useGameStore((state) => state.deathMessage);
  const killerType = useGameStore((state) => state.killerType);
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);

  const staminaPercent = (stamina / PLAYER_CONFIG.STAMINA_MAX) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);

  // Calculate time survived (for death screen)
  const timeSurvived = GAME_CONFIG.ROUND_DURATION - timeRemaining;
  const survivedMinutes = Math.floor(timeSurvived / 60);
  const survivedSeconds = Math.floor(timeSurvived % 60);

  // Handle Enter key to start/restart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (gameState === 'menu') {
          startGame();
        } else if (gameState === 'dead' || gameState === 'won') {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, startGame, resetGame]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ userSelect: 'none' }}>
      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4"
          style={{ backgroundColor: 'rgba(12, 64, 118, 0.95)', userSelect: 'none' }}>
          <div className="text-center space-y-4 md:space-y-8 max-w-4xl">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
              LAW ABIDING SERBIAN CITIZEN SIMULATOR
            </h1>
            <div className="text-sm md:text-xl text-white space-y-1 md:space-y-2 mb-4 md:mb-8">
              <p>WASD / Virtual Joystick - Move</p>
              <p>SPACE / Button - Sprint</p>
              <p>MOUSE / Touch Drag - Look Around</p>
              <p className="mt-2 md:mt-4">Survive for 60 seconds!</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 md:px-12 py-3 md:py-4 text-xl md:text-2xl font-bold text-white rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: SERBIAN_COLORS.RED }}
            >
              START GAME
            </button>
            <p className="text-xs md:text-sm text-white/70 mt-2 md:mt-4">Press ENTER or tap to start</p>
          </div>
        </div>
      )}

      {/* Playing HUD */}
      {gameState === 'playing' && (
        <>
          {/* Timer */}
          <div className="absolute top-4 md:top-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-white" style={{
                textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
              }}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-xl text-white/80 mt-1 md:mt-2">Time Remaining</div>
            </div>
          </div>

          {/* Temperature Display */}
          <div className="absolute top-8 right-8 pointer-events-none">
            <div className="text-center bg-black/30 px-3 py-2 rounded-lg border"
              style={{ borderColor: SERBIAN_COLORS.RED }}>
              <div className="text-2xl font-bold text-white" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}>
                42°C
              </div>
              <div className="text-xs text-white/80">Belgrade</div>
            </div>
          </div>

          {/* Stamina Bar - repositioned higher for mobile */}
          <div className="absolute top-24 md:top-36 left-1/2 transform -translate-x-1/2 pointer-events-none w-full px-4 md:px-0 md:w-auto">
            <div className="w-full md:w-96 max-w-sm mx-auto">
              <div className="text-white text-xs md:text-sm mb-1 text-center">
                STAMINA {stamina < 10 && '- EXHAUSTED!'}
              </div>
              <div className="h-4 md:h-6 bg-black/50 rounded-full overflow-hidden border-2"
                style={{ borderColor: SERBIAN_COLORS.WHITE }}>
                <div
                  className="h-full transition-all duration-100"
                  style={{
                    width: `${staminaPercent}%`,
                    backgroundColor: stamina > 30 ? SERBIAN_COLORS.BLUE : SERBIAN_COLORS.RED,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sprint Indicator */}
          {stamina < PLAYER_CONFIG.STAMINA_MAX && stamina > 0 && (
            <div className="absolute top-40 md:top-52 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <div className="text-white/60 text-xs md:text-sm">
                {stamina < 20 ? '⚠️ Low Stamina' : 'Sprinting...'}
              </div>
            </div>
          )}
        </>
      )}

      {/* Death Screen */}
      {gameState === 'dead' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4"
          style={{ backgroundColor: 'rgba(198, 54, 60, 0.95)' }}>
          <div className="text-center space-y-4 md:space-y-8 max-w-4xl">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4">
              {killerType ? DEATH_TITLES[killerType] : 'YOU DIED'}
            </h1>
            <p className="text-xl md:text-4xl text-white/90 font-bold max-w-4xl mx-auto">
              {deathMessage}
            </p>
            <div className="text-lg md:text-xl text-white/70">
              Survived: {survivedMinutes}:{survivedSeconds.toString().padStart(2, '0')}
            </div>
            <button
              onClick={resetGame}
              className="px-8 md:px-12 py-3 md:py-4 text-xl md:text-2xl font-bold rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: SERBIAN_COLORS.BLUE, color: 'white' }}
            >
              TRY AGAIN
            </button>
            <p className="text-xs md:text-sm text-white/60 mt-2">Press ENTER to restart</p>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState === 'won' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4"
          style={{ backgroundColor: 'rgba(12, 64, 118, 0.95)' }}>
          <div className="text-center space-y-4 md:space-y-8 max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-2 md:mb-4">
              ПРЕЖИВЕО СИ!
            </h1>
            <p className="text-2xl md:text-3xl text-white/90">YOU SURVIVED!</p>
            <div className="flex gap-3 md:gap-4 justify-center text-4xl md:text-6xl mb-2 md:mb-4">
              <span style={{ color: SERBIAN_COLORS.RED }}>█</span>
              <span style={{ color: SERBIAN_COLORS.BLUE }}>█</span>
              <span style={{ color: SERBIAN_COLORS.WHITE }}>█</span>
            </div>
            <p className="text-lg md:text-2xl text-white/80">
              You escaped the Serbian Nextbots!
            </p>
            <button
              onClick={resetGame}
              className="px-8 md:px-12 py-3 md:py-4 text-xl md:text-2xl font-bold text-white rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: SERBIAN_COLORS.RED }}
            >
              PLAY AGAIN
            </button>
            <p className="text-xs md:text-sm text-white/60 mt-2">Press ENTER to restart</p>
          </div>
        </div>
      )}
    </div>
  );
}
