import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
  id: string;
  type: string;
  user: string;
  date: string;
  content: string;
}

const SocialFeed: React.FC = () => {
  const { currentUser } = useAuth();
  const [feed, setFeed] = useState<Activity[]>([]);

  useEffect(() => {
    void currentUser;
  }, []);

  useEffect(() => {
    // Example: fetch latest activities from 'activities' collection
    const unsub = onSnapshot(query(collection(db, 'activities')), snap => {
      setFeed(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Fil d'actualité social</h2>
      <div className="flex flex-col gap-4">
        {feed.length === 0 && <div className="text-gray-500">Aucune activité récente.</div>}
        {feed.map(act => (
          <div key={act.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-blue-700">{act.user}</span>
              <span className="text-xs text-gray-400">{new Date(act.date).toLocaleString()}</span>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">{act.type}</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200">{act.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
