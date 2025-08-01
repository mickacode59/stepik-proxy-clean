


import React, { useEffect, useState, useRef } from 'react';
import { db } from '../config/firebase';
// import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';

const Community: React.FC = () => {
  // Suppression de l'authentification, tout le monde peut poster anonymement
  const [members, setMembers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPost, setNewPost] = useState<string>('');
  const [newImage, setNewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stories (membres actifs)
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('lastActiveAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Fil de posts
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Publication rapide (texte + image)
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    await addDoc(collection(db, 'posts'), {
      authorId: 'public',
      author: {
        displayName: 'Anonyme',
        photoURL: '/avatars/avatar1.png',
        level: '',
      },
      content: newPost,
      image: newImage,
      createdAt: Timestamp.now(),
      likes: [],
      comments: [],
      tags: [],
      isVisible: true,
    });
    setNewPost('');
    setNewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Gestion image upload (base64 pour démo)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  return (
    <main className="max-w-2xl mx-auto py-8 px-2 sm:px-0" aria-label="Fil communautaire">
      {/* Stories membres actifs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {members.map(member => (
          <div key={member.id} className="flex flex-col items-center" tabIndex={0} aria-label={`Profil de ${member.displayName || 'Utilisateur'}`}> 
            <img src={(member && member.photoURL) ? member.photoURL : (member && member.avatar) ? member.avatar : undefined} alt={member.displayName || 'Membre'} className="w-16 h-16 rounded-full object-cover border-4 border-red-500 transition-transform duration-200 hover:scale-105" loading="lazy" />
            <span className="text-xs mt-1 font-medium text-gray-700">{member.displayName || 'Utilisateur'}</span>
          </div>
        ))}
      </div>

      {/* Publication rapide */}
      <form onSubmit={handlePost} className="mb-8 bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col gap-2" aria-label="Publier un post">
        <label htmlFor="new-post" className="sr-only">Exprime-toi</label>
        <textarea
          id="new-post"
          name="new-post"
          className="w-full p-2 border rounded mb-2 focus-visible:ring-2 focus-visible:ring-red-500"
          placeholder="Exprime-toi..."
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          rows={2}
          required
          aria-label="Exprime-toi"
        />
        <label htmlFor="upload-image" className="sr-only">Télécharger une image</label>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="mb-2" id="upload-image" name="upload-image" aria-label="Télécharger une image" title="Télécharger une image" placeholder="Choisir une image" />
        {newImage && <img src={newImage} alt="Aperçu de l'image" className="w-full max-h-64 object-cover rounded mb-2 animate-fade-in" loading="lazy" />}
        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" title="Publier le post">Publier</button>
      </form>

      {/* Fil de posts façon Instagram */}
      <div className="space-y-8">
        {loading ? (
          <div className="text-gray-400" role="status" aria-live="polite">Chargement...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400" role="status" aria-live="polite">Aucun post pour le moment.</div>
        ) : (
          posts.map(post => (
              <article key={post.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col gap-3" tabIndex={0} aria-label={`Post de ${(post.author && post.author.displayName) ? post.author.displayName : 'Auteur'}`}> 
              <div className="flex items-center gap-3">
                <img src={(post.author && post.author.photoURL) ? post.author.photoURL : (post.author && post.author.avatar) ? post.author.avatar : undefined} alt={(post.author && post.author.displayName) ? post.author.displayName : 'Auteur'} className="w-12 h-12 rounded-full object-cover transition-transform duration-200 hover:scale-105" loading="lazy" />
                <span className="font-bold text-lg text-blue-700 dark:text-blue-300">{(post.author && post.author.displayName) ? post.author.displayName : 'Auteur'}</span>
                <span className="text-xs text-gray-500">Niveau {(post.author && post.author.level) ? post.author.level : ''}</span>
              </div>
              {post.image && <img src={post.image} alt="post" className="w-full max-h-96 object-cover rounded-xl animate-fade-in" loading="lazy" />}
              <div className="text-gray-800 dark:text-gray-100 text-base" aria-label="Contenu du post">{post.content}</div>
              <div className="flex gap-6 mt-2">
                <button type="button" className="flex items-center gap-1 text-blue-600 font-bold hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors" disabled title="Nombre de likes" aria-label="Nombre de likes">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth="2"/></svg>
                  {post.likes?.length || 0} J'aime
                </button>
                <button type="button" className="flex items-center gap-1 text-gray-600 font-bold hover:underline focus-visible:ring-2 focus-visible:ring-gray-500 transition-colors" title="Nombre de commentaires" aria-label="Nombre de commentaires">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>
                  {post.comments?.length || 0} Commentaires
                </button>
              </div>
              {/* Affichage des commentaires (à améliorer) */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {post.comments.map((c: any, idx: number) => (
                    <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                      <strong>{c.author}</strong> : {c.text}
                    </div>
                  ))}
                </div>
              )}
              {/* Ajout d'un commentaire (à améliorer) */}
              {/* Formulaire de commentaire désactivé pour anonymat/public */}
              <div className="text-xs text-gray-400 mt-1">
                {(() => {
                  if (!post.createdAt) return '';
                  if (post.createdAt && typeof (post.createdAt as any).toDate === 'function') {
                    return (post.createdAt as any).toDate().toLocaleString();
                  }
                  if (post.createdAt instanceof Date) {
                    return post.createdAt.toLocaleString();
                  }
                  return '';
                })()}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
};

export default Community;
