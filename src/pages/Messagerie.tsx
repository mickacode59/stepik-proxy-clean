import React, { useState, useEffect } from 'react';
import { trackEvent } from '../components/analytics';
// TODO: Remplacer par l'import réel de la fonction encrypt
const encrypt = async (text: string) => text;
import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';


const Messagerie: React.FC = () => {
  // State et hooks principaux
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [contacts, setContacts] = useState<Array<any>>([]);
  const [groups, setGroups] = useState<Array<any>>([]);
  const [file, setFile] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<number>(0);

  // Synchronisation temps réel des messages
  useEffect(() => {
    if (!selectedChatId) return;
    const q = query(collection(db, 'chats', selectedChatId, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [selectedChatId]);

  // Synchronisation temps réel des contacts
  useEffect(() => {
    const q = query(collection(db, 'contacts'));
    const unsub = onSnapshot(q, snap => {
      setContacts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Synchronisation temps réel des groupes
  useEffect(() => {
    const q = query(collection(db, 'groups'));
    const unsub = onSnapshot(q, snap => {
      setGroups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Gestion notifications (messages non lus)
  useEffect(() => {
    const unread = contacts.reduce((acc, c) => acc + (c.unread || 0), 0) + groups.reduce((acc, g) => acc + (g.unread || 0), 0);
    setNotifications(unread);
  }, [contacts, groups]);

  // Gestion typing (utilisateurs en train d'écrire)
  useEffect(() => {
    if (!selectedChatId) return;
    const typingRef = collection(db, 'chats', selectedChatId, 'typing');
    const unsub = onSnapshot(typingRef, snap => {
      setTypingUsers(snap.docs.map(doc => doc.id));
    });
    return () => unsub();
  }, [selectedChatId]);

  // Envoi de message
  const handleSend = async () => {
    if (!input.trim() || !selectedChatId || !currentUser) return;
    setLoading(true);
    await addDoc(collection(db, 'chats', selectedChatId, 'messages'), {
      text: await encrypt(input),
      userId: currentUser.uid,
      userName: currentUser.displayName,
      avatar: currentUser.photoURL,
      createdAt: Timestamp.now(),
      replyTo: replyTo?.id || null,
      fileUrl: file?.url || null,
    });
    setInput('');
    setReplyTo(null);
    setFile(null);
    setLoading(false);
    trackEvent('send_message', { chatId: selectedChatId, userId: currentUser.uid });
  };

  return (
    <main className="w-full h-screen flex bg-gradient-to-br from-gray-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" aria-label="Messagerie">
      {/* Sidebar : Conversations, Contacts, Groupes */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 flex-shrink-0 flex flex-col relative">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-900/90 z-10 shadow-sm">
          <label htmlFor="search-chat" className="sr-only">Rechercher une conversation</label>
          <input id="search-chat" type="text" placeholder="Rechercher..." className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} aria-label="Rechercher une conversation" />
          <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow">{notifications}</span>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          {[...contacts, ...groups].filter(chat => chat.name?.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
            <div key={chat.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors rounded-xl mb-1 ${selectedChatId === chat.id ? 'bg-blue-100 dark:bg-blue-950 shadow' : ''}`} onClick={() => setSelectedChatId(chat.id)} tabIndex={0} aria-label={`Ouvrir la conversation avec ${chat.name}`}> 
              <img src={chat.avatar || '/avatars/avatar1.png'} alt="avatar" className="w-12 h-12 rounded-full object-cover transition-transform duration-200 hover:scale-105 border-2 border-blue-300 dark:border-blue-800" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white text-base truncate">{chat.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</div>
              </div>
              {chat.unread > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow">{chat.unread}</span>}
            </div>
          ))}
        </div>
        {/* Floating Create Group Button */}
        <button className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors hover:scale-105" onClick={() => setShowGroupModal(true)} aria-label="Créer un groupe">
          <span className="material-icons align-middle mr-2">group_add</span>Créer un groupe
        </button>
      </aside>
      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col h-full relative" aria-label="Zone de chat">
        {/* Header du chat */}
        <header className="flex items-center gap-4 px-8 py-5 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 sticky top-0 z-10 shadow-sm">
          {selectedChatId && (
            <>
              <img src={[...contacts, ...groups].find(c => c.id === selectedChatId)?.avatar || '/avatars/avatar1.png'} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 dark:border-blue-800" loading="lazy" />
              <div className="font-semibold text-xl text-gray-900 dark:text-white truncate">{[...contacts, ...groups].find(c => c.id === selectedChatId)?.name}</div>
              <div className="ml-auto flex gap-2">
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" aria-label="Infos du groupe"><span className="material-icons">info</span></button>
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" aria-label="Ajouter un membre"><span className="material-icons">person_add</span></button>
              </div>
            </>
          )}
        </header>
        {/* Typing Indicator, Reply Preview */}
        <div className="px-8 pt-4">
          {typingUsers.length > 0 && <div className="text-xs text-blue-600 font-semibold animate-pulse">{typingUsers.join(', ')} écrit...</div>}
          {replyTo && (
            <div className="bg-blue-50 dark:bg-blue-900 rounded-xl px-4 py-2 mb-2 flex items-center justify-between shadow">
              <span className="text-xs text-blue-700 dark:text-blue-200">En réponse à : {replyTo.text}</span>
              <button className="ml-2 text-red-500 text-xs font-bold" onClick={() => setReplyTo(null)} aria-label="Annuler la réponse">Annuler</button>
            </div>
          )}
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3 bg-white/60 dark:bg-gray-900/60">
          {selectedChatId ? (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.userId === currentUser?.uid ? 'justify-end' : 'justify-start'} group`} tabIndex={0} aria-label={`Message de ${msg.userName}`}> 
                <div className={`max-w-lg px-5 py-3 rounded-3xl shadow-lg transition-all duration-200 ${msg.userId === currentUser?.uid ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'} relative`}>
                  <div className="flex items-center gap-2 mb-1">
                    <img src={msg.avatar || '/avatars/avatar1.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-blue-300 dark:border-blue-800" loading="lazy" />
                    <span className="font-semibold text-xs truncate">{msg.userName}</span>
                  </div>
                  <div className="mt-1 text-base break-words" aria-label="Contenu du message">{msg.text}</div>
                  {msg.fileUrl && <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-xs text-blue-200 underline">Fichier joint</a>}
                  {msg.replyTo && <div className="mt-2 text-xs text-blue-300">En réponse à : {messages.find(m => m.id === msg.replyTo)?.text}</div>}
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white/80 dark:bg-gray-900/80 shadow" onClick={() => setReplyTo(msg)} aria-label="Répondre à ce message"><span className="material-icons text-blue-500">reply</span></button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400" role="status" aria-live="polite">Sélectionnez une conversation</div>
          )}
        </div>
        {/* Input message */}
        {selectedChatId && (
          <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 sticky bottom-0 z-10">
            <form className="flex gap-3" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <label htmlFor="message-input" className="sr-only">Écrire un message</label>
              <input id="message-input" type="text" className="flex-1 px-5 py-3 rounded-3xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 text-base" placeholder="Écrire un message..." value={input} onChange={e => setInput(e.target.value)} disabled={loading} aria-label="Écrire un message" />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-3xl font-bold focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shadow-lg hover:scale-105" disabled={loading} aria-label="Envoyer le message">Envoyer</button>
            </form>
          </div>
        )}
        {/* Floating New Message Button (mobile) */}
        {selectedChatId && (
          <button className="md:hidden fixed bottom-6 right-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors hover:scale-105 z-50" aria-label="Nouveau message" onClick={() => document.getElementById('message-input')?.focus()}>
            <span className="material-icons align-middle">edit</span>
          </button>
        )}
      </section>
      {/* Modal création de groupe */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Créer un groupe</h2>
            {/* ...formulaire création groupe... */}
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded font-bold" onClick={() => setShowGroupModal(false)}>Annuler</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Messagerie;
