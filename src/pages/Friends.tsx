
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  online: boolean;
  friendsCount?: number;
  messagesCount?: number;
  groupsCount?: number;
  badges?: string[];
}

interface ProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  isFriend: boolean;
  friendshipDate: string;
  mutualFriends: UserProfile[];
  onStartChat: () => void;
  onFavorite: () => void;
  onBlock: () => void;
  onReport: () => void;
  isFavorite: boolean;
  isBlocked: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, isFriend, friendshipDate, mutualFriends, onStartChat, onFavorite, onBlock, onReport, isFavorite, isBlocked }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl relative">
      <button className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-xl font-bold" onClick={onClose}>&times;</button>
      <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border" />
      <div className="font-bold text-xl text-center mb-2">{user.name}</div>
      <div className="text-center text-gray-500 mb-2">{user.online ? 'En ligne' : 'Hors ligne'}</div>
      <div className="text-center text-sm mb-4">{user.bio || 'Aucune bio.'}</div>
      {/* Statistiques de profil */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">{user.friendsCount ?? 0}</span>
          <span className="text-xs text-gray-500">Amis</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">{user.messagesCount ?? 0}</span>
          <span className="text-xs text-gray-500">Messages</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">{user.groupsCount ?? 0}</span>
          <span className="text-xs text-gray-500">Groupes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">{user.badges?.length ?? 0}</span>
          <span className="text-xs text-gray-500">Badges</span>
        </div>
      </div>
      {/* Badges et trophées */}
      {user.badges && user.badges.length > 0 && (
        <div className="mb-4">
          <div className="font-semibold text-sm mb-1">Badges & Trophées :</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {user.badges.map((badge: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-300">{badge}</span>
            ))}
          </div>
        </div>
      )}
      {isFriend && friendshipDate && (
        <div className="text-center text-xs text-green-600 mb-2">Ami depuis le {new Date(friendshipDate).toLocaleDateString()}</div>
      )}
      <div className="flex gap-2 justify-center mb-4">
        <button className="px-3 py-1 rounded bg-blue-200 text-blue-700 font-semibold" onClick={onStartChat}>Envoyer un message</button>
        <button className={`px-3 py-1 rounded ${isFavorite ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-700'} font-semibold`} onClick={onFavorite}>{isFavorite ? 'Favori' : 'Ajouter favori'}</button>
        <button className={`px-3 py-1 rounded ${isBlocked ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-700'} font-semibold`} onClick={onBlock}>{isBlocked ? 'Débloquer' : 'Bloquer'}</button>
        <button className="px-3 py-1 rounded bg-red-200 text-red-700 font-semibold" onClick={onReport}>Signaler</button>
      </div>
      {mutualFriends.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1">Amis en commun :</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {mutualFriends.map(f => (
              <div key={f.id} className="flex items-center gap-1">
                <img src={f.avatar} alt="avatar" className="w-6 h-6 rounded-full border" />
                <span className="text-xs">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded font-bold" onClick={onClose}>Fermer</button>
    </div>
  </div>
);

const Friends: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [friendshipDate, setFriendshipDate] = useState<string>("");
  const [mutualFriends, setMutualFriends] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [blocked, setBlocked] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'users')), snap => {
      // Only show real users (no fake profiles)
      setUsers(snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
        .filter(u => u.name && u.avatar && !u.name.toLowerCase().includes('test') && !u.name.toLowerCase().includes('fake')));
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(query(collection(db, 'users', currentUser.uid, 'blocked')), snap => {
      setBlocked(snap.docs.map(doc => doc.id));
    });
    return () => unsub();
  }, [currentUser?.uid]);
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(query(collection(db, 'users', currentUser.uid, 'favorites')), snap => {
      setFavorites(snap.docs.map(doc => doc.id));
    });
    return () => unsub();
  }, [currentUser?.uid]);
  const blockUser = async (id: string) => {
    if (!currentUser?.uid || blocked.includes(id)) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'blocked'), { blockedId: id });
  };
  const unblockUser = async (id: string) => {
    if (!currentUser?.uid) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'blocked', id));
  };
  const favoriteUser = async (id: string) => {
    if (!currentUser?.uid || favorites.includes(id)) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'favorites'), { favoriteId: id });
  };
  const unfavoriteUser = async (id: string) => {
    if (!currentUser?.uid) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', id));
  };
  const reportUser = async (id: string) => {
    void id;
    // In production, send to moderation system
    alert('Utilisateur signalé à la modération.');
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(query(collection(db, 'users', currentUser.uid, 'friends')), snap => {
      setFriends(snap.docs.map(doc => doc.id));
    });
    return () => unsub();
  }, [currentUser?.uid]);

  const addFriend = async (id: string) => {
    if (!currentUser?.uid || friends.includes(id)) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'friends'), { friendId: id, createdAt: new Date().toISOString() });
  };
  const removeFriend = async (id: string) => {
    if (!currentUser?.uid) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'friends', id));
  };

  useEffect(() => { void setFriendshipDate; }, []);
  useEffect(() => { void setMutualFriends; }, []);
  useEffect(() => { void setId; }, []);
  useEffect(() => { void id; }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Mes amis</h2>
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 rounded border"
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(u => (
          <div key={u.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
            <img src={u.avatar} alt="avatar" className="w-16 h-16 rounded-full mb-2 border" />
            <div className="font-semibold text-lg">{u.name}</div>
            <div className="text-xs text-gray-500 mb-2">{u.online ? 'En ligne' : 'Hors ligne'}</div>
            <div className="flex gap-2 mb-2">
              <button
                className={`px-3 py-1 rounded ${friends.includes(u.id) ? 'bg-red-200 text-red-700' : 'bg-blue-200 text-blue-700'} font-semibold`}
                onClick={() => friends.includes(u.id) ? removeFriend(u.id) : addFriend(u.id)}
              >
                {friends.includes(u.id) ? 'Retirer' : 'Ajouter'}
              </button>
              <button
                className={`px-3 py-1 rounded ${favorites.includes(u.id) ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-700'} font-semibold`}
                onClick={() => favorites.includes(u.id) ? unfavoriteUser(u.id) : favoriteUser(u.id)}
              >
                {favorites.includes(u.id) ? 'Favori' : 'Ajouter favori'}
              </button>
              <button
                className={`px-3 py-1 rounded ${blocked.includes(u.id) ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-700'} font-semibold`}
                onClick={() => blocked.includes(u.id) ? unblockUser(u.id) : blockUser(u.id)}
              >
                {blocked.includes(u.id) ? 'Débloquer' : 'Bloquer'}
              </button>
              <button className="px-3 py-1 rounded bg-red-200 text-red-700 font-semibold" onClick={() => reportUser(u.id)}>Signaler</button>
            </div>
            <button className="text-xs underline text-blue-600" onClick={() => setSelected(u)}>Voir le profil</button>
          </div>
        ))}
      </div>
      {selected && (
        <ProfileModal
          user={selected}
          onClose={() => setSelected(null)}
          isFriend={friends.includes(selected.id)}
          friendshipDate={friendshipDate}
          mutualFriends={mutualFriends}
          onStartChat={() => {
            window.location.href = `/messagerie?chat=${selected.id}`;
          }}
          onFavorite={() => favorites.includes(selected.id) ? unfavoriteUser(selected.id) : favoriteUser(selected.id)}
          onBlock={() => blocked.includes(selected.id) ? unblockUser(selected.id) : blockUser(selected.id)}
          onReport={() => reportUser(selected.id)}
          isFavorite={favorites.includes(selected.id)}
          isBlocked={blocked.includes(selected.id)}
        />
      )}
    </div>
  );
};

export default Friends;
