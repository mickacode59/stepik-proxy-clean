import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Exemple d'actualités russes récentes
const actualites = [
  {
    id: 'elections-2025',
    titre: "Élections présidentielles russes 2025",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Russian_presidential_election_2025.jpg",
    astuce: "Lis l'actualité comme une histoire, fais une pause si besoin, et utilise le résumé pour retenir l'essentiel !",
    texte: "En 2025, la Russie organise ses élections présidentielles. Les candidats présentent leurs programmes et les citoyens votent pour choisir leur président.",
    quiz: [
      {
        question: "Que se passe-t-il en Russie en 2025 ?",
        options: ["Des élections présidentielles", "Des Jeux Olympiques", "Une fête nationale", "Un sommet international"],
        answer: 0,
        explanation: "En 2025, la Russie organise ses élections présidentielles. Pour les TDAH, imagine une grande fête où tout le monde choisit le chef du pays !"
      }
    ]
  },
  {
    id: 'technologie',
    titre: "Innovations technologiques russes",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Russian_Tech_Expo_2025.jpg",
    astuce: "Imagine les inventions comme des gadgets de film ! Fais une pause ou demande un résumé si tu veux retenir l'essentiel.",
    texte: "La Russie développe de nouvelles technologies en 2025, comme des robots, des applications mobiles et des voitures électriques.",
    quiz: [
      {
        question: "Quel type de technologie la Russie développe-t-elle en 2025 ?",
        options: ["Robots et voitures électriques", "Montres à eau", "Bateaux à voile", "Téléphones à cadran"],
        answer: 0,
        explanation: "La Russie innove avec des robots et des voitures électriques. Pour les TDAH, imagine des robots qui aident les gens dans la vie de tous les jours !"
      }
    ]
  }
];

