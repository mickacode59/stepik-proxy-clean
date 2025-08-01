import React from 'react';

interface FilePreviewProps {
  file: File | null;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  if (!file) return null;
  const isImage = file.type.startsWith('image/');
  const url = URL.createObjectURL(file);

  return (
    <div className="flex items-center gap-2 mt-2 mb-2">
      {isImage ? (
        <img src={url} alt={file.name} className="w-16 h-16 object-cover rounded border" />
      ) : (
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 4h8m-8 4h8m-8 4h8" />
          </svg>
          <span className="text-xs">{file.name}</span>
        </div>
      )}
      <button className="text-xs text-red-500 ml-2" onClick={onRemove}>Retirer</button>
    </div>
  );
};

export default FilePreview;
