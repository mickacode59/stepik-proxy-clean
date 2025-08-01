
import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../components/useDocumentTitle';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import InstallPWAButton from '../components/InstallPWAButton';

// Dashboard minimaliste : uniquement message de bienvenue et actions rapides
const Dashboard: React.FC = () => {
  useDocumentTitle('Tableau de bord - myrusse');
  const [posts, setPosts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    // Fil de posts
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap: any) => {
      setPosts(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });
    // Membres actifs
    const unsubMembers = onSnapshot(collection(db, 'users'), (snap: any) => {
      setMembers(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      // Suggestions d'amis (exemple: tous sauf l'utilisateur courant)
      // À adapter selon la logique d'amis réelle
      setSuggestions(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      // Tendances: tri par leçons terminées
      setTrending(snap.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.stats?.totalLessonsCompleted || 0) - (a.stats?.totalLessonsCompleted || 0))
        .slice(0, 5));
    });
    return () => {
      unsubPosts();
      unsubMembers();
    };
  }, []);

  return (
    <main className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen" aria-label="Tableau de bord utilisateur" role="main">
      {/* Header fixe moderne */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Logo supprimé, toutes les images doivent venir de l'API */}
          <span className="font-bold text-xl text-gray-800 tracking-tight">myrusse</span>
        </div>
        <nav className="flex gap-6">
          <a href="/dashboard" className="text-gray-600 hover:text-red-500 font-medium">Fil d’actualité</a>
          <a href="/courses" className="text-gray-600 hover:text-red-500 font-medium">Cours</a>
          <a href="/messagerie" className="text-gray-600 hover:text-red-500 font-medium">Messages</a>
          <a href="/profile" className="text-gray-600 hover:text-red-500 font-medium">Profil</a>
        </nav>
      </header>
      <div className="pt-24 max-w-3xl mx-auto px-4">
        <InstallPWAButton />
        <h1 className="text-3xl font-bold mb-8 text-center text-red-700">Добро пожаловать sur MyRusse !</h1>
      {/* Actions rapides */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8" aria-label="Actions rapides" role="region">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ...boutons d'action rapide, inchangés... */}
          {/* ...existing code... */}
        </div>
      </section>
      {/* Fil de la communauté */}
      <section className="mt-12" aria-label="Fil de la communauté" role="region">
        <h2 className="text-xl font-semibold mb-4">Fil de la communauté</h2>
        <div className="space-y-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4" aria-label="Post de la communauté">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                <span className="font-bold text-lg text-blue-700 dark:text-blue-300">{post.author}</span>
              </div>
              {post.image && <img src={post.image} alt="Image du post" className="w-full max-h-96 object-cover rounded-xl" loading="lazy" />}
              <div className="text-gray-800 dark:text-gray-100 text-base">{post.content}</div>
              <div className="flex gap-6 mt-2">
                <button className="flex items-center gap-1 text-blue-600 font-bold hover:underline focus-visible:ring-2 focus-visible:ring-blue-500">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth="2"/></svg>
                  {post.likes} J'aime
                </button>
                <button className="flex items-center gap-1 text-gray-600 font-bold hover:underline focus-visible:ring-2 focus-visible:ring-gray-500">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>
                  {post.comments} Commentaires
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* Tendances */}
      <section className="mb-12" aria-label="Tendances">
        <h2 className="text-xl font-semibold mb-4">Tendances</h2>
        <div className="flex gap-8">
          <div>
            <h3 className="font-bold mb-2">Membres les plus actifs</h3>
            <div className="flex gap-4">
              {trending.map(t => (
                <div key={t.id} className="flex flex-col items-center w-20">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-100">{t.name}</span>
                  <span className="text-xs text-blue-600">{t.lessons} leçons</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Suggestions d'amis */}
      <section className="mb-12" aria-label="Suggestions d'amis">
        <h2 className="text-xl font-semibold mb-4">Suggestions d'amis</h2>
        <div className="flex gap-4">
          {suggestions.map(s => (
            <div key={s.id} className="flex flex-col items-center w-20">
              <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover mb-1" loading="lazy" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-100">{s.name}</span>
              <span className="text-xs text-gray-500">{s.mutual} amis en commun</span>
              <button className="mt-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">Ajouter</button>
            </div>
          ))}
        </div>
      </section>
      {/* Membres actifs */}
      <section className="mb-12" aria-label="Membres actifs">
        <h2 className="text-xl font-semibold mb-4">Membres actifs</h2>
        <div className="flex gap-4">
          {members.map(m => (
            <div key={m.id} className="flex flex-col items-center w-20">
              <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover mb-1" loading="lazy" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-100">{m.name}</span>
              <span className="text-xs text-gray-500">{m.online ? '🟢 En ligne' : '⚫ Hors ligne'}</span>
            </div>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
};

export default Dashboard;