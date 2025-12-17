
import { Pokemon } from '@/utils/types';
import { getSpriteUrl } from '@/utils/pokemon';
import { getDisplayName } from '@/hooks/useGameState';
import { translateType } from '@/utils/typeTranslations';
import { soundManager } from '@/utils/sounds';

interface TeamModalProps {
  capturedPokemon: Pokemon[];
  onClose: () => void;
  onRelease: (index: number) => void;
  onToggleFavorite: (pokemonId: number) => void;
}

export default function TeamModal({
  capturedPokemon,
  onClose,
  onRelease,
  onToggleFavorite
}: TeamModalProps) {
  return (
    <div className="modal visible" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Mon Équipe ({capturedPokemon.length}/6)</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="team-grid">
          {capturedPokemon.length === 0 ? (
            <p className="empty-team">Aucun Pokémon capturé</p>
          ) : (
            capturedPokemon.map((pokemon, index) => (
              <div key={index} className={`team-pokemon-card ${pokemon.isShiny ? 'shiny' : ''}`}>
                <img src={getSpriteUrl(pokemon)} alt={getDisplayName(pokemon)} />
                <h4>{getDisplayName(pokemon)}</h4>
                <p>#{pokemon.id.toString().padStart(3, '0')}</p>
                <div className="team-pokemon-types">
                  {pokemon.types.map(t => (
                    <span key={t} className={`type-badge type-${t}`}>{translateType(t)}</span>
                  ))}
                </div>
                <div className="team-pokemon-actions">
                  <button
                    className={`favorite-btn ${pokemon.isFavorite ? 'active' : ''}`}
                    onClick={() => { soundManager.playClickSound(); onToggleFavorite(pokemon.id); }}
                  >
                    {pokemon.isFavorite ? '⭐' : '☆'}
                  </button>
                  <button
                    className="release-btn"
                    onClick={() => { soundManager.playClickSound(); onRelease(index); }}
                  >
                    Relâcher
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
