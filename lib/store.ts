import { create } from 'zustand';
import { GameState, PLAYER_CONFIG, GAME_CONFIG, DEATH_MESSAGES } from './constants';
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

  // Death message
  deathMessage: string;
  setDeathMessage: (message: string) => void;

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
  deathMessage: '',

  // Setters
  setGameState: (gameState) => set({ gameState }),
  setStamina: (stamina) => set({ stamina }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
  setDeathMessage: (deathMessage) => set({ deathMessage }),

  // Actions
  startGame: () => set({
    gameState: 'playing',
    stamina: PLAYER_CONFIG.STAMINA_MAX,
    timeRemaining: GAME_CONFIG.ROUND_DURATION,
  }),

  endGame: (won) => {
    // Select random death message if player lost
    const randomMessage = won
      ? ''
      : DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];

    set({
      gameState: won ? 'won' : 'dead',
      deathMessage: randomMessage,
    });
  },

  resetGame: () => set({
    gameState: 'menu',
    stamina: PLAYER_CONFIG.STAMINA_MAX,
    timeRemaining: GAME_CONFIG.ROUND_DURATION,
    deathMessage: '',
  }),
}));
