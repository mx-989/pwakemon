import { useEffect, useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSettings } from '@/hooks/useSettings';
import Header from './Header';
import GameArea from './GameArea';
import TeamSection from './TeamSection';
import TeamModal from './TeamModal';
import PokedexModal from './PokedexModal';

export default function App() {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPokedexModal, setShowPokedexModal] = useState(false);
  const [pokeballTarget, setPokeballTarget] = useState({ x: 50, y: 50 });
  const gameAreaRef = useRef<HTMLElement>(null);

  const {
    currentPokemon,
    attemptsLeft,
    isProcessing,
    capturedPokemon,
    stats,
    pokedex,
    encountered,
    favorites,
    pendingCapture,
    isLoading,
    animationState,
    loadSavedData,
    startNewEncounter,
    attemptCapture,
    fleeEncounter,
    handleRelease,
    handleToggleFavorite,
    setPendingCapture,
    setIsProcessing
  } = useGameState();

  const { darkMode, soundEnabled, toggleDarkMode, toggleSound } = useSettings();

  useEffect(() => {
    const init = async () => {
      loadSavedData();
      await startNewEncounter();
    };
    init();
  }, []);

  useEffect(() => {
    if (gameAreaRef.current && currentPokemon) {
      const pokemonCard = gameAreaRef.current.querySelector('.pokemon-card');
      if (pokemonCard) {
        const rect = pokemonCard.getBoundingClientRect();
        const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        setPokeballTarget({ x: centerX, y: centerY });
      }
    }
  }, [currentPokemon, animationState]);

  const handleCloseTeamModal = () => {
    setShowTeamModal(false);
    if (pendingCapture) {
      setPendingCapture(null);
      setIsProcessing(false);
    }
  };

  const handleReleaseWrapper = (index: number) => {
    handleRelease(index);
    if (!pendingCapture) {
      setShowTeamModal(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        onPokedexClick={() => setShowPokedexModal(true)}
        onTeamClick={() => setShowTeamModal(true)}
        onToggleSound={toggleSound}
        onToggleDarkMode={toggleDarkMode}
        soundEnabled={soundEnabled}
        darkMode={darkMode}
      />

      <main className="main-content" ref={gameAreaRef}>
        <GameArea
          currentPokemon={currentPokemon}
          animationState={animationState}
          attemptsLeft={attemptsLeft}
          stats={stats}
          isProcessing={isProcessing}
          onThrow={attemptCapture}
          onFlee={fleeEncounter}
        />

        <TeamSection
          capturedPokemon={capturedPokemon}
          onManageTeam={() => setShowTeamModal(true)}
        />
      </main>

      <footer className="footer">
        <p>Pwakémon © 2025 - Données via <a href="https://pokeapi.co/" target="_blank" rel="noopener">PokéAPI</a></p>
        <p>Pokémon et les noms associés sont des marques déposées de Nintendo.</p>
      </footer>

      {(animationState === 'throwing' || animationState === 'rejected-left' || animationState === 'rejected-right') && (
        <div className="pokeball-container">
          <div
            className={`pokeball-animation ${animationState === 'rejected-left' ? 'rejected-left' : ''} ${animationState === 'rejected-right' ? 'rejected-right' : ''}`}
            style={{
              '--target-x': `${pokeballTarget.x}%`,
              '--target-y': `${pokeballTarget.y}%`
            } as React.CSSProperties}
          >
            <img
              src='./assets/poke-ball.png'
              alt="Pokéball"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
        </div>
      )}

      {showTeamModal && (
        <TeamModal
          capturedPokemon={capturedPokemon}
          onClose={handleCloseTeamModal}
          onRelease={handleReleaseWrapper}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showPokedexModal && (
        <PokedexModal
          pokedex={pokedex}
          encountered={encountered}
          favorites={favorites}
          onClose={() => setShowPokedexModal(false)}
        />
      )}
    </div>
  );
}
