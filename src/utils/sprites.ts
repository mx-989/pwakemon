// Sprite URLs for UI elements - using local assets

// All icons use local assets that user will provide
export const SPRITES = {
  // Pokeballs
  POKEBALL: './assets/pokeball.png',
  POKEBALL_EMPTY: './assets/pokeball-empty.png',
  MASTER_BALL: './assets/master-ball.png',

  // Stars for favorites
  STAR_FULL: '/assets/star-full.png',
  STAR_EMPTY: '/assets/star-empty.png',

  // Shiny indicator
  SHINY: '/assets/shiny.png',
  SPARKLE: '/assets/sparkle.png',

  // Header icons
  POKEDEX: '/assets/pokedex.png',
  TEAM: '/assets/team.png',
  SOUND_ON: '/assets/sound-on.png',
  SOUND_OFF: '/assets/sound-off.png',
  MOON: '/assets/moon.png',
  SUN: '/assets/sun.png',

  // Actions
  FLEE: './assets/flee.png',
} as const;

// Helper function to create an img element string
export function spriteImg(src: string, alt: string, className: string = ''): string {
  return `<img src="${src}" alt="${alt}" class="sprite-icon ${className}" />`;
}
