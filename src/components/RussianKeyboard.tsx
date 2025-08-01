import React, { useState } from 'react';

const RUSSIAN_KEYS = [
  ['Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ'],
  ['Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э'],
  ['Я','Ч','С','М','И','Т','Ь','Б','Ю'],
];

interface RussianKeyboardProps {
  onPublish: (text: string) => void;
  onClose: () => void;
}

const RussianKeyboard: React.FC<RussianKeyboardProps> = ({ onPublish, onClose }) => {
  const [input, setInput] = useState('');

  return (
    <div className="relative mt-2 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-4 z-50 border border-gray-300 dark:border-gray-700 flex flex-col items-center w-full max-w-md">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="mb-3 w-full px-4 py-3 text-xl rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white shadow"
        lang="ru"
        inputMode="text"
        placeholder="Écris en russe..."
        autoFocus
      />
      <div className="flex flex-col gap-2 mb-3 w-full">
        {RUSSIAN_KEYS.map((row, i) => (
          <div key={i} className="flex gap-2 justify-center">
            {row.map(key => (
              <button
                key={key}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xl font-bold text-gray-900 dark:text-white hover:bg-red-200 dark:hover:bg-red-700 transition-colors shadow-sm"
                onClick={() => setInput(prev => prev + key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-2 w-full mt-2">
        <button
          className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow"
          onClick={() => { if (input.trim()) { onPublish(input); setInput(''); } }}
        >
          Publier
        </button>
        <button
          className="flex-1 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors text-base shadow"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default RussianKeyboard;

