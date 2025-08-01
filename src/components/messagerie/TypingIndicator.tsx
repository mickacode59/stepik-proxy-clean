import React from 'react';

interface TypingIndicatorProps {
  users: { id: string; name: string }[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (!users.length) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300 mt-2 mb-2">
      <span>
        {users.length === 1
          ? `${users[0].name} écrit...`
          : `${users.map(u => u.name).join(', ')} écrivent...`}
      </span>
      <span className="animate-bounce">•••</span>
    </div>
  );
};

export default TypingIndicator;
