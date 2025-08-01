import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'fr');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal');
  const [contrast, setContrast] = useState(() => localStorage.getItem('contrast') || 'normal');

  useEffect(() => {
    document.body.style.fontSize = fontSize === 'normal' ? '1rem' : fontSize === 'large' ? '1.25rem' : '1.5rem';
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', contrast === 'high');
    localStorage.setItem('contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10 space-y-10 border border-gray-200 dark:border-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-red-700 dark:text-red-300 text-center">Paramètres visuels</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">Thème</label>
          <select value={theme} onChange={e => setTheme(e.target.value as any)} className="w-full mt-1 px-2 py-1 rounded border">
            <option value="auto">Auto</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Langue</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full mt-1 px-2 py-1 rounded border">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Taille de police</label>
          <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="w-full mt-1 px-2 py-1 rounded border">
            <option value="normal">Normale</option>
            <option value="large">Grande</option>
            <option value="xlarge">Très grande</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Contraste</label>
          <select value={contrast} onChange={e => setContrast(e.target.value)} className="w-full mt-1 px-2 py-1 rounded border">
            <option value="normal">Normal</option>
            <option value="high">Élevé</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
