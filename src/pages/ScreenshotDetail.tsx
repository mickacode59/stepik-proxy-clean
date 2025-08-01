import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const screenshotMeta = [
  {
    src: '/screenshots/accueil.png',
    title: 'Accueil',
    desc: "Page d'accueil de la plateforme, accès rapide à toutes les fonctionnalités."
  },
  {
    src: '/screenshots/cours.png',
    title: 'Cours',
    desc: "Catalogue des cours interactifs, progression et suivi."
  },
  {
    src: '/screenshots/profil.png',
    title: 'Profil',
    desc: "Profil utilisateur, badges, niveau et personnalisation."
  },
  {
    src: '/screenshots/community.png',
    title: 'Communauté',
    desc: "Espace d'échange, posts, amis et motivation collective."
  },
  {
    src: '/screenshots/settings.png',
    title: 'Paramètres',
    desc: "Gestion des préférences, confidentialité et sécurité."
  },
];

const ScreenshotDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idx = Number(id);
  const meta = screenshotMeta[idx];

  if (!meta) {
    return <div className="max-w-xl mx-auto mt-24 text-center text-gray-600">Image non trouvée.</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <button onClick={() => navigate(-1)} className="mb-8 px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow hover:bg-gray-300 dark:hover:bg-gray-700">Retour</button>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center max-w-2xl w-full">
        <img src={meta.src} alt={meta.title} className="w-full max-w-lg rounded-xl mb-6 shadow-lg object-cover" style={{ maxHeight: '480px' }} />
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{meta.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">{meta.desc}</p>
      </div>
    </main>
  );
};

export default ScreenshotDetail;
