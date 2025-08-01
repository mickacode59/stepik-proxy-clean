

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, UserPlus, Flame } from 'lucide-react';

type Trend = { title: string; link: string };
type UserSuggestion = { id: string; name: string; avatar: string };

interface SocialSidebarWidgetProps {
  trends?: Trend[];
  suggestions?: UserSuggestion[];
  activeMembers?: UserSuggestion[];
}

const SocialSidebarWidget: React.FC<SocialSidebarWidgetProps> = ({ trends = [], suggestions = [], activeMembers = [] }) => {
  return (
    <aside className="fixed top-24 right-0 w-80 max-w-full z-40 bg-white dark:bg-gray-900 shadow-xl rounded-l-2xl border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8">
      {/* Tendances */}
      <section>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
          <Flame size={20} /> Tendances
        </h3>
        <ul className="space-y-2">
          {trends.length === 0 ? (
            <li className="text-gray-400 italic">Aucune tendance pour le moment</li>
          ) : (
            trends.map((trend, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Star size={16} className="text-yellow-400" />
                <Link to={trend.link} className="hover:underline font-medium">{trend.title}</Link>
              </li>
            ))
          )}
        </ul>
      </section>
      {/* Suggestions d'amis */}
      <section>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <UserPlus size={20} /> Suggestions d'amis
        </h3>
        <ul className="space-y-2">
          {suggestions.length === 0 ? (
            <li className="text-gray-400 italic">Aucune suggestion</li>
          ) : (
            suggestions.map((user, i) => (
              <li key={i} className="flex items-center gap-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
                <Link to={`/profile/${user.id}`} className="font-medium hover:underline">{user.name}</Link>
                <button className="ml-auto px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition">Ajouter</button>
              </li>
            ))
          )}
        </ul>
      </section>
      {/* Membres actifs */}
      <section>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
          <Users size={20} /> Membres actifs
        </h3>
        <ul className="flex flex-wrap gap-2">
          {activeMembers.length === 0 ? (
            <li className="text-gray-400 italic">Aucun membre actif</li>
          ) : (
            activeMembers.map((user, i) => (
              <li key={i}>
                <Link to={`/profile/${user.id}`} title={user.name}>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-green-400 hover:scale-110 transition" />
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </aside>
  );
};

export default SocialSidebarWidget;
