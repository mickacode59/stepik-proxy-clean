import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

function getQuizForMonument(id: string): QuizQuestion[] {
  switch (id) {
    case 'kremlin':
      return [
        {
          question: "À quoi sert le Kremlin aujourd'hui ?",
          options: ["C'est un musée", "C'est la résidence du président russe", "C'est une gare", "C'est un centre commercial"],
          answer: 1,
          explanation: "Le Kremlin abrite aujourd'hui le président russe. Pour les TDAH, imagine que c'est le château principal où le chef du pays vit et travaille, comme dans un jeu vidéo !"
        },
        {
          question: "De quel siècle date la construction du Kremlin ?",
          options: ["15e siècle", "18e siècle", "20e siècle", "10e siècle"],
          answer: 0,
          explanation: "Le Kremlin a été construit au 15e siècle. Pour les TDAH, visualise une époque où les chevaliers et les bâtisseurs créaient des forteresses pour protéger la ville !"
        }
      ];
    case 'saint-basile':
      return [
        {
          question: "Pourquoi la cathédrale Saint-Basile est-elle célèbre ?",
          options: ["Pour ses dômes colorés", "Pour ses souterrains", "Pour ses statues", "Pour ses jardins"],
          answer: 0,
          explanation: "Ses dômes multicolores attirent l'œil et stimulent l'imagination. Pour les TDAH, chaque dôme ressemble à un bonbon ou un chapeau magique !"
        }
      ];
    // ... Ajoute d'autres quiz pour chaque monument ...
    default:
      return [
        {
          question: "Ce monument est-il situé en Russie ?",
          options: ["Oui", "Non"],
          answer: 0,
          explanation: "Tous les monuments présentés ici sont en Russie. Pour les TDAH, imagine que tu fais le tour du pays en explorant chaque site comme un aventurier !"
        }
      ];
  }
}
const fetchMonuments = async () => {
  const res = await fetch('/monuments.json');
  return res.json();
};

const MonumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userProfile } = useAuth();
  type Monument = {
    id: string;
    name: string;
    title: string;
    description: string;
    short?: string;
    story?: string;
    image: string;
    // Ajoute d'autres propriétés selon le modèle
  };
  const [monument, setMonument] = useState<Monument | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number|null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAdded, setPointsAdded] = useState(false);

  useEffect(() => {
    fetchMonuments().then((monuments) => {
      const found = monuments.find((m: Monument) => m.id === id);
      setMonument(found);
      setQuiz(getQuizForMonument(id || ""));
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
    });
  }, [id]);

  if (!monument) {
    return <div className="text-center py-20">Monument introuvable...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <img
          src={monument.image}
          alt={monument.title}
          className="w-full h-64 object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/favicon.svg';
          }}
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4 animate-pulse">{monument.title}</h1>
          <div className="flex gap-3 mb-4 flex-wrap">
            <button className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" onClick={() => alert('Quiz rapide : Quel est le nom de ce monument ? Réponse : ' + monument.title)}>Quiz rapide</button>
            <button className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg font-semibold shadow hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors" onClick={() => alert('Astuce TDAH : Imagine ce monument comme un décor de dessin animé, fais une pause si besoin !')}>Astuce TDAH</button>
            <button className="px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg font-semibold shadow hover:bg-green-200 dark:hover:bg-green-800 transition-colors" onClick={() => alert('Résumé visuel : ' + monument.short)}>Résumé visuel</button>
            <button className="px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-lg font-semibold shadow hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" onClick={() => alert('Ajouté à vos favoris !')}>Ajouter à mes favoris</button>
            <button className="px-3 py-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 rounded-lg font-semibold shadow hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors" onClick={() => alert('Partagez ce monument avec vos amis !')}>Partager</button>
            <button className="px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded-lg font-semibold shadow hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors" onClick={() => alert('Défi du jour : Dessine ce monument ou raconte son histoire à quelqu’un !')}>Défi du jour</button>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{monument.short}</p>
          <p className="text-base text-gray-700 dark:text-gray-200 italic mb-6">{monument.story}</p>
          <a href="/" className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Retour à l'accueil</a>
        </div>
      </div>
      {/* Quiz interactif */}
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-8">
          {quiz && quiz.length > 0 && currentQuestion < quiz.length ? (
            <>
              <h2 className="text-xl font-bold mb-4">Quiz sur le monument</h2>
              <div className="mb-4">{quiz[currentQuestion].question}</div>
              <div className="flex flex-col gap-2 mb-4">
                {quiz[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-lg border text-left transition-colors ${selectedOption === idx ? (idx === quiz[currentQuestion].answer ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500') : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900'}`}
                    disabled={selectedOption !== null}
                    onClick={() => {
                      setSelectedOption(idx);
                      if (idx === quiz[currentQuestion].answer) setScore(s => s + 1);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedOption !== null && !showExplanation && (
                <button
                  className="mt-2 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  onClick={() => setShowExplanation(true)}
                >
                  Voir la réponse
                </button>
              )}
              {showExplanation && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100">
                  <strong>Explication TDAH :</strong> {quiz[currentQuestion].explanation}
                </div>
              )}
              {showExplanation && (
                <button
                  className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setCurrentQuestion(q => q + 1);
                    setSelectedOption(null);
                    setShowExplanation(false);
                  }}
                >
                  {currentQuestion < quiz.length - 1 ? 'Question suivante' : 'Voir le résultat'}
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="text-xl font-bold mb-2">Quiz terminé !</div>
              <div className="mb-4">Score : {score} / {quiz.length}</div>
              {(!!currentUser && !pointsAdded) && (
                <button
                  className="mb-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={async () => {
                    try {
                      if (!currentUser) return;
                      const userRef = doc(db, 'users', currentUser.uid);
                      await updateDoc(userRef, { xp: (userProfile?.xp || 0) + score * 10 });
                      setPointsAdded(true);
                    } catch (e) {
                      alert('Erreur lors de la mise à jour des points');
                    }
                  }}
                >
                  Ajouter mes points ({score * 10} XP)
                </button>
              )}
              {(!!currentUser && pointsAdded) && (
                <div className="mb-4 p-2 bg-green-100 dark:bg-green-800 rounded-lg text-green-900 dark:text-green-100">Points ajoutés à votre profil !</div>
              )}
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-300 dark:border-green-700 text-green-800 dark:text-green-100">
                <strong>Bravo !</strong> Pour les TDAH, tu peux refaire le quiz autant de fois que tu veux pour t'entraîner et mieux retenir les infos. N'hésite pas à relire les explications, à ton rythme !
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => {setCurrentQuestion(0);setScore(0);setSelectedOption(null);setShowExplanation(false);setPointsAdded(false);}}>Recommencer le quiz</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonumentDetail;
