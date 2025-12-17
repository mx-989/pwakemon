// Storage Service - Handles localStorage persistence

import { Pokemon } from './types';

const STORAGE_KEYS = {
  CAPTURED_POKEMON: 'pokecatch_captured',
  POKEDEX: 'pokecatch_pokedex',
  ENCOUNTERED: 'pokecatch_encountered',
  FAVORITES: 'pokecatch_favorites',
  STATS: 'pokecatch_stats',
  DARK_MODE: 'pokecatch_darkmode'
};

const MAX_CAPTURED = 6;

/**
 * Gets captured Pokemon from localStorage
 */
export function getCapturedPokemon(): Pokemon[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CAPTURED_POKEMON);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Saves captured Pokemon to localStorage
 */
export function saveCapturedPokemon(pokemon: Pokemon[]): void {
  localStorage.setItem(STORAGE_KEYS.CAPTURED_POKEMON, JSON.stringify(pokemon));
}

/**
 * Adds a Pokemon to the captured list
 * Returns true if successful, false if team is full
 */
export function addCapturedPokemon(pokemon: Pokemon): boolean {
  const captured = getCapturedPokemon();

  if (captured.length >= MAX_CAPTURED) {
    return false;
  }

  pokemon.capturedAt = Date.now();
  captured.push(pokemon);
  saveCapturedPokemon(captured);

  // Also add to Pokedex
  addToPokedex(pokemon.id);

  // Update stats
  incrementCaptures();

  return true;
}

/**
 * Removes a Pokemon from the captured list by index
 */
export function releasePokemon(index: number): void {
  const captured = getCapturedPokemon();
  captured.splice(index, 1);
  saveCapturedPokemon(captured);
}

/**
 * Checks if team is full
 */
export function isTeamFull(): boolean {
  return getCapturedPokemon().length >= MAX_CAPTURED;
}

// Pokedex functions

/**
 * Gets the Pokedex (list of all Pokemon IDs ever captured)
 */
export function getPokedex(): number[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.POKEDEX);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Adds a Pokemon ID to the Pokedex
 */
export function addToPokedex(pokemonId: number): void {
  const pokedex = getPokedex();
  if (!pokedex.includes(pokemonId)) {
    pokedex.push(pokemonId);
    pokedex.sort((a, b) => a - b);
    localStorage.setItem(STORAGE_KEYS.POKEDEX, JSON.stringify(pokedex));
  }
}

/**
 * Gets the list of encountered Pokemon IDs
 */
export function getEncountered(): number[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENCOUNTERED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Adds a Pokemon ID to the encountered list
 */
export function addEncountered(pokemonId: number): void {
  const encountered = getEncountered();
  if (!encountered.includes(pokemonId)) {
    encountered.push(pokemonId);
    encountered.sort((a, b) => a - b);
    localStorage.setItem(STORAGE_KEYS.ENCOUNTERED, JSON.stringify(encountered));
  }
}

// Favorites functions

/**
 * Gets the list of favorite Pokemon IDs
 */
export function getFavorites(): number[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Toggles a Pokemon's favorite status
 */
export function toggleFavorite(pokemonId: number): void {
  const favorites = getFavorites();
  const index = favorites.indexOf(pokemonId);

  if (index === -1) {
    favorites.push(pokemonId);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

/**
 * Checks if a Pokemon is favorited
 */
export function isFavorite(pokemonId: number): boolean {
  return getFavorites().includes(pokemonId);
}

// Stats functions

interface Stats {
  totalEncounters: number;
  totalCaptures: number;
}

/**
 * Gets game stats
 */
export function getStats(): Stats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : { totalEncounters: 0, totalCaptures: 0 };
  } catch {
    return { totalEncounters: 0, totalCaptures: 0 };
  }
}

/**
 * Saves game stats
 */
function saveStats(stats: Stats): void {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

/**
 * Increments encounter counter
 */
export function incrementEncounters(): void {
  const stats = getStats();
  stats.totalEncounters++;
  saveStats(stats);
}

/**
 * Increments capture counter
 */
export function incrementCaptures(): void {
  const stats = getStats();
  stats.totalCaptures++;
  saveStats(stats);
}

// Dark mode functions

/**
 * Gets dark mode preference
 */
export function getDarkMode(): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  if (data === null) {
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return data === 'true';
}

/**
 * Saves dark mode preference
 */
export function setDarkMode(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(enabled));
}

