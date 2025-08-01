import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
// Images à défiler (remplace les URLs par tes propres screenshots ou illustrations)
const carouselImages = [
  // Images réelles hébergées sur Firestore Storage (exemples, à remplacer par tes vraies URLs)
  'https://firebasestorage.googleapis.com/v0/b/myrusse-2826d.appspot.com/o/screenshots%2Faccueil.png?alt=media',
  'https://firebasestorage.googleapis.com/v0/b/myrusse-2826d.appspot.com/o/screenshots%2Fcours.png?alt=media',
  'https://firebasestorage.googleapis.com/v0/b/myrusse-2826d.appspot.com/o/screenshots%2Fprofil.png?alt=media',
  'https://firebasestorage.googleapis.com/v0/b/myrusse-2826d.appspot.com/o/screenshots%2Fcommunity.png?alt=media',
  'https://firebasestorage.googleapis.com/v0/b/myrusse-2826d.appspot.com/o/screenshots%2Fsettings.png?alt=media',
];
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, Flame, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: <BookOpen size={32} className="text-red-500" />,
    title: 'Cours interactifs',
    desc: 'Des leçons ludiques, des quiz, de la pratique orale et écrite, pour progresser chaque jour.'
  },
  {
    icon: <Award size={32} className="text-yellow-500" />,
    title: 'Badges & Récompenses',
    desc: 'Débloquez des badges, gagnez des récompenses et suivez votre progression.'
  },
  {
    icon: <Flame size={32} className="text-orange-500" />,
    title: 'Séries & Motivation',
    desc: 'Gardez votre motivation avec des séries quotidiennes et des défis personnalisés.'
  },
  {
    icon: <Users size={32} className="text-blue-500" />,
    title: 'Communauté active',
    desc: 'Partagez vos progrès, échangez avec d’autres apprenants et trouvez des amis.'
  },
  {
    icon: <Star size={32} className="text-purple-500" />,
    title: 'Pour tous les niveaux',
    desc: 'Débutant ou avancé, trouvez des cours adaptés à votre niveau et vos objectifs.'
  },
];

const siteMap = [
  { title: 'Découvrir les cours', desc: 'Explorez le catalogue et trouvez le cours parfait pour vous.' },
  { title: 'Suivre sa progression', desc: 'Visualisez vos progrès, vos badges et vos séries.' },
  { title: 'Défis & gamification', desc: 'Relevez des défis quotidiens et gagnez des récompenses.' },
  { title: 'Communauté', desc: 'Participez, partagez, trouvez des amis et motivez-vous ensemble.' },
  { title: 'Paramètres & confidentialité', desc: 'Contrôlez vos données et votre expérience.' },
];

const PresentationCours: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Carrousel d'images
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col">
      <BackButton />
      <header className="w-full py-8 px-4 sm:px-8 flex flex-col items-center text-center">
        {/* Carrousel d'images */}
        <div className="relative w-full max-w-3xl h-64 sm:h-80 mx-auto mb-8 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
          {carouselImages.map((img, i) => (
            <img
              key={img}
              src={img}
              alt={"Aperçu du site " + (i + 1)}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${i === carouselIndex ? 'opacity-100 z-10 cursor-pointer' : 'opacity-0 z-0'}`}
              draggable={false}
              onClick={() => window.location.href = `/screenshot/${i}`}
              style={{ cursor: i === carouselIndex ? 'pointer' : 'default' }}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/favicon.svg'; }}
            />
          ))}
          {/* Points de navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${i === carouselIndex ? 'bg-red-600 border-red-600 scale-125' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
                onClick={() => setCarouselIndex(i)}
                aria-label={`Voir l'image ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Apprends le russe <span className="text-red-600">en t’amusant</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-6">
          Rejoins la plateforme la plus moderne pour progresser en russe, motivé par la gamification, la communauté et des outils inspirés des meilleurs (Duolingo, Snapchat...)
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          {!currentUser && (
            <>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl text-lg shadow-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
              >
                Commencer gratuitement
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-red-600 dark:text-white font-bold rounded-xl text-lg shadow-lg border border-red-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
              >
                Se connecter
              </button>
            </>
          )}
          {currentUser && (
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl text-lg shadow-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
            >
              Accéder aux cours
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8">
        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
              {f.icon}
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Plan du site */}
        <section className="my-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Ce que tu peux faire ici</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteMap.map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-red-100 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-1">{item.title}</h4>
                <p className="text-gray-700 dark:text-gray-200 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        {!currentUser && (
          <div className="my-16 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Prêt à te lancer ?</h3>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-red-600 text-white font-bold rounded-xl text-xl shadow-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
            >
              Je m’inscris gratuitement
            </button>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Aucun paiement requis. Rejoins la communauté en 1 clic !</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PresentationCours;
