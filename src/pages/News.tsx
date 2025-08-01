type NewsItem = {
  id?: string;
  title: string;
  url?: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  createdAt?: { toDate: () => Date } | Date | string;
  urlToImage?: string;
  publishedAt?: string;
};




import React, { useEffect, useState } from 'react';
import RussianKeyboard from '../components/RussianKeyboard';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; // used



// Fonction utilitaire pour obtenir la meilleure URL d'image possible (urlToImage > imageUrl)
function getNewsImageUrl(item: NewsItem): string {
  if (item.urlToImage && item.urlToImage.startsWith('http')) return item.urlToImage;
  if (item.imageUrl && item.imageUrl.startsWith('http')) return item.imageUrl;
  if (item.imageUrl) return item.imageUrl;
  return '/favicon.svg';
}

// API externe pour les news russes (clé utilisateur, via proxy CORS)
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=Russie&language=fr&sortBy=publishedAt&apiKey=90618dc3ed624a13b8c2f36dd4f89180`;

// Composant factorisé pour afficher une news avec image robuste et actions
function NewsCard({ item, external }: { item: NewsItem; external?: boolean }) {
  return (
    <div className={external ? "block bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group mb-2 outline-none" : "bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"} style={external ? { textDecoration: 'none' } : {}}>
      <img
        src={getNewsImageUrl(item)}
        alt={item.title}
        className="w-full h-56 object-cover rounded mb-4"
        onError={e => {
          if (item.urlToImage && item.urlToImage.startsWith('http')) {

          } else if (item.imageUrl && item.imageUrl.startsWith('http')) {

          } else if (item.imageUrl) {

          } else {
            (e.currentTarget as HTMLImageElement).src = '/favicon.svg';
          }
        }}
      />
      <h3 className={external ? "text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:underline" : "text-xl font-bold mb-2 text-gray-900 dark:text-white"}>{item.title}</h3>
      <div className="text-gray-600 dark:text-gray-300 mb-2">{item.description || item.content}</div>
      <div className="text-xs text-gray-400 mb-4">{item.publishedAt || (typeof item.createdAt === 'object' && item.createdAt !== null && 'toDate' in item.createdAt && typeof (item.createdAt as { toDate: () => Date }).toDate === 'function'
        ? (item.createdAt as { toDate: () => Date }).toDate().toLocaleString()
        : item.createdAt ? String(item.createdAt) : '')}</div>
      {external && item.url && (
        <div className="flex gap-3">
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-xs focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
            onClick={e => {
              e.preventDefault();
              navigator.clipboard.writeText(item.url!);
              alert('Lien copié !');
            }}
          >Copier le lien</button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(item.url!)}&text=${encodeURIComponent(item.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
            onClick={e => e.stopPropagation()}
          >Partager sur Twitter</a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.url!)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 text-xs focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
            onClick={e => e.stopPropagation()}
          >Partager sur Facebook</a>
        </div>
      )}
    </div>
  );
}

const News: React.FC = () => {
  const { currentUser } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // API externe news (doit être dans le composant !)
  const [externalNews, setExternalNews] = useState<NewsItem[]>([]);
  // Charger le mapping d'images au montage
  useEffect(() => {
  }, []);

  useEffect(() => {
    fetch(NEWS_API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.articles) setExternalNews(data.articles);
        else setExternalNews([]);
      })
      .catch(() => setExternalNews([]));
  }, []);


  // Firestore news
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setNews(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          url: data.url || '',
          description: data.description,
          imageUrl: data.imageUrl,
          content: data.content,
          createdAt: data.createdAt,
          publishedAt: data.publishedAt,
        };
      }));
    });
    return () => unsub();
  }, []);



  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    await addDoc(collection(db, 'news'), {
      title,
      content,
      imageUrl,
      createdAt: Timestamp.now(),
      authorId: currentUser?.uid || null
    });
    setTitle('');
    setContent('');
    setImageUrl('');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-8 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-red-700 dark:text-red-300 text-center">Actualités russes</h1>
      {currentUser && (
        <form onSubmit={handleAddNews} className="mb-10 space-y-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
              placeholder="Titre de l'actualité"
              disabled={loading}
            />
            <button type="button" className="absolute right-2 top-2 px-2 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700" onClick={() => { setKeyboardTarget('title'); setShowKeyboard(v => !v); }}>{showKeyboard && keyboardTarget === 'title' ? 'Fermer' : 'Clavier russe'}</button>
            {showKeyboard && keyboardTarget === 'title' && (
              <RussianKeyboard
                onPublish={text => { setTitle(text); setShowKeyboard(false); }}
                onClose={() => setShowKeyboard(false)}
              />
            )}
          </div>
          <div className="relative">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
              placeholder="Contenu de l'actualité"
              rows={3}
              disabled={loading}
            />
            <button type="button" className="absolute right-2 top-2 px-2 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700" onClick={() => { setKeyboardTarget('content'); setShowKeyboard(v => !v); }}>{showKeyboard && keyboardTarget === 'content' ? 'Fermer' : 'Clavier russe'}</button>
            {showKeyboard && keyboardTarget === 'content' && (
              <RussianKeyboard
                onPublish={text => { setContent(text); setShowKeyboard(false); }}
                onClose={() => setShowKeyboard(false)}
              />
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
              placeholder="URL de l'image (optionnel)"
              disabled={loading}
            />
            <button type="button" className="absolute right-2 top-2 px-2 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700" onClick={() => { setKeyboardTarget('imageUrl'); setShowKeyboard(v => !v); }}>{showKeyboard && keyboardTarget === 'imageUrl' ? 'Fermer' : 'Clavier russe'}</button>
            {showKeyboard && keyboardTarget === 'imageUrl' && (
              <RussianKeyboard
                onPublish={text => { setImageUrl(text); setShowKeyboard(false); }}
                onClose={() => setShowKeyboard(false)}
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors text-lg outline-none"
            disabled={loading || !title.trim() || !content.trim()}
          >Publier une actualité</button>
        </form>
      )}
      {/* News Firestore */}
      <div className="space-y-8 mb-12">
        {news.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* News API externe */}
      <React.Fragment>
        <h2 className="text-2xl font-bold mb-6 text-center">Actualités russes (API)</h2>
        <div className="space-y-8">
          {externalNews.length === 0 && (
            <div className="text-gray-500 flex flex-col items-center">
              <img src="/favicon.svg" alt="Actualité" className="w-32 h-32 mb-4 opacity-60" />
              Aucune actualité trouvée via l'API.
            </div>
          )}
          {externalNews.map((item: NewsItem, idx: number) => (
            <a
              key={item.url || idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <NewsCard item={item} external />
            </a>
          ))}
        </div>
      </React.Fragment>


    </div>
  );
};

export default News;
