import React, { useState, useEffect } from 'react';
import RussianKeyboard from '../components/RussianKeyboard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompleterProfil: React.FC = () => {
  const { updateUserProfile, currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({ displayName, photoURL });
      navigate('/dashboard');
    } catch (error) {
      // Gérer l'erreur si besoin
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full space-y-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complétez votre profil</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Merci de renseigner votre nom pour finaliser votre inscription.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Votre nom complet"
              />
              <button type="button" className="ml-2 px-2 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700" onClick={() => { setKeyboardTarget('displayName'); setShowKeyboard(v => !v); }}>{showKeyboard && keyboardTarget === 'displayName' ? 'Fermer' : 'Clavier russe'}</button>
              {showKeyboard && keyboardTarget === 'displayName' && (
                <RussianKeyboard
                  onPublish={text => { setDisplayName(text); setShowKeyboard(false); }}
                  onClose={() => setShowKeyboard(false)}
                />
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
              />
              <button type="button" className="ml-2 px-2 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700" onClick={() => { setKeyboardTarget('email'); setShowKeyboard(v => !v); }}>{showKeyboard && keyboardTarget === 'email' ? 'Fermer' : 'Clavier russe'}</button>
              {showKeyboard && keyboardTarget === 'email' && (
                <RussianKeyboard
                  onPublish={text => { setEmail(text); setShowKeyboard(false); }}
                  onClose={() => setShowKeyboard(false)}
                />
              )}
            </div>
            {photoURL && (
              <div className="flex items-center space-x-2">
                <img src={photoURL} alt="Avatar" className="w-10 h-10 rounded-full border" />
                <input
                  type="text"
                  value={photoURL}
                  onChange={e => setPhotoURL(e.target.value)}
                  className="ml-2 px-2 py-1 border rounded"
                  placeholder="URL de la photo"
                />
                <button type="button" className="ml-2 px-2 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700" onClick={() => { setKeyboardTarget('photoURL'); setShowKeyboard(v => !v); }}>{showKeyboard && keyboardTarget === 'photoURL' ? 'Fermer' : 'Clavier russe'}</button>
                {showKeyboard && keyboardTarget === 'photoURL' && (
                  <RussianKeyboard
                    onPublish={text => { setPhotoURL(text); setShowKeyboard(false); }}
                    onClose={() => setShowKeyboard(false)}
                  />
                )}
                <span className="text-gray-700 dark:text-gray-300 text-sm">Photo Google</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors disabled:opacity-50 outline-none"
          >
            {loading ? 'Enregistrement...' : 'Valider'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleterProfil;
