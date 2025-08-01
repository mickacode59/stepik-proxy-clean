import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useParams } from 'react-router-dom';
// ...existing code...
import { db } from '../config/firebase';
import type { User } from '../types';
import StatsCard from '../components/Dashboard/StatsCard';
import { BookOpen, Clock, Trophy, Target } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const handleOpenPost = (post: any) => {
    setCommentInput("");
    setSelectedPost(post);
    setShowPostModal(true);
  };
  const handleClosePost = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };
  const handleLikePost = (postIdx: number) => {
  // Ici, vous pouvez ajouter la logique Firestore pour liker
  if (!profile || !profile.posts || postIdx < 0 || postIdx >= profile.posts.length) return;
  const updatedPosts = [...profile.posts];
  // likes is an array of user ids, so we push currentUser.id if not already present
  if (currentUser && !updatedPosts[postIdx].likes?.includes(currentUser.id)) {
    updatedPosts[postIdx].likes = [...(updatedPosts[postIdx].likes || []), currentUser.id];
    setProfile({ ...profile, posts: updatedPosts });
    // Optionally, update Firestore here
    // const postRef = doc(db, 'users', profile.id, 'posts', updatedPosts[postIdx].id);
    // await updateDoc(postRef, { likes: updatedPosts[postIdx].likes });
  }
};

