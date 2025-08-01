import React from 'react';

interface UnreadBadgeProps {
  count: number;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count <= 0) return null;
  return (
    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
      {count}
    </span>
  );
};

export default UnreadBadge;
