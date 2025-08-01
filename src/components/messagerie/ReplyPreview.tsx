import React from 'react';

interface ReplyPreviewProps {
  replyTo: { userName: string; text: string } | null;
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ replyTo, onCancel }) => {
  if (!replyTo) return null;
  return (
    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2 mb-2">
      <span className="font-semibold text-blue-600 dark:text-blue-300">{replyTo.userName}:</span>
      <span className="text-sm text-gray-700 dark:text-gray-200">{replyTo.text}</span>
      <button className="ml-auto text-xs text-red-500" onClick={onCancel}>Annuler</button>
    </div>
  );
};

export default ReplyPreview;
