

interface PokedexModalProps {
  pokedex: number[];
  encountered: number[];
  favorites: number[];
  onClose: () => void;
}

export default function PokedexModal({ pokedex, encountered, favorites, onClose }: PokedexModalProps) {
  return (
    <div className="modal visible" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content pokedex-content">
        <div className="modal-header">
          <h2>Pokédex ({pokedex.length}/151)</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="pokedex-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(pokedex.length / 151) * 100}%` }}
            ></div>
          </div>
          <span>{Math.round((pokedex.length / 151) * 100)}% complété</span>
        </div>
        <div className="pokedex-grid">
          {Array.from({ length: 151 }, (_, i) => {
            const id = i + 1;
            const isCaught = pokedex.includes(id);
            const isEncountered = encountered.includes(id);
            const isFavorite = favorites.includes(id);
            return (
              <div key={id} className={`pokedex-entry ${isCaught ? 'caught' : isEncountered ? 'encountered' : 'unknown'} ${isFavorite ? 'favorite' : ''}`}>
                {isCaught ? (
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={`#${id}`}
                  />
                ) : isEncountered ? (
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={`#${id}`}
                  />
                ) : (
                  <span className="unknown-number">{id}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
