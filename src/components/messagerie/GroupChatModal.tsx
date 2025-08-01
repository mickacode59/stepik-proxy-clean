import React, { useState } from 'react';

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, members: string[]) => void;
  users: { id: string; name: string; avatar: string }[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, onCreate, users }) => {
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelected(selected =>
      selected.includes(id) ? selected.filter(u => u !== id) : [...selected, id]
    );
  };

  const handleCreate = () => {
    if (groupName && selected.length > 1) {
      onCreate(groupName, selected);
      setGroupName('');
      setSelected([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Créer un groupe</h2>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 rounded border"
          placeholder="Nom du groupe"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
        <div className="mb-4 max-h-40 overflow-y-auto">
          {users.map(u => (
            <label key={u.id} className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => handleToggle(u.id)}
                className="accent-blue-600"
              />
              <img src={u.avatar} alt="avatar" className="w-8 h-8 rounded-full border" />
              <span>{u.name}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={onClose}>Annuler</button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold disabled:opacity-50"
            disabled={!groupName || selected.length < 2}
            onClick={handleCreate}
          >Créer</button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
