import { create } from 'zustand';
import { GameState, PLAYER_CONFIG, GAME_CONFIG, DEATH_MESSAGES, NextbotType } from './constants';
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

  // Touch controls
  touchMovement: { x: number; y: number };
  setTouchMovement: (movement: { x: number; y: number }) => void;
  touchSprint: boolean;
  setTouchSprint: (sprint: boolean) => void;
  touchCamera: { x: number; y: number };
  setTouchCamera: (camera: { x: number; y: number }) => void;

  // Actions
  startGame: () => void;
  endGame: (won: boolean, killerType?: NextbotType) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  gameState: 'menu',
  stamina: PLAYER_CONFIG.STAMINA_MAX,
  playerPosition: new Vector3(0, 0, 0),
  timeRemaining: GAME_CONFIG.ROUND_DURATION,
  deathMessage: '',
  touchMovement: { x: 0, y: 0 },
  touchSprint: false,
  touchCamera: { x: 0, y: 0 },

  // Setters
  setGameState: (gameState) => set({ gameState }),
  setStamina: (stamina) => set({ stamina }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
  setDeathMessage: (deathMessage) => set({ deathMessage }),
  setTouchMovement: (touchMovement) => set({ touchMovement }),
  setTouchSprint: (touchSprint) => set({ touchSprint }),
  setTouchCamera: (touchCamera) => set({ touchCamera }),

  // Actions
  startGame: () => set({
    gameState: 'playing',
    stamina: PLAYER_CONFIG.STAMINA_MAX,
    timeRemaining: GAME_CONFIG.ROUND_DURATION,
  }),

  endGame: (won, killerType) => {
    // Select random death message based on killer type if player lost
    let randomMessage = '';
    if (!won && killerType) {
      const messages = DEATH_MESSAGES[killerType];
      randomMessage = messages[Math.floor(Math.random() * messages.length)];
    }

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
