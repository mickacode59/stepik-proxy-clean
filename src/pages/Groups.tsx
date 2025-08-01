
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Group {
  id: string;
  name: string;
  avatar: string;
  members: string[];
  isPublic: boolean;
}

const Groups: React.FC = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'groups')), snap => {
      setGroups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group)));
    });
    return () => unsub();
  }, []);
  useEffect(() => { void deleteDoc; void doc; }, []);

  const createGroup = async () => {
    if (!currentUser?.uid || !name) return;
    await addDoc(collection(db, 'groups'), {
      name,
      avatar,
      members: [currentUser.uid],
      isPublic,
    });
    setName('');
    setAvatar('');
    setIsPublic(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Groupes d'amis</h2>
      <div className="mb-6">
        <input type="text" className="px-3 py-2 rounded border mb-2 w-full" placeholder="Nom du groupe" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" className="px-3 py-2 rounded border mb-2 w-full" placeholder="URL avatar (optionnel)" value={avatar} onChange={e => setAvatar(e.target.value)} />
        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} /> Groupe public
        </label>
        <button className="px-4 py-2 bg-blue-600 text-white rounded font-bold" onClick={createGroup}>Créer le groupe</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {groups.map(g => (
          <div key={g.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
            <img src={g.avatar} alt="avatar" className="w-16 h-16 rounded-full mb-2 border" />
            <div className="font-semibold text-lg">{g.name}</div>
            <div className="text-xs text-gray-500 mb-2">{g.isPublic ? 'Public' : 'Privé'}</div>
            <div className="text-xs text-gray-500 mb-2">{g.members.length} membres</div>
            <button className="px-3 py-1 rounded bg-blue-200 text-blue-700 font-semibold">Voir le groupe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
