import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const settings = storage.getSettings();
    return settings.darkMode;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    const settings = storage.getSettings();
    storage.setSettings({ ...settings, darkMode: newDarkMode });
  };

  return { darkMode, toggleDarkMode };
}
