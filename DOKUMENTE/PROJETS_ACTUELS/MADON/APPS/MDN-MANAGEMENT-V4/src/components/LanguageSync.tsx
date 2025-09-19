import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Composant pour synchroniser la langue entre SettingsProvider et LanguageProvider
 */
export function LanguageSync() {
  const { settings } = useSettings();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Synchroniser la langue des paramètres avec le contexte de langue
    if (settings.language.code) {
      setLanguage(settings.language.code);
    }
  }, [settings.language.code]); // Supprimer setLanguage des dépendances

  return null; // Ce composant ne rend rien
}
