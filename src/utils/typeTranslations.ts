/**
 * Translation mapping for Pokémon types from English to French
 */
const TYPE_TRANSLATIONS: Record<string, string> = {
    normal: 'Normal',
    fire: 'Feu',
    water: 'Eau',
    electric: 'Électrik',
    grass: 'Plante',
    ice: 'Glace',
    fighting: 'Combat',
    poison: 'Poison',
    ground: 'Sol',
    flying: 'Vol',
    psychic: 'Psy',
    bug: 'Insecte',
    rock: 'Roche',
    ghost: 'Spectre',
    dragon: 'Dragon',
    dark: 'Ténèbres',
    steel: 'Acier',
    fairy: 'Fée'
};

/**
 * Translates a Pokémon type from English to French
 */
export function translateType(type: string): string {
    return TYPE_TRANSLATIONS[type.toLowerCase()] || type;
}
