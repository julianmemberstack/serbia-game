// Game Configuration Constants

// Serbian Theme Colors
export const SERBIAN_COLORS = {
  RED: '#C6363C',
  BLUE: '#0C4076',
  WHITE: '#FFFFFF',
} as const;

// Player Configuration
export const PLAYER_CONFIG = {
  WALK_SPEED: 5,
  SPRINT_SPEED: 8,
  STAMINA_MAX: 100,
  STAMINA_DRAIN_RATE: 20, // per second
  STAMINA_REGEN_RATE: 10, // per second
  HEIGHT: 1.8,
  RADIUS: 0.5,
  CAMERA_HEIGHT: 1.6,
  MOUSE_SENSITIVITY: 0.002,
} as const;

// Nextbot Configuration
export const NEXTBOT_CONFIG = {
  SPEED: 4.5, // Slower - just slightly slower than walk speed
  SPAWN_COUNT: 5,
  SPAWN_DELAY: 3, // seconds before they start chasing
  KILL_DISTANCE: 2.0, // Increased for more reliable collision detection
  SIZE: 2, // Billboard size
  HEIGHT_OFFSET: 1, // Float above ground
} as const;

// Map Configuration
export const MAP_CONFIG = {
  SIZE: 60, // Increased from 50 for larger, more open map
  WALL_HEIGHT: 4,
  WALL_THICKNESS: 1,
  GROUND_SIZE: 70, // Increased from 60 to match larger map
} as const;

// Game Configuration
export const GAME_CONFIG = {
  ROUND_DURATION: 60, // seconds to survive
  GRAVITY: -9.81,
} as const;

// Nextbot Types
export type NextbotType = 'police' | 'optuznica' | 'speed-camera';

export const NEXTBOT_TEXTURES: Record<NextbotType, string> = {
  police: '/policijska-vozila.png',
  optuznica: '/optuznica.webp',
  'speed-camera': '/speed-camera.png',
} as const;

// Death Titles by Nextbot Type
export const DEATH_TITLES: Record<NextbotType, string> = {
  police: 'POLICE ENCOUNTER!',
  optuznica: 'LEGAL TROUBLES!',
  'speed-camera': 'CAUGHT BY A SPEED CAMERA!',
} as const;

// Death Messages by Nextbot Type
export const DEATH_MESSAGES: Record<NextbotType, string[]> = {
  optuznica: [
    "YOU'VE BEEN CHARGED WITH A CRIME YOU DIDN'T COMMIT!",
    "YOU FORGOT TO OPEN A LETTER!",
    "YOU BROKE A LAW THAT DOESN'T EXIST!",
  ],
  police: [
    "PAY $500 BRIBE!",
    "YOU GOT BEAT AT A PROTEST!",
    "YOU DIED OF BOREDOM AT MUP!",
  ],
  'speed-camera': [
    "YOU DROVE 1KM OVER THE LIMIT!",
    "FINE: 5,000 RSD!",
    "FINE: 10,000 RSD!",
    "FINE: 15,000 RSD!",
    "FINE: 25,000 RSD!",
  ],
} as const;

// Game States
export type GameState = 'menu' | 'playing' | 'dead' | 'won';
