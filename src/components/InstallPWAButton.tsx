import React, { useEffect, useState } from 'react';

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    // Détecte si l'app est déjà installée
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowButton(false);
    });
    // Pour Android/Chrome
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
      timer = setTimeout(() => setShowButton(false), 30000);
    });
    // Pour iOS/Safari (pas d'event, on propose toujours si non installé)
    if ((window.navigator as any).standalone === false || window.matchMedia('(display-mode: browser)').matches) {
      setShowButton(true);
      timer = setTimeout(() => setShowButton(false), 30000);
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowButton(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setShowButton(false);
        }
      });
    } else {
      // iOS: affiche instructions
      alert('Sur iPhone, cliquez sur le bouton Partager puis "Ajouter à l’écran d’accueil" pour installer l’application.');
    }
  };

  if (!showButton || isInstalled) return null;

  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
      <button
        onClick={handleInstall}
        style={{
          padding: '12px 24px',
          background: '#DC2626',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Télécharger l’app
      </button>
    </div>
  );
};

export default InstallPWAButton;
