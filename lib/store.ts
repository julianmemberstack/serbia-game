import { create } from 'zustand';
import { GameState, PLAYER_CONFIG, GAME_CONFIG } from './constants';
import { Vector3 } from 'three';

interface GameStore {
  // Game state
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Player state
  stamina: number;
  setStamina: (stamina: number) => void;
  playerPosition: Vector3;
  setPlayerPosition: (position: Vector3) => void;

  // Timer
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;

  // Actions
  startGame: () => void;
  endGame: (won: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  gameState: 'menu',
  stamina: PLAYER_CONFIG.STAMINA_MAX,
  playerPosition: new Vector3(0, 0, 0),
  timeRemaining: GAME_CONFIG.ROUND_DURATION,

  // Setters
  setGameState: (gameState) => set({ gameState }),
  setStamina: (stamina) => set({ stamina }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setTimeRemaining: (timeRemaining) => set({ timeRemaining }),

  // Actions
  startGame: () => set({
    gameState: 'playing',
    stamina: PLAYER_CONFIG.STAMINA_MAX,
    timeRemaining: GAME_CONFIG.ROUND_DURATION,
  }),

  endGame: (won) => set({
    gameState: won ? 'won' : 'dead',
  }),

  resetGame: () => set({
    gameState: 'menu',
    stamina: PLAYER_CONFIG.STAMINA_MAX,
    timeRemaining: GAME_CONFIG.ROUND_DURATION,
  }),
}));
