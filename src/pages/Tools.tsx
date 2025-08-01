//
import { BookOpen, Volume2, Mic, Globe, Zap, FileText, Search, Star } from 'lucide-react';

const tools = [
  {
    icon: <BookOpen className="text-blue-600" size={32} />, title: 'Dictionnaire', desc: 'Cherchez la définition, la traduction et la prononciation de n’importe quel mot russe.', link: '/dictionnaire'
  },
  {
    icon: <Volume2 className="text-green-600" size={32} />, title: 'Prononciation', desc: 'Écoutez la prononciation native et entraînez-vous à parler.', link: '/prononciation'
  },
  {
    icon: <Mic className="text-red-600" size={32} />, title: 'Reconnaissance vocale', desc: 'Testez votre prononciation avec l’IA.', link: '/reconnaissance-vocale'
  },
  {
    icon: <Globe className="text-purple-600" size={32} />, title: 'Traduction', desc: 'Traduisez instantanément des phrases ou des textes.', link: '/traduction'
  },
  {
    icon: <Zap className="text-yellow-500" size={32} />, title: 'Conjugueur', desc: 'Conjuguez n’importe quel verbe russe à tous les temps.', link: '/conjugaison'
  },
  {
    icon: <FileText className="text-pink-500" size={32} />, title: 'Fiches de grammaire', desc: 'Accédez à des fiches synthétiques sur tous les points de grammaire.', link: '/grammaire'
  },
  {
    icon: <Search className="text-gray-700" size={32} />, title: 'Recherche intelligente', desc: 'Trouvez rapidement des ressources, leçons ou exercices.', link: '/recherche'
  },
  {
    icon: <Star className="text-orange-500" size={32} />, title: 'Favoris', desc: 'Enregistrez vos outils et ressources préférés.', link: '/favoris'
  }
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Outils linguistiques</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center">Utilisez tous les outils pratiques pour progresser plus vite en russe.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {tools.map((tool, i) => (
            <a key={i} href={tool.link} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              {tool.icon}
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{tool.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
