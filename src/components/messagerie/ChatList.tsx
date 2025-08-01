import React from 'react';

interface ChatListProps {
  chats: Array<{ id: string; name: string; avatar: string; lastMessage: string; unread: number; type: 'group' | 'private'; }>; 
  selectedChatId: string | null;
  onSelect: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelect }) => (
  <div className="w-full max-w-xs bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
    <div className="p-4 font-bold text-lg text-blue-600 dark:text-blue-300">Messagerie</div>
    {chats.map(chat => (
      <button
        key={chat.id}
        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${selectedChatId === chat.id ? 'bg-blue-100 dark:bg-gray-800' : ''}`}
        onClick={() => onSelect(chat.id)}
      >
        <img src={chat.avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
        <div className="flex-1 text-left">
          <div className="font-semibold text-base">{chat.name}</div>
          <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
        </div>
        {chat.unread > 0 && (
          <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 font-bold">{chat.unread}</span>
        )}
        {chat.type === 'group' && <span className="ml-2 text-xs bg-blue-200 text-blue-700 rounded px-2">Groupe</span>}
      </button>
    ))}
  </div>
);

export default ChatList;
