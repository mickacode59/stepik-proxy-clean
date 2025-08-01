declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setVisible(false);
    // Active Google Analytics
    window.gtag && window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
  };
  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'false');
    setVisible(false);
    // Désactive Google Analytics
    window.gtag && window.gtag('consent', 'update', { 'analytics_storage': 'denied' });
  };

  if (!visible) return null;
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:9999,background:'#fff',color:'#222',padding:'1rem',boxShadow:'0 -2px 8px rgba(0,0,0,0.1)',display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem'}}>
      <span>Ce site utilise des cookies pour mesurer l’audience (Google Analytics). Acceptez-vous ?</span>
      <button style={{background:'#DC2626',color:'#fff',border:'none',padding:'0.5rem 1rem',borderRadius:'6px',cursor:'pointer'}} onClick={accept}>Accepter</button>
      <button style={{background:'#eee',color:'#222',border:'none',padding:'0.5rem 1rem',borderRadius:'6px',cursor:'pointer'}} onClick={decline}>Refuser</button>
    </div>
  );
}
