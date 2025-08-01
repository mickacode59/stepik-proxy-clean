import React from 'react';

interface MessageActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({ onEdit, onDelete, onReply }) => (
  <div className="flex gap-2 mt-1">
    <button className="text-xs text-blue-500 hover:underline" onClick={onReply}>Répondre</button>
    <button className="text-xs text-gray-400 hover:text-blue-600" onClick={onEdit}>Éditer</button>
    <button className="text-xs text-gray-400 hover:text-red-600" onClick={onDelete}>Supprimer</button>
  </div>
);

export default MessageActions;
