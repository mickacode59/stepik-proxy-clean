
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendFriendRequest } from '../utils/friendRequests';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string|null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const db = getFirestore();
        const ref = doc(db, 'users', id!);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUser({ id: snap.id, ...snap.data() });
        } else {
          setUser(null);
        }
      } finally {
        setLoadingUser(false);
      }
    }
    if (id) fetchUser();
  }, [id]);

  const isOwnProfile = false;
  useEffect(() => {
    // Suppression de la logique de profil privé
  }, [user]);

  const handleAddFriend = async () => {
    setLoading(true);
    try {
      await sendFriendRequest(user.id);
      setStatus('pending');
    } catch (e) {
      const error = e as Error;
      alert(error.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <div className="max-w-xl mx-auto mt-24 text-center text-gray-600">Chargement du profil...</div>;
  }
  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Profil non trouvé</h2>
        <p className="mb-6">Ce profil n'existe pas ou a été supprimé.<br/>Vous pouvez consulter la liste des membres ou revenir à l'accueil.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto mt-24 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col items-center">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white shadow mb-4 object-cover" />
         <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white shadow mb-4 object-cover" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
        <p className="text-sm text-gray-500 mb-2">{user.level}</p>
        <p className="text-gray-700 mb-4 italic">{user.bio}</p>
        {/* Bouton Ajouter en ami sauf sur son propre profil */}
        {!isOwnProfile && (
          status === 'pending' ? (
            <button disabled className="px-6 py-2 rounded-full bg-gray-300 text-gray-600 font-semibold shadow cursor-not-allowed">
              Demande envoyée
            </button>
          ) : status === 'accepted' ? (
            <span className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow">Déjà ami</span>
          ) : (
            <button
              onClick={handleAddFriend}
              disabled={loading}
              className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
            >
              {loading ? 'Envoi...' : 'Ajouter en ami'}
            </button>
          )
        )}
      </div>
    </main>
  );
};

export default Profile;

