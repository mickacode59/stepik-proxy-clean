import React from 'react';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Date | { toDate: () => Date } | string;
  avatar: string;
  reactions?: { [emoji: string]: string[] };
  readBy?: string[];
  fileUrl?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  onReact: (msgId: string, emoji: string) => void;
  onDelete: (msgId: string) => void;
  onEdit: (msgId: string, newText: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId, onReact, onDelete, onEdit }) => (
  <div className="flex-1 overflow-y-auto px-4 py-6">
    <div className="max-w-2xl mx-auto">
      {messages.map(msg => (
        <div key={msg.id} className={`flex items-end mb-4 ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
          {msg.userId !== currentUserId && (
            <img src={msg.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-2 border" />
          )}
          <div className={`rounded-2xl px-4 py-2 shadow-lg text-base max-w-xs relative ${msg.userId === currentUserId ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'}`}>
            <div className="font-semibold text-sm mb-1">{msg.userName}</div>
            <div>{msg.text}</div>
            {msg.fileUrl && (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500 underline">Fichier joint</a>
            )}
            <div className="flex gap-2 mt-2">
              {['👍','😂','❤️','😮','😢','😡'].map(emoji => (
                <button key={emoji} className="text-xl" onClick={() => onReact(msg.id, emoji)}>
                  {emoji} {msg.reactions?.[emoji]?.length ? <span className="text-xs">{msg.reactions[emoji].length}</span> : null}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {msg.userId === currentUserId && (
                <>
                  <button className="text-xs text-gray-400 hover:text-blue-600" onClick={() => onEdit(msg.id, msg.text)}>Éditer</button>
                  <button className="text-xs text-gray-400 hover:text-red-600" onClick={() => onDelete(msg.id)}>Supprimer</button>
                </>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">{
              typeof msg.createdAt === 'object' && typeof (msg.createdAt as any).toDate === 'function'
                ? (msg.createdAt as any).toDate().toLocaleTimeString()
                : typeof msg.createdAt === 'string'
                  ? msg.createdAt
                  : msg.createdAt instanceof Date
                    ? msg.createdAt.toLocaleTimeString()
                    : ''
            }</div>
            {msg.readBy && (
              <div className="text-xs text-green-500 mt-1">Vu par {msg.readBy.length}</div>
            )}
          </div>
          {msg.userId === currentUserId && (
            <img src={msg.avatar} alt="avatar" className="w-10 h-10 rounded-full ml-2 border" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ChatMessages;
