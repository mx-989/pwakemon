// Pokemon types and interfaces

export interface Pokemon {
  id: number;
  name: string;
  nameFr: string;
  sprite: string;
  spriteShiny: string;
  types: PokemonType[];
  isShiny: boolean;
  capturedAt?: number;
  isFavorite?: boolean;
  cry?: string;
}

export interface PokemonAPIResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  cries?: {
    latest?: string;
    legacy?: string;
  };
}

export interface PokemonSpeciesResponse {
  names: {
    language: {
      name: string;
    };
    name: string;
  }[];
}

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';
