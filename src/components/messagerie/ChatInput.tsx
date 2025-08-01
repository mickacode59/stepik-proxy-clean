import React, { useRef } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onAttach: (file: File) => void;
  loading?: boolean;
  typing?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onAttach, loading, typing }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <button
        type="button"
        className="px-2 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300"
        onClick={() => fileRef.current?.click()}
        title="Joindre un fichier"
      >
        <span role="img" aria-label="attach">📎</span>
      </button>
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) onAttach(e.target.files[0]); }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={typing ? 'Quelqu’un écrit...' : 'Écris un message...'}
      />
      <button
        type="button"
        disabled={loading || !value.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors outline-none"
        onClick={onSend}
      >Envoyer</button>
    </div>
  );
};

export default ChatInput;
