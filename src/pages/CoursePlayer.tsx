import React, { useState, useEffect } from 'react';
import RussianKeyboard from '../components/RussianKeyboard';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useDocumentTitle } from '../components/useDocumentTitle';
import { db } from '../config/firebase';
import { localLessons } from '../data/lessons';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CoursePlayer: React.FC = () => {
  useDocumentTitle('Lecture du cours - myrusse');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(0);
  type Lesson = {
    id: string;
    title: string;
    content: {
      type: string;
      data: string;
    };
  };
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<string | null>(null);
  const [clozeInput, setClozeInput] = useState('');
  
  // Générateur de leçons de démo si aucune leçon Firestore n'est trouvée
  // ...existing code...


  // Charger les leçons Firestore pour ce cours
  useEffect(() => {
    if (!courseId) return;
    const fetchLessons = async () => {
      const lessonsCol = collection(db, 'lessons');
      const lessonsQuery = query(lessonsCol, where('courseId', '==', courseId));
      const lessonsSnap = await getDocs(lessonsQuery);
      let lessonsArr = lessonsSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title ?? '',
          content: typeof data.content === 'object' && data.content !== null
            ? {
                type: data.content.type ?? 'text',
                data: data.content.data ?? ''
              }
            : { type: 'text', data: String(data.content ?? '') },
        };
      });
      // Fallback : si aucune leçon Firestore, charge les leçons locales
      if (!lessonsArr.length && localLessons[courseId]) {
        // Corrige le typage pour garantir que content.data est une chaîne
        const safeLessons = localLessons[courseId].map(lesson => ({
          ...lesson,
          content: {
            type: lesson.content?.type ?? 'text',
            data: typeof lesson.content?.data === 'string' ? lesson.content.data : JSON.stringify(lesson.content?.data ?? '')
          }
        }));
        setLessons(safeLessons);
      } else {
        setLessons(lessonsArr);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Persistance locale de la progression (optionnel)
  useEffect(() => {
    if (!courseId || lessons.length === 0) return;
    localStorage.setItem(`progress_${courseId}`, String(currentLesson));
  }, [courseId, currentLesson, lessons.length]);

  useEffect(() => {
    if (!courseId) return;
    const saved = localStorage.getItem(`progress_${courseId}`);
    if (saved && !isNaN(Number(saved))) {
      setCurrentLesson(Number(saved));
    }
  }, [courseId, lessons.length]);

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };


  if (!lessons.length) {
    // Vérifie si le courseId existe dans les cours locaux
    const hasLocalCourse = courseId && localLessons[courseId] && localLessons[courseId].length > 0;
    return (
      <main className="flex items-center justify-center h-64" aria-label="Aucune leçon trouvée">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          {hasLocalCourse
            ? "Aucune leçon trouvée pour ce cours."
            : "Ce cours est introuvable ou ne contient aucune leçon. Veuillez choisir un cours valide dans la liste des cours."}
        </div>
      </main>
    );
  }

  // Détection exercice à trous
  const current = lessons[currentLesson];
  const isCloze = current?.content?.type === 'cloze';

  return (
    <main className="max-w-2xl mx-auto py-12 px-4 sm:px-8 space-y-10" aria-label="Lecteur de cours">
      <BackButton />
      <section className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center" aria-label="Navigation du cours">
        <button
          onClick={() => { window.scrollTo(0, 0); navigate(-1); }}
          className="flex items-center px-5 py-2 bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors outline-none"
        >
          <ChevronLeft className="mr-1" size={20} /> Retour aux cours
        </button>
        <button
          onClick={() => { window.scrollTo(0, 0); navigate('/dashboard'); }}
          className="flex items-center px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors outline-none"
        >
          Dashboard
        </button>
      </section>
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 mb-4 border border-gray-200 dark:border-gray-700" aria-label="Contenu de la leçon">
        <header>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={28} className="text-red-600" />
            {current.title}
          </h2>
        </header>
        <div
          className="text-lg text-gray-700 dark:text-gray-200 mb-10 min-h-[120px] bg-gray-50 dark:bg-gray-900 rounded-xl p-6"
          style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
        >
          {/* Affiche le contenu principal, sinon fallback sur summary/description */}
          {current.content?.type === 'cloze' && current.content?.data
            ? current.content.data
            : current.content?.data
              ? current.content.data
              : (current as any).summary || (current as any).description || <span className="italic text-gray-400">Aucun contenu pour cette leçon.</span>}
        </div>
        {isCloze && (
          <div className="mb-8">
            <label className="block mb-2 font-medium">Complétez la phrase :</label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={clozeInput}
                onChange={e => setClozeInput(e.target.value)}
                lang="ru"
                inputMode="text"
                aria-label="Réponse à trous"
              />
              <button
                type="button"
                className="absolute right-2 top-2 px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                onClick={() => { setKeyboardTarget('clozeInput'); setShowKeyboard(v => !v); }}
              >
                {showKeyboard && keyboardTarget === 'clozeInput' ? 'Fermer' : 'Clavier russe'}
              </button>
              {showKeyboard && keyboardTarget === 'clozeInput' && (
                <RussianKeyboard
                  onPublish={text => { setClozeInput(text); setShowKeyboard(false); }}
                  onClose={() => setShowKeyboard(false)}
                />
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentLesson === 0}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors outline-none disabled:opacity-50"
          >
            <ChevronLeft size={20} className="inline mr-1" /> Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={currentLesson === lessons.length - 1}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors outline-none disabled:opacity-50"
          >
            Suivant <ChevronRight size={20} className="inline ml-1" />
          </button>
        </div>
      </section>
      <div className="text-center text-gray-500 dark:text-gray-400" aria-label="Progression de la leçon">
        Leçon {currentLesson + 1} sur {lessons.length}
      </div>
    </main>
  );
};

export default CoursePlayer;
