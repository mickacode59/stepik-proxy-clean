import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Ce composant gère l'inactivité utilisateur
const AppInactivity: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        toast('Vous avez été déconnecté pour cause d’inactivité.', { icon: '⏰' });
        await logout();
        navigate('/login');
      }, INACTIVITY_TIMEOUT);
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [navigate, logout]);

  return null;
};

export default AppInactivity;
