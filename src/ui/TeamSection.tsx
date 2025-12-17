
import { Pokemon } from '@/utils/types';
import { getSpriteUrl } from '@/utils/pokemon';
import { getDisplayName } from '@/hooks/useGameState';
import { soundManager } from '@/utils/sounds';
import { SPRITES, spriteImg } from '@/utils/sprites';

interface TeamSectionProps {
  capturedPokemon: Pokemon[];
  onManageTeam: () => void;
}

export default function TeamSection({ capturedPokemon, onManageTeam }: TeamSectionProps) {
  return (
    <section className="team-section">
      <div className="team-header">
        <h3>Mon Équipe</h3>
        <button onClick={() => { soundManager.playClickSound(); onManageTeam(); }}>
          Gérer
        </button>
      </div>
      <div className="captured-list">
        {Array(6).fill(null).map((_, i) => {
          const pokemon = capturedPokemon[i];
          if (pokemon) {
            return (
              <div
                key={i}
                className={`captured-slot filled ${pokemon.isShiny ? 'shiny' : ''}`}
              >
                <img src={getSpriteUrl(pokemon)} alt={getDisplayName(pokemon)} />
              </div>
            );
          }
          return <div key={i} className="captured-slot empty">?</div>;
        })}
      </div>
    </section>
  );
}
