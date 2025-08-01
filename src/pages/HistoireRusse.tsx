import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Exemple d'histoires russes réelles
const histoires = [
  {
    id: 'peter-le-grand',
    titre: "Pierre le Grand et la modernisation de la Russie",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Peter_the_Great_by_Paul_Delrue.jpg",
    astuce: "Imagine Pierre le Grand comme un super-héros qui construit une ville moderne. Fais une pause si tu veux, relis l'histoire ou demande un résumé !",
    texte: "Pierre Ier, dit Pierre le Grand, fut tsar de Russie de 1682 à 1725. Il transforma la Russie en une grande puissance européenne, modernisa l'armée, la marine et fonda la ville de Saint-Pétersbourg.",
    quiz: [
      {
        question: "Quelle ville Pierre le Grand a-t-il fondée ?",
        options: ["Moscou", "Saint-Pétersbourg", "Kazan", "Novgorod"],
        answer: 1,
        explanation: "Pierre le Grand a fondé Saint-Pétersbourg pour ouvrir la Russie sur l'Europe. Pour les TDAH, imagine un roi qui construit une ville pour que son pays devienne plus moderne et connecté au reste du monde !"
      },
      {
        question: "Quel était le but principal de Pierre le Grand ?",
        options: ["Moderniser la Russie", "Conquérir la Chine", "Devenir empereur d'Europe", "Découvrir l'Amérique"],
        answer: 0,
        explanation: "Son objectif était de moderniser la Russie. Pour les TDAH, pense à un chef qui veut que son pays soit aussi avancé que les autres, alors il change tout !"
      }
    ]
  },
  {
    id: 'anastasia',
    titre: "La légende de la princesse Anastasia",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Grand_Duchess_Anastasia_Nikolaevna_1914.jpg",
    astuce: "Visualise Anastasia comme une héroïne de conte. Si tu te perds, utilise le bouton résumé ou fais une pause !",
    texte: "Anastasia Romanov était la fille du dernier tsar de Russie. Après la révolution, une rumeur disait qu'elle avait survécu, ce qui inspira de nombreux films et livres.",
    quiz: [
      {
        question: "Qui était Anastasia Romanov ?",
        options: ["Une princesse russe", "Une reine anglaise", "Une exploratrice", "Une scientifique"],
        answer: 0,
        explanation: "Anastasia était la fille du dernier tsar. Pour les TDAH, imagine une histoire pleine de mystère et d'aventure, comme dans un conte !"
      }
    ]
  }
];

const HistoireRusse: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [active, setActive] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number|null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAdded, setPointsAdded] = useState(false);
  const histoire = histoires[active];
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
        // 20 points par bonne réponse + badge si tout juste
        await updateDoc(userRef, {
          xp: (userProfile?.xp || 0) + score * 20,
          badges: [...(userProfile?.badges || []), score === histoire.quiz.length ? { id: `badge-${histoire.id}`, name: 'Expert histoire russe', description: 'A réussi le quiz sur ' + histoire.titre, icon: '🎖️', earnedAt: new Date(), rarity: 'rare' } : null].filter(Boolean),
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
        <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4 animate-pulse">{histoire.titre}</h1>
        <div className="flex gap-3 mb-4 flex-wrap">
          <button className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" onClick={() => alert('Quiz rapide : Quel est le personnage principal ? Réponse : ' + histoire.titre)}>Quiz rapide</button>
          <button className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg font-semibold shadow hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors" onClick={() => alert('Astuce TDAH : Imagine l’histoire comme un dessin animé, fais une pause si besoin !')}>Astuce TDAH</button>
          <button className="px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg font-semibold shadow hover:bg-green-200 dark:hover:bg-green-800 transition-colors" onClick={() => alert('Résumé visuel : ' + histoire.texte.split('.').slice(0,2).join('. ') + '.')}>Résumé visuel</button>
          <button className="px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-lg font-semibold shadow hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" onClick={() => alert('Ajouté à vos favoris !')}>Ajouter à mes favoris</button>
          <button className="px-3 py-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 rounded-lg font-semibold shadow hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors" onClick={() => alert('Partagez cette histoire avec vos amis !')}>Partager</button>
          <button className="px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded-lg font-semibold shadow hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors" onClick={() => alert('Défi du jour : Dessine un personnage ou raconte l’histoire à quelqu’un !')}>Défi du jour</button>
        </div>
        {histoire.image && (
          <div className="flex justify-center mb-4">
            <img src={histoire.image} alt={histoire.titre} className="w-full max-w-md h-64 object-cover rounded-2xl shadow-lg border-4 border-yellow-300 dark:border-yellow-700 transition-transform duration-500 hover:scale-105" style={{filter:'contrast(1.1) brightness(1.05)'}} />
          </div>
        )}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl border border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 text-lg font-semibold animate-fade-in">
          <span role="img" aria-label="Astuce TDAH">💡</span> Astuce TDAH : {histoire.astuce}
        </div>
        <p className="text-base text-gray-700 dark:text-gray-200 mb-6 leading-relaxed font-medium animate-fade-in">{histoire.texte}</p>
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" onClick={() => window.location.reload()}>Relire</button>
          <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg font-semibold shadow hover:bg-green-200 dark:hover:bg-green-800 transition-colors" onClick={() => alert('Prends une pause, respire et reviens quand tu veux !')}>Pause</button>
          <button className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg font-semibold shadow hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors" onClick={() => alert('Résumé : ' + histoire.texte.split('.').slice(0,2).join('. ') + '.')}>Résumé simplifié</button>
        </div>
        <button className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleQuizStart}>Commencer le quiz</button>
        {quizStartTime && (
          <div className="mt-4">
            {histoire.quiz.map((q, idx) => (
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
                  <button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => {setSelectedOption(null);setShowExplanation(false);if(idx === histoire.quiz.length-1) handleQuizEnd();}}>Question suivante</button>
                )}
              </div>
            ))}
            <div className="text-center mt-6">
              <div className="text-xl font-bold mb-2 animate-pulse">Quiz terminé !</div>
              <div className="mb-2 text-green-700 dark:text-green-200 font-bold">Score : {score} / {histoire.quiz.length}</div>
              <div className="mb-2 text-blue-700 dark:text-blue-200">Temps passé sur le quiz : {quizTime} secondes</div>
              {currentUser && pointsAdded && (
                <div className="mb-2 p-2 bg-green-100 dark:bg-green-800 rounded-lg text-green-900 dark:text-green-100 animate-fade-in">🎉 Points et badge ajoutés à votre profil ! Bravo !</div>
              )}
              <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg text-yellow-900 dark:text-yellow-100 animate-fade-in">👏 Astuce TDAH : Tu peux recommencer le quiz, relire l'histoire ou passer à une autre histoire quand tu veux. L'important c'est d'apprendre à ton rythme !</div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors animate-fade-in" onClick={() => {setActive(a => (a+1)%histoires.length);}}>Passer à une autre histoire</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoireRusse;
