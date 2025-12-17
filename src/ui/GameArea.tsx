
import { Pokemon } from '@/utils/types';
import PokemonCard from './PokemonCard';

interface GameAreaProps {
  currentPokemon: Pokemon | null;
  animationState: 'idle' | 'throwing' | 'capturing' | 'fleeing' | 'rejected-left' | 'rejected-right';
  attemptsLeft: number;
  stats: { totalEncounters: number; totalCaptures: number };
  isProcessing: boolean;
  onThrow: () => void;
  onFlee: () => void;
}

export default function GameArea({
  currentPokemon,
  animationState,
  attemptsLeft,
  stats,
  isProcessing,
  onThrow,
  onFlee
}: GameAreaProps) {
  const captureRate = stats.totalEncounters > 0
    ? Math.round((stats.totalCaptures / stats.totalEncounters) * 100)
    : 0;

  return (
    <section className="game-area">
      <div className="pokemon-encounter-zone">
        <PokemonCard pokemon={currentPokemon} animationState={animationState} />
      </div>

      <div className="attempts-display">
        <span className="attempts-label">Tentatives restantes:</span>
        <span className="attempts-balls">
          {Array(attemptsLeft).fill(null).map((_, i) => (
            <img
              key={`full-${i}`}
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokéball"
              className="sprite-icon"
            />
          ))}
          {Array(3 - attemptsLeft).fill(null).map((_, i) => (
            <img
              key={`empty-${i}`}
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokéball vide"
              className="sprite-icon sprite-icon-empty"
            />
          ))}
        </span>
      </div>

      <div className="action-buttons">
        <button
          className="action-btn throw-btn"
          onClick={onThrow}
          disabled={isProcessing || attemptsLeft <= 0}
          aria-label="Lancer une Pokéball"
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokéball"
            className="sprite-icon"
          />
          Lancer
        </button>
        <button
          className="action-btn flee-btn"
          onClick={onFlee}
          disabled={isProcessing}
          aria-label="Fuir le combat"
        >
          <img
            src="./assets/escape.png"
            alt="Fuir"
            className="sprite-icon"
          />
          Fuir
        </button>
      </div>

      <div className="stats-display">
        <span className="stat">{stats.totalCaptures} capturés</span>
        <span className="stat-separator">|</span>
        <span className="stat">{stats.totalEncounters} rencontres</span>
        <span className="stat-separator">|</span>
        <span className="stat">{captureRate}% réussite</span>
      </div>
    </section>
  );
}
