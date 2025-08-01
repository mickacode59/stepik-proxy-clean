import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// ...existing code...
import toast from 'react-hot-toast';
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Trophy, 
  Settings,
  Globe,
  Headphones,
  PenTool,
  BarChart3,
  User,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, userProfile, incognitoMode, toggleIncognitoMode } = useAuth();
  const navigate = useNavigate();

  // Handler pour les liens : accès public à toutes les sections
  const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    if (path === '/') {
      navigate('/', { replace: true });
      toast.success('Redirection vers l\'accueil !');
    } else if (window.location.pathname !== path) {
      navigate(path, { replace: false });
      toast.success('Redirection !');
    } else {
      navigate(path, { replace: true });
      toast('Déjà sur cette section !');
    }
    onClose();
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/dashboard', icon: BarChart3, label: 'Tableau de bord' },
    { path: '/courses', icon: BookOpen, label: 'Cours' },
    { path: '/community', icon: User, label: 'Communauté' },
    { path: '/news', icon: Globe, label: 'Actualités' },
    { path: '/exercises', icon: PenTool, label: 'Exercices' },
    { path: '/messagerie', icon: MessageCircle, label: 'Messagerie' },
    { path: '/achievements', icon: Trophy, label: 'Réalisations' },
    { path: '/resources', icon: Globe, label: 'Ressources' },
    { path: '/tools', icon: Headphones, label: 'Outils' },
    { path: '/stepik-explorer', icon: Globe, label: 'Stepik Explorer' },
    { path: '/profile', icon: User, label: 'Profil' },
    { path: '/settings', icon: Settings, label: 'Paramètres' }
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {/* User avatar and name */}
            {userProfile && (
              <>
                <img src={userProfile.avatar || '/public/avatars/avatar1.png'} alt="Avatar" className="w-10 h-10 rounded-full" />
                <span className="font-semibold text-lg">{userProfile.displayName || 'Utilisateur'}</span>
              </>
            )}
            {/* Incognito mode toggle */}
            <button
              onClick={toggleIncognitoMode}
              className="ml-auto flex items-center space-x-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {incognitoMode ? <EyeOff size={20} /> : <Eye size={20} />}
              <span className="text-sm font-medium">
                Mode incognito {incognitoMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={e => handleProtectedClick(e, item.path)}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;