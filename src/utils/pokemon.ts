// Pokemon API Service - Fetches one Pokemon at a time from PokeAPI

import { Pokemon, PokemonAPIResponse, PokemonSpeciesResponse, PokemonType } from './types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEAPI_SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species';
const GEN1_MAX_ID = 151;
const SHINY_CHANCE = 512; // 1/512 chance

/**
 * Generates a random Pokemon ID between 1 and 151 (Gen 1)
 */
function getRandomPokemonId(): number {
  return Math.floor(Math.random() * GEN1_MAX_ID) + 1;
}

/**
 * Determines if a Pokemon is shiny (1/512 chance)
 */
function isShiny(): boolean {
  return Math.floor(Math.random() * SHINY_CHANCE) === 0;
}

/**
 * Fetches the French name for a Pokemon
 */
async function fetchFrenchName(id: number): Promise<string> {
  try {
    const response = await fetch(`${POKEAPI_SPECIES_URL}/${id}`);
    if (!response.ok) return '';

    const data: PokemonSpeciesResponse = await response.json();
    const frenchName = data.names.find(n => n.language.name === 'fr');
    return frenchName?.name || '';
  } catch {
    return '';
  }
}

/**
 * Fetches a single Pokemon from the PokeAPI
 */
export async function fetchPokemon(id: number): Promise<Pokemon | null> {
  try {
    const [pokemonResponse, frenchName] = await Promise.all([
      fetch(`${POKEAPI_BASE_URL}/${id}`),
      fetchFrenchName(id)
    ]);

    if (!pokemonResponse.ok) {
      throw new Error(`Failed to fetch Pokemon: ${pokemonResponse.status}`);
    }

    const data: PokemonAPIResponse = await pokemonResponse.json();
    const shiny = isShiny();

    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      nameFr: frenchName || data.name,
      sprite: data.sprites.front_default,
      spriteShiny: data.sprites.front_shiny,
      types: data.types.map(t => t.type.name as PokemonType),
      isShiny: shiny,
      isFavorite: false,
      cry: data.cries?.latest || data.cries?.legacy
    };

    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return null;
  }
}

/**
 * Fetches a random Gen 1 Pokemon
 */
export async function fetchRandomPokemon(): Promise<Pokemon | null> {
  const randomId = getRandomPokemonId();
  return fetchPokemon(randomId);
}

/**
 * Gets the sprite URL based on shiny status
 */
export function getSpriteUrl(pokemon: Pokemon): string {
  return pokemon.isShiny ? pokemon.spriteShiny : pokemon.sprite;
}
