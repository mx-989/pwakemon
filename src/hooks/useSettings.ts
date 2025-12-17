import { useState, useEffect, useCallback } from 'react';
import { getDarkMode, setDarkMode } from '@/utils/storage';
import { soundManager } from '@/utils/sounds';

export function useSettings() {
  const [darkMode, setDarkModeState] = useState(getDarkMode());
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setDarkModeState(newMode);
    soundManager.playClickSound();
  }, [darkMode]);

  const toggleSound = useCallback(() => {
    soundManager.toggle();
    setSoundEnabled(soundManager.isEnabled());
    soundManager.playClickSound();
  }, []);

  return {
    darkMode,
    soundEnabled,
    toggleDarkMode,
    toggleSound
  };
}
