import React from 'react';
import { Menu, Bell, Search, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { userProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    auto: Monitor
  };

  const ThemeIcon = themeIcons[theme];

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Messagerie bouton */}
            <button
              className="p-2 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-800 transition-colors"
              onClick={() => window.location.href = '/messagerie'}
              title="Messagerie"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Search bar */}
            <div className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher des cours, leçons..."
                  className="pl-10 pr-4 py-2 w-80 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
              title={`Thème actuel: ${theme}`}
            >
              <ThemeIcon size={20} />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* XP and Level */}
            <div className="hidden sm:flex items-center space-x-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">XP: </span>
                <span className="font-semibold text-gray-900 dark:text-white">{userProfile?.xp || 0}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Niveau: </span>
                <span className="font-semibold text-red-600 dark:text-red-400">{userProfile?.level || 1}</span>
              </div>
            </div>

            {/* User profile bouton */}
            <button
              className="flex items-center space-x-3 focus:outline-none group"
              onClick={() => window.location.href = '/profile'}
              title="Voir mon profil"
            >
              <img
                src={userProfile?.avatar || userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=dc2626&color=fff`}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:ring-2 group-hover:ring-red-500"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userProfile?.displayName || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Série: {userProfile?.streak || 0} jours
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;