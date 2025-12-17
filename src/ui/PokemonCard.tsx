
import { Pokemon } from '@/utils/types';
import { getSpriteUrl } from '@/utils/pokemon';
import { getDisplayName } from '@/hooks/useGameState';
import { translateType } from '@/utils/typeTranslations';
import { useState, useEffect } from 'react';

interface PokemonCardProps {
  pokemon: Pokemon | null;
  animationState: 'idle' | 'throwing' | 'capturing' | 'fleeing' | 'rejected-left' | 'rejected-right';
}

export default function PokemonCard({ pokemon, animationState }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [pokemon?.id]);

  if (!pokemon || !imageLoaded) {
    return (
      <article className="pokemon-card-placeholder">
        {pokemon && (
          <img
            className="pokemon-sprite-preload"
            src={getSpriteUrl(pokemon)}
            alt=""
            onLoad={() => setImageLoaded(true)}
            style={{ display: 'none' }}
          />
        )}
      </article>
    );
  }

  return (
    <article
      className={`pokemon-card ${imageLoaded ? 'visible' : ''} ${pokemon.isShiny ? 'shiny' : ''} ${animationState === 'capturing' ? 'captured' : ''} ${animationState === 'fleeing' ? 'fleeing' : ''}`}
      data-type={pokemon.types[0]}
    >
      <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
      {pokemon.isShiny && <span className="shiny-badge visible">SHINY</span>}

      <div className="pokemon-sprite-container">
        <img
          className={`pokemon-sprite ${animationState === 'capturing' ? 'flash-white' : ''} loaded`}
          src={getSpriteUrl(pokemon)}
          alt={getDisplayName(pokemon)}
        />
      </div>

      <h2 className="pokemon-name">{getDisplayName(pokemon)}</h2>

      <div className="pokemon-types">
        {pokemon.types.map(type => (
          <span key={type} className={`type-badge type-${type}`}>{translateType(type)}</span>
        ))}
      </div>

      {animationState === 'capturing' && (
        <div className="capture-sparkles">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="star" />
          ))}
        </div>
      )}
    </article>
  );
}
