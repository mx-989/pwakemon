import { useState, useCallback } from 'react';
import { Pokemon } from '@/utils/types';
import { fetchRandomPokemon } from '@/utils/pokemon';
import {
  addCapturedPokemon,
  isTeamFull,
  releasePokemon,
  incrementEncounters,
  getCapturedPokemon,
  getStats,
  getPokedex,
  getEncountered,
  getFavorites,
  addEncountered,
  toggleFavorite as toggleFavoriteInStorage,
  isFavorite as checkIsFavorite
} from '@/utils/storage';
import { soundManager } from '@/utils/sounds';

export function getDisplayName(pokemon: Pokemon): string {
  return pokemon.nameFr || pokemon.name;
}

function calculateCaptureSuccess(): boolean {
  const chance = 0.15 + Math.random() * (0.40 - 0.15);
  return Math.random() < chance;
}

export function useGameState() {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedPokemon, setCapturedPokemon] = useState<Pokemon[]>([]);
  const [stats, setStats] = useState({ totalEncounters: 0, totalCaptures: 0 });
  const [pokedex, setPokedex] = useState<number[]>([]);
  const [encountered, setEncountered] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [pendingCapture, setPendingCapture] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'throwing' | 'capturing' | 'fleeing' | 'rejected-left' | 'rejected-right'>('idle');

  const loadSavedData = useCallback(() => {
    const captured = getCapturedPokemon();
    const favs = getFavorites();

    // Sync isFavorite property with favorites storage
    const syncedCaptured = captured.map(pokemon => ({
      ...pokemon,
      isFavorite: favs.includes(pokemon.id)
    }));

    setCapturedPokemon(syncedCaptured);
    setStats(getStats());
    setPokedex(getPokedex());
    setEncountered(getEncountered());
    setFavorites(favs);
  }, []);

  const startNewEncounter = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setIsLoading(true);

    try {
      const pokemon = await fetchRandomPokemon();

      if (!pokemon) {
        return;
      }

      setCurrentPokemon(pokemon);
      setAttemptsLeft(3);
      incrementEncounters();
      addEncountered(pokemon.id);
      setStats(getStats());
      setEncountered(getEncountered());

      if (pokemon.isShiny) {

        // Play Pokemon cry first, then shiny sound
        if (pokemon.cry) {
          soundManager.playCry(pokemon.cry);
          setTimeout(() => {
            soundManager.playShinyEncounterSound();
          }, 800);
        } else {
          soundManager.playShinyEncounterSound();
        }
      } else {
        // Play Pokemon cry
        if (pokemon.cry) {
          soundManager.playCry(pokemon.cry);
        }
      }
    } catch (error) {
      console.error('Error starting encounter:', error);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const handleCaptureSuccess = useCallback(async () => {
    if (!currentPokemon) return;

    setAnimationState('capturing');
    soundManager.playCaptureSuccessSound();

    await new Promise(resolve => setTimeout(resolve, 1500));

    const added = addCapturedPokemon(currentPokemon);

    if (added) {
      loadSavedData();
    }

    setAnimationState('idle');
    setCurrentPokemon(null);
    setIsProcessing(false);
    await new Promise(resolve => setTimeout(resolve, 100));
    await startNewEncounter();
  }, [currentPokemon, loadSavedData, startNewEncounter]);

  const attemptCapture = useCallback(async () => {
    if (!currentPokemon || isProcessing || attemptsLeft <= 0) return;

    setIsProcessing(true);
    setAnimationState('throwing');
    soundManager.playThrowSound();

    // Decrement attempts immediately to gray out the pokeball
    const newAttempts = attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = calculateCaptureSuccess();

    if (success) {
      if (isTeamFull()) {
        setPendingCapture(currentPokemon);
        setIsProcessing(false);
        setAnimationState('idle');
        return;
      }

      await handleCaptureSuccess();
    } else {
      soundManager.playCaptureFailSound();

      if (newAttempts <= 0) {
        setAnimationState('fleeing');
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnimationState('idle');
        setCurrentPokemon(null);
        await new Promise(resolve => setTimeout(resolve, 50));
        await startNewEncounter();
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
        setAnimationState(Math.random() < 0.5 ? 'rejected-left' : 'rejected-right');
        await new Promise(resolve => setTimeout(resolve, 600));
        setAnimationState('idle');
        setIsProcessing(false);
      }
    }
  }, [currentPokemon, isProcessing, attemptsLeft, handleCaptureSuccess, startNewEncounter]);

  const fleeEncounter = useCallback(async () => {
    if (!currentPokemon || isProcessing) return;

    setIsProcessing(true);
    setAnimationState('fleeing');

    await new Promise(resolve => setTimeout(resolve, 800));
    setAnimationState('idle');
    setCurrentPokemon(null);
    setIsProcessing(false);
    await new Promise(resolve => setTimeout(resolve, 50));
    await startNewEncounter();
  }, [currentPokemon, isProcessing, startNewEncounter]);

  const handleRelease = useCallback((index: number) => {
    releasePokemon(index);
    loadSavedData();

    if (pendingCapture) {
      setCurrentPokemon(pendingCapture);
      setPendingCapture(null);
      handleCaptureSuccess();
    }
  }, [pendingCapture, loadSavedData, handleCaptureSuccess]);

  const handleToggleFavorite = useCallback((pokemonId: number) => {
    toggleFavoriteInStorage(pokemonId);
    loadSavedData();
  }, [loadSavedData]);

  return {
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
  };
}
