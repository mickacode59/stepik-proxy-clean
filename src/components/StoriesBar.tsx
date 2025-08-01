import React, { useEffect, useState, useRef } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Story {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  content: string;
  type: 'image' | 'video' | 'text';
  mediaUrl?: string;
  createdAt: any;
  views?: string[];
  reactions?: { [emoji: string]: string[] };
}

const StoriesBar: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [storyTimer, setStoryTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reactionAnim, setReactionAnim] = useState<string | null>(null);
  // Auto-play stories (timer)
  useEffect(() => {
    if (!fullscreen || !isPlaying) return;
    setStoryTimer(0);
    const duration = 5000; // 5s par story
    const interval = setInterval(() => {
      setStoryTimer(t => {
        if (t >= duration) {
          clearInterval(interval);
          if (activeIndex < stories.length - 1) {
            setActiveIndex(i => i + 1);
            setStoryTimer(0);
          } else {
            setFullscreen(false);
            setIsPlaying(false);
          }
        }
        return t + 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [fullscreen, isPlaying, activeIndex, stories.length]);
  const storyBarRef = useRef<HTMLDivElement>(null);
  // Swipe navigation
  // Swipe mobile & desktop
  useEffect(() => {
    const ref = storyBarRef.current;
    if (!ref) return;
    let startX = 0;
    let deltaX = 0;
    let isDragging = false;
    // Touch events (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      deltaX = e.touches[0].clientX - startX;
    };
    const handleTouchEnd = () => {
      if (!isDragging) return;
      if (deltaX > 50) setActiveIndex(i => Math.max(0, i - 1));
      if (deltaX < -50) setActiveIndex(i => Math.min(stories.length - 1, i + 1));
      startX = 0; deltaX = 0; isDragging = false;
    };
    // Mouse events (desktop)
    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      isDragging = true;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      deltaX = e.clientX - startX;
    };
    const handleMouseUp = () => {
      if (!isDragging) return;
      if (deltaX > 50) setActiveIndex(i => Math.max(0, i - 1));
      if (deltaX < -50) setActiveIndex(i => Math.min(stories.length - 1, i + 1));
      startX = 0; deltaX = 0; isDragging = false;
    };
    ref.addEventListener('touchstart', handleTouchStart);
    ref.addEventListener('touchmove', handleTouchMove);
    ref.addEventListener('touchend', handleTouchEnd);
    ref.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      ref.removeEventListener('touchstart', handleTouchStart);
      ref.removeEventListener('touchmove', handleTouchMove);
      ref.removeEventListener('touchend', handleTouchEnd);
      ref.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [stories]);
  // Suppression d'une story
  const handleDelete = async (storyId: string) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'stories', storyId), { content: '[supprimé]', mediaUrl: '', type: 'text' });
  };
  const [newStory, setNewStory] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [type, setType] = useState<'image' | 'video' | 'text'>('text');

  // Charger les stories récentes (moins de 24h)
  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      setStories(snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Story))
        .filter(story => now - (story.createdAt?.seconds ? story.createdAt.seconds * 1000 : story.createdAt) < 24 * 3600 * 1000)
      );
    });
    return () => unsub();
  }, []);

  // Animation de transition automatique
  useEffect(() => {
    if (stories.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % stories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stories]);
  // Marquer la vue sur la story active
  useEffect(() => {
    if (!currentUser || !stories[activeIndex]) return;
    const story = stories[activeIndex];
    if (!story.views?.includes(currentUser.uid)) {
      updateDoc(doc(db, 'stories', story.id), { views: arrayUnion(currentUser.uid) });
    }
  }, [activeIndex, currentUser, stories]);
  // Réagir à une story
  const handleReact = async (storyId: string, emoji: string) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'stories', storyId), {
      [`reactions.${emoji}`]: arrayUnion(currentUser.uid)
    });
  };

  // Publier une nouvelle story
  const handleStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) return;
    await addDoc(collection(db, 'stories'), {
      userId: currentUser.uid,
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL,
      content: newStory,
      type,
      mediaUrl,
      createdAt: Timestamp.now(),
    });
    setNewStory('');
    setMediaUrl('');
    setType('text');
  };

  return (
    <div className="mb-8">
      <div ref={storyBarRef} className="flex gap-4 overflow-x-auto pb-2">
        {stories.length > 0 && (
          <>
            {/* Miniatures stories Instagram style */}
            {stories.map((story, i) => (
              <div key={story.id}
                className={`flex flex-col items-center w-20 cursor-pointer transition-all duration-500 ${i === activeIndex ? 'scale-110 shadow-2xl z-10 animate-story-zoom' : 'opacity-60'} animate-story-fade`}
                style={{transform: `translateX(${(i-activeIndex)*30}px)`}}
                onClick={() => {setActiveIndex(i); setFullscreen(true);}}>
                <img src={story.photoURL || '/avatars/avatar1.png'} alt={story.displayName} className={`w-16 h-16 rounded-full border-4 ${i === activeIndex ? 'border-pink-500' : 'border-blue-400'} object-cover transition-all duration-500`} />
                <div className="mt-1 text-xs font-medium text-blue-700">{story.displayName}</div>
              </div>
            ))}
            {/* Ajout story */}
            {currentUser && (
              <form onSubmit={handleStory} className="flex flex-col items-center w-20">
                <img src={userProfile?.photoURL || userProfile?.avatar || '/avatars/avatar1.png'} alt="Moi" className="w-16 h-16 rounded-full border-4 border-green-400 object-cover" />
                <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 text-xs rounded px-2 py-1">
                  <option value="text">Texte</option>
                  <option value="image">Image (URL)</option>
                  <option value="video">Vidéo (URL)</option>
                </select>
                {type === 'text' && (
                  <textarea value={newStory} onChange={e => setNewStory(e.target.value)} className="mt-1 w-20 h-10 text-xs rounded p-1" placeholder="Ta story..." />
                )}
                {(type === 'image' || type === 'video') && (
                  <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="mt-1 w-20 text-xs rounded p-1" placeholder="URL média" />
                )}
                <button type="submit" className="mt-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Publier</button>
              </form>
            )}
            {/* Affichage plein écran story */}
            {fullscreen && stories[activeIndex] && (
              <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-story-fade">
                {/* Timer barre Instagram style */}
                <div className="absolute top-0 left-0 w-full h-2 flex gap-1 px-4 pt-4 z-50">
                  {stories.map((_, i) => (
                    <div key={i} className="flex-1 h-2 rounded-full bg-gray-400 overflow-hidden">
                      <div className={`h-2 rounded-full ${i < activeIndex ? 'bg-pink-500' : i === activeIndex ? 'bg-pink-500' : 'bg-gray-400'}`}
                        style={i === activeIndex ? {width: `${Math.min(100, storyTimer/50)}%`, transition:'width 0.1s'} : {width: i < activeIndex ? '100%' : '0%'}} />
                    </div>
                  ))}
                </div>
                <button className="absolute top-6 right-8 text-white text-3xl" onClick={() => {setFullscreen(false); setIsPlaying(false);}}>×</button>
                <div className="flex flex-col items-center w-full max-w-xs bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 relative animate-story-slide">
                  <img src={stories[activeIndex].photoURL || '/avatars/avatar1.png'} alt={stories[activeIndex].displayName} className="w-20 h-20 rounded-full border-4 border-pink-500 object-cover mb-2 animate-story-zoom" />
                  <div className="text-lg font-bold text-pink-600 mb-2">{stories[activeIndex].displayName}</div>
                  {stories[activeIndex].type === 'image' && stories[activeIndex].mediaUrl && <img src={stories[activeIndex].mediaUrl} alt="story" className="w-full h-64 rounded-xl object-cover mb-2 animate-story-slide" />}
                  {stories[activeIndex].type === 'video' && stories[activeIndex].mediaUrl && <video src={stories[activeIndex].mediaUrl} controls className="w-full h-64 rounded-xl mb-2 animate-story-slide" />}
                  {stories[activeIndex].type === 'text' && <div className="mb-2 text-base text-gray-700 bg-pink-50 rounded p-3 animate-story-fade">{stories[activeIndex].content}</div>}
                  {/* Réactions animées */}
                  <div className="flex gap-3 mt-2">
                    {['👍','😂','❤️','😮','😢','😡'].map(emoji => (
                      <button key={emoji} className={`text-2xl transition-transform duration-200 ${reactionAnim === emoji ? 'scale-150 animate-pop' : ''}`}
                        onClick={() => {
                          setReactionAnim(emoji);
                          handleReact(stories[activeIndex].id, emoji);
                          setTimeout(() => setReactionAnim(null), 400);
                        }}>
                        {emoji} {stories[activeIndex].reactions?.[emoji]?.length ? <span className="text-xs">{stories[activeIndex].reactions[emoji].length}</span> : null}
                      </button>
                    ))}
                  </div>
                  {/* Vues */}
                  <div className="text-xs text-gray-500 mt-2">{stories[activeIndex].views?.length || 0} vues</div>
                  {/* Pagination stories & auto-play controls */}
                  <div className="flex gap-2 mt-4 items-center">
                    <button disabled={activeIndex === 0} onClick={() => {setActiveIndex(i => Math.max(0, i - 1)); setStoryTimer(0);}} className="px-2 py-1 rounded bg-gray-200 text-gray-700">◀</button>
                    <button disabled={activeIndex === stories.length - 1} onClick={() => {setActiveIndex(i => Math.min(stories.length - 1, i + 1)); setStoryTimer(0);}} className="px-2 py-1 rounded bg-gray-200 text-gray-700">▶</button>
                    <button onClick={() => setIsPlaying(p => !p)} className="ml-2 px-2 py-1 rounded bg-pink-500 text-white text-xs">{isPlaying ? 'Pause' : 'Auto-play'}</button>
                  </div>
                  {/* Suppression story */}
                  {currentUser?.uid === stories[activeIndex].userId && (
                    <button className="absolute top-2 right-2 text-xs bg-red-600 text-white rounded px-2 py-1" onClick={() => {handleDelete(stories[activeIndex].id); setFullscreen(false); setIsPlaying(false);}}>Supprimer</button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {/* Ajout story */}
        {currentUser && (
          <form onSubmit={handleStory} className="flex flex-col items-center w-24">
            <img src={userProfile?.photoURL || userProfile?.avatar || '/avatars/avatar1.png'} alt="Moi" className="w-16 h-16 rounded-full border-4 border-green-400 object-cover" />
            <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 text-xs rounded px-2 py-1">
              <option value="text">Texte</option>
              <option value="image">Image (URL)</option>
              <option value="video">Vidéo (URL)</option>
            </select>
            {type === 'text' && (
              <textarea value={newStory} onChange={e => setNewStory(e.target.value)} className="mt-1 w-20 h-10 text-xs rounded p-1" placeholder="Ta story..." />
            )}
            {(type === 'image' || type === 'video') && (
              <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="mt-1 w-20 text-xs rounded p-1" placeholder="URL média" />
            )}
            <button type="submit" className="mt-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Publier</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoriesBar;