const handlePublishComment = async () => {
  if (!selectedPost || !profile || !currentUser || !commentInput.trim() || !profile.posts) return;
  setCommentLoading(true);
  try {
    // Ajout du commentaire dans Firestore (dans le sous-document du post)
    // On suppose que chaque post a un id unique (selectedPost.id)
    const postRef = doc(db, 'users', profile.id, 'posts', selectedPost.id);
    await updateDoc(postRef, {
      comments: [...(selectedPost.comments || []), {
        user: currentUser.displayName,
        text: commentInput,
        date: new Date().toISOString(),
      }]
    });
    // Mise à jour locale instantanée
    const updatedPosts = profile.posts.map((p: any) =>
      p.id === selectedPost.id
        ? { ...p, comments: [...(p.comments || []), { user: currentUser.displayName, text: commentInput, date: new Date().toISOString() }] }
        : p
    );
    setProfile({ ...profile, posts: updatedPosts });
    setSelectedPost({ ...selectedPost, comments: [...(selectedPost.comments || []), { user: currentUser.displayName, text: commentInput, date: new Date().toISOString() }] });
    setCommentInput("");
  } catch (e) {
    alert("Erreur lors de la publication du commentaire");
  }
  setCommentLoading(false);
};
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [currentUser] = useState<User | null>(null);
  // ...fetch currentUser from context or Firestore...

  useEffect(() => {
    if (!id) return;
    const userRef = doc(db, 'users', id);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id, ...docSnap.data() } as User);
      } else {
        setProfile(null);
      }
    });
    // ...fetch currentUser logic here...
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!profile || !currentUser) return;
    setIsFriend((currentUser.friends || []).includes(profile.id));
  }, [profile, currentUser]);

  // Ajouter en ami
  const handleAddFriend = async () => {
    if (!currentUser || !profile) return;
    const userRef = doc(db, 'users', currentUser.id);
    await updateDoc(userRef, { friends: [...(currentUser.friends || []), profile.id] });
  };

  // Inviter dans un cours (exemple)
  // ...existing code...

  // Envoyer un message (redirection)
  const handleSendMessage = () => {
    if (profile) {
      window.location.href = `/messagerie?to=${profile.id}`;
    }
  };

  if (!profile) return <div className="p-8">Profil introuvable.</div>;
  if (profile.isPrivate && !isFriend && currentUser?.id !== profile.id) {
    return <div className="p-8">Ce profil est privé.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
      {/* Header Instagram style */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-8">
        <img src={profile.photoURL || profile.avatar || '/avatars/avatar1.png'} alt={profile.displayName} className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{profile.displayName}</h1>
            {currentUser?.id !== profile.id && !isFriend && (
              <button className="px-4 py-1 bg-blue-600 text-white rounded-full font-semibold" onClick={handleAddFriend}>Suivre</button>
            )}
            {currentUser?.id !== profile.id && isFriend && (
              <button className="px-4 py-1 bg-gray-300 text-gray-800 rounded-full font-semibold" onClick={handleAddFriend}>Abonné</button>
            )}
            {currentUser?.id !== profile.id && (
              <button className="px-4 py-1 bg-green-600 text-white rounded-full font-semibold" onClick={handleSendMessage}>Message</button>
            )}
            <button className="px-4 py-1 bg-purple-600 text-white rounded-full font-semibold" onClick={() => window.location.href = '/dashboard'}>Tableau de bord</button>
            <button className="px-4 py-1 bg-red-600 text-white rounded-full font-semibold" onClick={() => window.location.href = '/live?mode=start'}>Passer en live</button>
            <button className="px-4 py-1 bg-orange-500 text-white rounded-full font-semibold" onClick={() => window.location.href = '/live'}>Voir les lives</button>
          </div>
          <p className="text-gray-600 text-base">{profile.bio}</p>
          <div className="flex gap-8 mt-2">
            <span className="font-bold">{profile.stats?.posts || 0}</span> <span className="text-gray-500">posts</span>
            <span className="font-bold">{profile.stats?.followers || 0}</span> <span className="text-gray-500">abonnés</span>
            <span className="font-bold">{profile.stats?.following || 0}</span> <span className="text-gray-500">abonnements</span>
          </div>
        </div>
      </div>
      {/* Stories bandeau */}
      <div className="flex gap-4 py-6 overflow-x-auto">
        {(profile.stories || []).map((story: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center">
            <img src={story.image} alt="story" className="w-16 h-16 rounded-full border-2 border-pink-400 object-cover" />
            <span className="text-xs mt-1">{story.title}</span>
          </div>
        ))}
      </div>
      {/* Grille de posts Instagram */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6">
        {(Array.isArray(profile.posts) ? profile.posts : []).map((post: any, idx: number) => (
          <div key={idx} className="relative group cursor-pointer" onClick={() => handleOpenPost(post)}>
            <img src={post.image} alt="post" className="w-full h-40 object-cover rounded-lg shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition">
              <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100">❤ {Array.isArray(post.likes) ? post.likes.length : 0}</span>
            </div>
            <div className="absolute bottom-2 left-2 flex gap-2 items-center">
              <span className="bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs text-pink-600 font-bold">❤ {Array.isArray(post.likes) ? post.likes.length : 0}</span>
              <span className="bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs text-gray-700 font-bold">💬 {Array.isArray(post.comments) ? post.comments.length : 0}</span>
            </div>
          </div>
        ))}
        {(!Array.isArray(profile.posts) || profile.posts.length === 0) && (
          <div className="col-span-3 text-center text-gray-400 py-8">Aucun post pour le moment</div>
        )}
      </div>
      {/* Modale d'affichage du post Instagram */}
      {showPostModal && selectedPost && (
        <Dialog open={showPostModal} onClose={handleClosePost} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-900" onClick={handleClosePost}>✕</button>
            <img src={selectedPost.image} alt="post" className="w-full h-64 object-cover rounded-lg mb-4" />
            <div className="flex items-center gap-4 mb-2">
              <span className="font-bold text-lg">{profile.displayName}</span>
              <span className="text-gray-400 text-xs">{selectedPost.date ? new Date(selectedPost.date).toLocaleDateString() : ''}</span>
            </div>
            <p className="mb-4 text-gray-700">{selectedPost.caption}</p>
            <div className="flex gap-4 items-center mb-4">
              <button className="px-3 py-1 bg-pink-500 text-white rounded-full font-bold" onClick={() => handleLikePost(Array.isArray(profile.posts) ? profile.posts.findIndex((p: any) => p.id === selectedPost.id) : -1)}>❤ {selectedPost.likes || 0}</button>
              <span className="text-gray-700">💬 {Array.isArray(selectedPost.comments) ? selectedPost.comments.length : 0} commentaires</span>
            </div>
            <div className="max-h-32 overflow-y-auto mb-2">
              {(selectedPost.comments || []).map((comment: any, idx: number) => (
                <div key={idx} className="mb-2">
                  <span className="font-bold text-sm text-pink-700">{comment.user}</span>
                  <span className="ml-2 text-gray-600 text-sm">{comment.text}</span>
                </div>
              ))}
              {(selectedPost.comments || []).length === 0 && <div className="text-gray-400">Aucun commentaire</div>}
            </div>
            {/* Ajout d'un commentaire (non connecté à Firestore ici) */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Ajouter un commentaire..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                disabled={commentLoading}
              />
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-full font-bold"
                onClick={handlePublishComment}
                disabled={commentLoading || !commentInput.trim()}
              >
                {commentLoading ? "..." : "Publier"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
      {/* Stats cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatsCard title="Leçons terminées" value={profile.stats?.totalLessonsCompleted || 0} icon={BookOpen} color="blue" />
        <StatsCard title="Temps d'étude" value={`${Math.floor((profile.stats?.totalTimeSpent || 0) / 60)}h`} icon={Clock} color="green" />
        <StatsCard title="Quiz histoire russe" value={profile.stats?.coursesCompleted || 0} icon={Trophy} color="yellow" />
        <StatsCard title="Score moyen quiz" value={profile.stats?.averageScore || 0} icon={Target} color="red" />
      </div>
      {/* Badges */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Badges</h3>
        <div className="flex flex-wrap gap-4">
          {(Array.isArray(profile.badges)
            ? profile.badges.filter((b: any) => typeof b === 'object' && b !== null && 'id' in b && 'name' in b)
            : []).map((badge: any) => (
            <div key={badge.id} className="flex flex-col items-center bg-yellow-50 rounded-xl p-4 shadow border border-yellow-200">
              <span className="text-3xl mb-2">{badge.icon}</span>
              <span className="font-bold text-yellow-800">{badge.name}</span>
              <span className="text-xs text-yellow-700">{badge.description}</span>
              <span className="text-xs text-gray-400 mt-1">{new Date(badge.earnedAt).toLocaleDateString()}</span>
            </div>
          ))}
          {(profile.badges || []).length === 0 && <span className="text-gray-400">Aucun badge pour le moment</span>}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
