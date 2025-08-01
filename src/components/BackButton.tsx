import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC<{ label?: string }> = ({ label = 'Retour' }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => { window.scrollTo(0, 0); navigate(-1); }}
      className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors outline-none mb-4"
    >
      <ArrowLeft className="mr-2" size={20} />
      {label}
    </button>
  );
};

export default BackButton;
