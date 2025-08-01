// ...imports...
// ...existing code...
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, BookOpen } from 'lucide-react';
import { useDocumentTitle } from '../components/useDocumentTitle';
import { monuments } from '../data/monuments';
// Données locales pour features et testimonials
const features = [
  {
    title: '15,000+ Cours',
    description: 'Accédez à des milliers de cours interactifs pour tous niveaux.',
    icon: BookOpen,
  },
  {
    title: 'Communauté Active',
    description: 'Discutez, échangez et progressez avec d’autres apprenants.',
    icon: PlayCircle,
  },
  {
    title: 'Progression Personnalisée',
    description: 'Suivez votre évolution et atteignez vos objectifs à votre rythme.',
    icon: BookOpen,
  },
];

import React, { useState } from 'react';


const defaultTestimonials = [
  {
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    text: 'Super plateforme, j’ai progressé très vite en russe !',
    level: 'Débutante',
  },
  {
    name: 'Boris',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    text: 'La communauté est très motivante et les cours sont variés.',
    level: 'Intermédiaire',
  },
  {
    name: 'Irina',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    text: 'J’adore les exercices interactifs et le suivi personnalisé.',
    level: 'Avancée',
  },
];

// Composant minimal pour afficher un témoignage
const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center">
    <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4" />
    <h4 className="text-lg font-semibold mb-2">{testimonial.name}</h4>
    <p className="text-gray-600 dark:text-gray-400 mb-2 italic">{testimonial.level}</p>
    <p className="text-gray-800 dark:text-gray-200">{testimonial.text}</p>
  </div>
);

const Home: React.FC = () => {
  useDocumentTitle('Accueil - myrusse');
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingComment, setPendingComment] = useState({ name: '', text: '', level: '' });
  const [form, setForm] = useState({ name: '', text: '', level: '' });
  // ...existing code...

  const handleStart = () => {
    window.scrollTo(0, 0);
    navigate('/courses');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingComment(form);
    setShowConsent(true);
  };

  const handleConsent = (accept: boolean) => {
    setShowConsent(false);
    if (accept) {
      setTestimonials([
        {
          name: pendingComment.name || 'Anonyme',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pendingComment.name || 'user')}`,
          text: pendingComment.text,
          level: pendingComment.level || 'Utilisateur',
        },
        ...testimonials,
      ]);
      setForm({ name: '', text: '', level: '' });
    }
  };

  return (
    <main aria-label="Accueil" role="main" className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className="pt-24 max-w-7xl mx-auto px-4">
        {/* Monuments Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Monuments et Culture Russe</h2>
          <div className="flex flex-col gap-6">
            {monuments.map((monument: any) => (
              <article key={monument.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-6 p-6 hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => window.location.href = `/monument/${monument.id}`}
                title={`Voir plus sur ${monument.title}`} tabIndex={0} aria-label={`Monument : ${monument.title}`}>
                <img src={monument.image} alt={monument.title} className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white" loading="lazy" />
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{monument.title}</h3>
                  <div className="text-gray-600 mb-2">{monument.short}</div>
                  <div className="text-sm text-gray-500 italic">{monument.story}</div>
                </div>
              </article>
            ))}
          </div>
          <button onClick={handleStart} className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-full shadow-xl hover:scale-105 transition text-lg font-bold flex items-center gap-2 z-50">
            <PlayCircle size={28} />
            Commencer maintenant
          </button>
        </section>
        {/* Features Section */}
        <section className="py-20 px-4 sm:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Pourquoi choisir myrusse ?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
                Notre plateforme combine les dernières technologies d'apprentissage avec 
                une approche pédagogique éprouvée pour vous offrir la meilleure expérience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
                <Link
                  to="/presentation-cours"
                  className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors shadow-lg text-base outline-none"
                >
                  <BookOpen className="mr-2" size={20} />
                  Découvrir les cours
                </Link>
                {/* Bouton d'inscription supprimé, tout le monde a accès */}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[320px]">
                  <div>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
                      {feature.icon && <feature.icon className="text-red-600 dark:text-red-400" size={24} />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {feature.description}
                    </p>
                  </div>
                  {feature.title === '15,000+ Cours' && (
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors shadow text-sm mt-2 outline-none"
                    >
                      <BookOpen className="mr-2" size={18} />
                      Découvrir les cours
                    </Link>
                  )}
                  {/* CTA Communauté supprimé, accès public */}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ce que disent nos étudiants
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Rejoignez des milliers d'apprenants satisfaits
              </p>
            </div>
            {/* Formulaire d'ajout de commentaire */}
            <form className="max-w-xl mx-auto mb-12 bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="font-semibold text-gray-800 dark:text-gray-200">Votre nom (optionnel)</label>
              <input name="name" value={form.name} onChange={handleFormChange} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Votre nom" />
              <label className="font-semibold text-gray-800 dark:text-gray-200">Votre niveau (optionnel)</label>
              <input name="level" value={form.level} onChange={handleFormChange} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Débutant, Intermédiaire..." />
              <label className="font-semibold text-gray-800 dark:text-gray-200">Votre commentaire *</label>
              <textarea name="text" value={form.text} onChange={handleFormChange} required minLength={10} maxLength={300} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none" placeholder="Votre avis sur le site..." />
              <button type="submit" className="mt-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors shadow-lg text-base outline-none">Envoyer mon commentaire</button>
            </form>
            {/* Demande d'autorisation */}
            {showConsent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Votre commentaire sera public</h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">En envoyant votre avis, vous acceptez qu’il soit affiché publiquement sur le site. Vos retours aident à améliorer la plateforme pour tous les utilisateurs.</p>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-red-500 outline-none" onClick={() => handleConsent(false)}>Annuler</button>
                    <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 outline-none" onClick={() => handleConsent(true)}>Accepter et publier</button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial: any, index: number) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Prêt à commencer votre aventure russe ?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Rejoignez notre communauté d'apprenants passionnés et découvrez 
              la beauté de la langue et culture russes.
            </p>
            {/* CTA inscription supprimé, accès public */}
            <p className="text-red-200 text-sm mt-4">
              Aucune carte bancaire requise • Accès immédiat • Plus de 15,000 cours
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;