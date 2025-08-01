import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Activity {
  id: string;
  type: string;
  user: string;
  date: string;
  content: string;
}

const GlobalSocialWidget: React.FC = () => {
  const { currentUser } = useAuth();
  const [feed, setFeed] = useState<Activity[]>([]);

  useEffect(() => {
    void currentUser;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'activities')), snap => {
      setFeed(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
    });
    return () => unsub();
  }, []);

  if (feed.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700">
      <div className="font-bold text-lg mb-2 text-purple-700">Fil social en direct</div>
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {feed.slice(0, 5).map(act => (
          <div key={act.id} className="text-sm">
            <span className="font-bold text-blue-700">{act.user}</span> <span className="text-xs text-gray-400">{new Date(act.date).toLocaleTimeString()}</span>
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold ml-2">{act.type}</span>
            <div className="text-gray-700 dark:text-gray-200">{act.content}</div>
          </div>
        ))}
      </div>
      <a href="/socialfeed" className="block mt-2 text-xs text-purple-600 underline text-center">Voir tout le fil</a>
    </div>
  );
};

export default GlobalSocialWidget;
