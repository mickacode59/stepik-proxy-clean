import React from 'react';

const LivePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Lives en direct</h1>
      <p className="mb-8 text-gray-600">Retrouvez ici tous les lives en cours ou à venir. Cliquez sur un live pour le rejoindre !</p>
      {/* Liste des lives à afficher dynamiquement ici */}
      <div className="bg-gray-100 rounded-lg p-6">Aucun live en cours pour le moment.</div>
    </div>
  );
};

export default LivePage;
