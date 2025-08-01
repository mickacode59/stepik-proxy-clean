import React from 'react';

interface UpdateDialogProps {
  open: boolean;
  onClose: () => void;
  updates: string[];
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ open, onClose, updates }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Nouveautés sur myrusse</h3>
        <ul className="mb-4 list-disc pl-5 text-gray-700 dark:text-gray-200">
          {updates.map((update, i) => (
            <li key={i}>{update}</li>
          ))}
        </ul>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default UpdateDialog;
