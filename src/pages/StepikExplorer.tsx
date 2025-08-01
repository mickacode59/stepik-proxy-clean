import React, { useEffect, useState } from 'react';

// Page ultra simple pour explorer tous les cours et leçons Stepik en direct via l'API (pas d'import Firestore)
const STEPIC_API_BASE = 'https://stepik.org/api';
const STEPIC_PROXY_BASE = '/stepik';

// Essaie d'abord l'API directe, puis fallback proxy si CORS/404
const fetchStepik = async (endpoint: string) => {
  // Essai direct
  try {
    const res = await fetch(STEPIC_API_BASE + endpoint);
    if (res.ok) return await res.json();
    // Si 404 ou autre, tente proxy
    throw new Error('Direct Stepik API failed');
  } catch (err) {
    // Fallback proxy
    const proxyRes = await fetch(STEPIC_PROXY_BASE + endpoint);
    if (!proxyRes.ok) throw new Error('Erreur API Stepik (proxy)');
    return proxyRes.json();
  }
};


const StepikExplorer: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [lessonContent, setLessonContent] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchStepik('/courses?is_public=true&language=ru&page_size=20')
      .then(data => setCourses(data.courses || []))
      .catch(() => setError('Erreur chargement cours'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectCourse = async (course: any) => {
    setSelectedCourse(course);
    setLessons([]);
    setLoading(true);
    setError(null);
    try {
      // Récupère toutes les leçons du cours (sections -> units)
      const sectionsData = await fetchStepik(`/sections?course=${course.id}`);
      const allLessons: any[] = [];
      for (const section of sectionsData.sections || []) {
        for (const unitId of section.units || []) {
          const unitData = await fetchStepik(`/units/${unitId}`);
          const unit = unitData.units?.[0];
          if (unit) {
            allLessons.push({
              id: unit.id,
              title: unit.title || `Leçon ${unit.id}`,
              description: unit.description || '',
              lessonId: unit.lesson,
            });
          }
        }
      }
      setLessons(allLessons);
    } catch {
      setError('Erreur chargement leçons');
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
      setLessonContent(null);
    } else {
      setSelectedCourse(null);
      setLessons([]);
      setError(null);
    }
  };

  // Affiche le contenu d'une leçon Stepik (API)
  const handleSelectLesson = async (lesson: any) => {
    setSelectedLesson(lesson);
    setLessonContent(null);
    setLoading(true);
    setError(null);
    try {
      // Récupère le contenu de la leçon (texte, vidéos, etc.)
      const data = await fetchStepik(`/lessons/${lesson.lessonId}`);
      const lessonData = data.lessons?.[0];
      setLessonContent(lessonData);
    } catch {
      setError('Erreur chargement contenu leçon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Explorer Stepik (API directe)</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-500 mb-4">Chargement...</div>}
      {!selectedCourse && !selectedLesson ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Cours publics (Stepik)</h2>
          <ul className="space-y-2">
            {courses.map(course => (
              <li key={course.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
                <span className="font-medium">{course.title}</span>
                <button className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleSelectCourse(course)}>
                  Voir leçons
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : selectedLesson ? (
        <div>
          <button className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={handleBack}>← Retour aux leçons</button>
          <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
          <div className="mb-4 text-gray-600 dark:text-gray-300">{selectedLesson.description}</div>
          {loading && <div className="text-gray-500 mb-4">Chargement du contenu...</div>}
          {lessonContent && (
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              <div className="mb-4">
                <span className="font-semibold">Titre Stepik :</span> {lessonContent.title}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Description :</span> {lessonContent.description || <span className="italic text-gray-400">Aucune description</span>}
              </div>
              {lessonContent.text && (
                <div className="mb-4">
                  <span className="font-semibold">Contenu :</span>
                  <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: lessonContent.text }} />
                </div>
              )}
              {lessonContent.video && (
                <div className="mb-4">
                  <span className="font-semibold">Vidéo :</span>
                  <video controls src={lessonContent.video.url} className="w-full max-w-lg mt-2" />
                </div>
              )}
              <a
                href={`https://stepik.org/lesson/${selectedLesson.lessonId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                Ouvrir sur Stepik
              </a>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={handleBack}>← Retour aux cours</button>
          <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
          <div className="mb-4 text-gray-600 dark:text-gray-300">{selectedCourse.summary || selectedCourse.description}</div>
          <ul className="space-y-2">
            {lessons.map(lesson => (
              <li key={lesson.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded shadow flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-800">
                <div className="flex-1 cursor-pointer" onClick={() => handleSelectLesson(lesson)}>
                  <div className="font-semibold hover:underline">{lesson.title}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">{lesson.description}</div>
                </div>
                <button
                  className="ml-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  title="Ouvrir sur Stepik"
                  onClick={e => {
                    e.stopPropagation();
                    window.open(`https://stepik.org/lesson/${lesson.lessonId}`, '_blank', 'noopener');
                  }}
                >
                  Voir sur Stepik
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StepikExplorer;
