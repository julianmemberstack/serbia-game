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

// Death Messages
export const DEATH_MESSAGES = [
  "YOU'VE BEEN CHARGED WITH A CRIME YOU DIDN'T COMMIT!",
  "PAY $500 BRIBE!",
  "YOU'RE MISSING A PAPER!",
  "YOUR PERMIT HAS EXPIRED!",
  "VIOLATION OF ARTICLE 247!",
  "BUILDING WITHOUT A PERMIT!",
  "ILLEGAL CONSTRUCTION DETECTED!",
  "YOU NEED 5 MORE SIGNATURES!",
  "COME BACK WITH THE PROPER FORMS!",
  "THIS DOCUMENT IS FROM THE WRONG OFFICE!",
  "YOU'RE 3 DAYS LATE ON YOUR REGISTRATION!",
  "PARKING VIOLATION - 10,000 DINAR FINE!",
  "YOUR DOCUMENTATION IS INCOMPLETE!",
  "BUREAUCRACY WINS AGAIN!",
] as const;

// Game States
export type GameState = 'menu' | 'playing' | 'dead' | 'won';