const CoursActualite: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [active, setActive] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number|null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAdded, setPointsAdded] = useState(false);
  const actualite = actualites[active];
  const [startTime, setStartTime] = useState(Date.now());
  const [quizStartTime, setQuizStartTime] = useState<number|null>(null);
  const [quizTime, setQuizTime] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
    setScore(0);
    setPointsAdded(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizStartTime(null);
    setQuizTime(0);
  }, [active]);

  const handleQuizStart = () => {
    setQuizStartTime(Date.now());
  };

  const handleQuizEnd = async () => {
    if (quizStartTime) {
      setQuizTime(Math.round((Date.now() - quizStartTime) / 1000));
    }
    if (currentUser && !pointsAdded) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          xp: (userProfile?.xp || 0) + score * 15,
          badges: [...(userProfile?.badges || []), score === actualite.quiz.length ? { id: `badge-actu-${actualite.id}`, name: 'Expert actu russe', description: 'A réussi le quiz sur ' + actualite.titre, icon: '📰', earnedAt: new Date(), rarity: 'rare' } : null].filter(Boolean),
          stats: {
            ...userProfile?.stats,
            totalTimeSpent: (userProfile?.stats?.totalTimeSpent || 0) + Math.round((Date.now() - startTime) / 60000),
            averageScore: ((userProfile?.stats?.averageScore || 0) + score) / 2,
            coursesCompleted: (userProfile?.stats?.coursesCompleted || 0) + 1
          }
        });
        setPointsAdded(true);
      } catch (e) {
        alert('Erreur lors de la mise à jour des points');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 p-8">
        <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4 animate-pulse">{actualite.titre}</h1>
        <div className="flex gap-3 mb-4 flex-wrap">
          <button className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" onClick={() => alert('Quiz rapide : Quel est le thème principal ? Réponse : ' + actualite.titre)}>Quiz rapide</button>
          <button className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg font-semibold shadow hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors" onClick={() => alert('Astuce TDAH : Imagine l’actualité comme une histoire, fais une pause si besoin !')}>Astuce TDAH</button>
          <button className="px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg font-semibold shadow hover:bg-green-200 dark:hover:bg-green-800 transition-colors" onClick={() => alert('Résumé visuel : ' + actualite.texte.split('.').slice(0,2).join('. ') + '.')}>Résumé visuel</button>
          <button className="px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-lg font-semibold shadow hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" onClick={() => alert('Ajouté à vos favoris !')}>Ajouter à mes favoris</button>
          <button className="px-3 py-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 rounded-lg font-semibold shadow hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors" onClick={() => alert('Partagez cette actualité avec vos amis !')}>Partager</button>
          <button className="px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded-lg font-semibold shadow hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors" onClick={() => alert('Défi du jour : Dessine un événement ou raconte l’actualité à quelqu’un !')}>Défi du jour</button>
        </div>
        {actualite.image && (
          <div className="flex justify-center mb-4">
            <img src={actualite.image} alt={actualite.titre} className="w-full max-w-md h-64 object-cover rounded-2xl shadow-lg border-4 border-blue-300 dark:border-blue-700 transition-transform duration-500 hover:scale-105" style={{filter:'contrast(1.1) brightness(1.05)'}} />
          </div>
        )}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 text-lg font-semibold animate-fade-in">
          <span role="img" aria-label="Astuce TDAH">💡</span> Astuce TDAH : {actualite.astuce}
        </div>
        <p className="text-base text-gray-700 dark:text-gray-200 mb-6 leading-relaxed font-medium animate-fade-in">{actualite.texte}</p>
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" onClick={() => window.location.reload()}>Relire</button>
          <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg font-semibold shadow hover:bg-green-200 dark:hover:bg-green-800 transition-colors" onClick={() => alert('Prends une pause, respire et reviens quand tu veux !')}>Pause</button>
          <button className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg font-semibold shadow hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors" onClick={() => alert('Résumé : ' + actualite.texte.split('.').slice(0,2).join('. ') + '.')}>Résumé simplifié</button>
        </div>
        <button className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleQuizStart}>Commencer le quiz</button>
        {quizStartTime && (
          <div className="mt-4">
            {actualite.quiz.map((q, idx) => (
              <div key={idx} className="mb-6">
                <div className="mb-2 text-lg font-semibold">{q.question}</div>
                <div className="flex flex-col gap-2 mb-2">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-lg border text-left transition-colors ${selectedOption === i ? (i === q.answer ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500') : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900'}`}
                      disabled={selectedOption !== null}
                      onClick={() => {
                        setSelectedOption(i);
                        if (i === q.answer) setScore(s => s + 1);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {selectedOption !== null && !showExplanation && (
                  <button className="mt-2 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors" onClick={() => setShowExplanation(true)}>Voir la réponse</button>
                )}
                {showExplanation && (
                  <div className="mb-2 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100">
                    <strong>Explication TDAH :</strong> {q.explanation}
                  </div>
                )}
                {showExplanation && (
                  <button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => {setSelectedOption(null);setShowExplanation(false);if(idx === actualite.quiz.length-1) handleQuizEnd();}}>Question suivante</button>
                )}
              </div>
            ))}
            <div className="text-center mt-6">
              <div className="text-xl font-bold mb-2 animate-pulse">Quiz terminé !</div>
              <div className="mb-2 text-green-700 dark:text-green-200 font-bold">Score : {score} / {actualite.quiz.length}</div>
              <div className="mb-2 text-blue-700 dark:text-blue-200">Temps passé sur le quiz : {quizTime} secondes</div>
              {currentUser && pointsAdded && (
                <div className="mb-2 p-2 bg-green-100 dark:bg-green-800 rounded-lg text-green-900 dark:text-green-100 animate-fade-in">🎉 Points et badge ajoutés à votre profil ! Bravo !</div>
              )}
              <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg text-yellow-900 dark:text-yellow-100 animate-fade-in">👏 Astuce TDAH : Tu peux recommencer le quiz, relire l'actualité ou passer à une autre actualité quand tu veux. L'important c'est d'apprendre à ton rythme !</div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors animate-fade-in" onClick={() => {setActive(a => (a+1)%actualites.length);}}>Passer à une autre actualité</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursActualite;
