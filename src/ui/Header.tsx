
import { soundManager } from '@/utils/sounds';

interface HeaderProps {
  onPokedexClick: () => void;
  onTeamClick: () => void;
  onToggleSound: () => void;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  darkMode: boolean;
}

export default function Header({
  onPokedexClick,
  onTeamClick,
  onToggleSound,
  onToggleDarkMode,
  soundEnabled,
  darkMode
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-title">
        <span className="header-logo">
          <img
            src="./assets/loveball.png"
            alt="Pwakémon"
            className="sprite-icon large"
          />
        </span>
        <h1>Pwakémon</h1>
      </div>
      <div className="header-controls">
        <button
          className="header-btn"
          onClick={() => { soundManager.playClickSound(); onPokedexClick(); }}
          title="Pokédex"
          aria-label="Ouvrir le Pokédex"
        >
          <img src="./assets/pokedex.png" alt="Pokédex" className="sprite-icon" />
        </button>
        <button
          className="header-btn"
          onClick={() => { soundManager.playClickSound(); onTeamClick(); }}
          title="Mon Équipe"
          aria-label="Voir mon équipe"
        >
          <img src="./assets/pokeballs.png" alt="Équipe" className="sprite-icon" />
        </button>
        <button
          className="header-btn"
          onClick={onToggleSound}
          title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
          aria-label="Activer/Désactiver le son"
        >
          <img src={soundEnabled ? './assets/soundon.png' : './assets/soundoff.png'} alt="Son" className="sprite-icon" />
        </button>
        <button
          className="header-btn"
          onClick={onToggleDarkMode}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
          aria-label="Activer/Désactiver le mode sombre"
        >
          <img src={darkMode ? './assets/lightmode.png' : './assets/darkmode.png'} alt="Mode" className="sprite-icon" />
        </button>
      </div>
    </header>
  );
}
