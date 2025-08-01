
// importCoursesFromStepik and importLessonsFromStepikCourse are not used here
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users,
  Play,
} from 'lucide-react';
import { Course } from '../types';
import { useDocumentTitle } from '../components/useDocumentTitle';
import { localCourses } from '../data/courses';
import { importCoursesFromStepik, importLessonsFromStepikCourse } from '../data/importLessonsFromStepik';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ...existing code...
const Courses: React.FC = () => {
  useDocumentTitle('Cours - myrusse');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel] = useState<string>('all');
  const [selectedCategory] = useState<string>('all');
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState<boolean>(true);
  const [importProgress, setImportProgress] = useState<string>('');
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        // Fetch all courses from Firestore
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const firestoreCourses: Course[] = [];
        coursesSnap.forEach(doc => {
          const data = doc.data();
          firestoreCourses.push({
            ...data,
            id: doc.id,
            title: data.title || 'Cours sans titre',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            lessonsCount: data.lessonsCount || 0,
            estimatedTime: data.estimatedTime || 0,
            enrolledCount: data.enrolledCount || 0,
            rating: data.rating || 0,
            level: data.level || 'beginner',
            category: data.category || 'Général',
            tags: data.tags || [],
            isCompleted: data.isCompleted || false,
            progress: data.progress || 0,
            tdahExplanation: data.tdahExplanation || '',
          });
        });
        setCourses(firestoreCourses);
        setFilteredCourses(firestoreCourses);
        setErrorMsg(firestoreCourses.length === 0 ? 'Aucun cours Stepik trouvé.' : '');
        setImportProgress('');
        setLoading(false);
      } catch (err) {
        setErrorMsg('Erreur lors de la récupération des cours Stepik.');
        setImportProgress('Erreur import.');
        setCourses([]);
        setFilteredCourses([]);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      
      return matchesSearch && matchesLevel && matchesCategory;
    });
    
    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedLevel, selectedCategory]);


  const handleStartCourse = (courseId: string) => {
    window.scrollTo(0, 0);
    navigate(`/course-player/${courseId}`);
  };

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
          loading="lazy"

        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.level === 'beginner' ? 'bg-green-100 text-green-700' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {course.level === 'beginner' ? 'Débutant' :
             course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
          </span>
        </div>
        <button 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all group"
          onClick={() => handleStartCourse(course.id)}
          aria-label={`Commencer le cours ${course.title}`}
        >
          <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={48} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            {course.category}
          </span>
          <div className="flex items-center">
            <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{course.lessonsCount} leçons</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{course.estimatedTime} min</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{course.enrolledCount.toLocaleString()}</span>
          </div>
        </div>
        {/* Badges */}
        {course.badges && course.badges.length > 0 && (
          <div className="mb-2">
            <strong>Badges :</strong> {course.badges.map(b => <span key={b} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 text-xs">{b}</span>)}
          </div>
        )}
        {/* Quiz */}
        {course.quiz && course.quiz.length > 0 && (
          <div className="mb-2">
            <strong>Quiz :</strong>
            {course.quiz.map((q, idx) => (
              <div key={idx} className="mt-1">
                <span>{q.question}</span>
                <ul className="list-disc ml-6">
                  {q.options.map(opt => <li key={opt}>{opt}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
        {/* Vidéo */}
        {course.videoUrl && (
          <div className="mb-2">
            <strong>Vidéo :</strong>
            <iframe width="300" height="170" src={course.videoUrl} title="Vidéo pédagogique" allowFullScreen className="mt-1 rounded" />
          </div>
        )}
        {/* Podcast */}
        {course.podcastUrl && (
          <div className="mb-2">
            <strong>Podcast :</strong>
            <audio controls src={course.podcastUrl} className="mt-1" />
          </div>
        )}
        {/* PDF / Ressources */}
        {course.resources && course.resources.length > 0 && (
          <div className="mb-2">
            <strong>Ressources PDF :</strong>
            <ul>
              {course.resources.map((r, idx) => (
                <li key={idx}><a href={r} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Télécharger</a></li>
              ))}
            </ul>
          </div>
        )}
        {/* Traduction */}
        {course.translation && (
          <div className="mb-2">
            <strong>Traductions :</strong>
            <ul>
              {Object.entries(course.translation).map(([lang, txt]) => (
                <li key={lang}><b>{lang} :</b> {txt}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Certification */}
        {course.certificateAvailable && (
          <div className="mb-2">
            <strong className="text-green-700">Certification disponible à la fin du cours !</strong>
          </div>
        )}
        
        {course.progress > 0 ? (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progression</span>
              <span className="text-red-600 dark:text-red-400">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ) : null}
        
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={() => handleStartCourse(course.id)}
        >
          {course.progress > 0 ? 'Continuer' : 'Commencer'}
        </button>
      </div>
    </div>
  );

  const CourseListItem: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-6">
        <img 
          src={course.imageUrl || '/favicon.svg'}
          alt={course.title}
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          loading="lazy"

        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
              {course.category}
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {course.rating.toFixed(1)}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course.level === 'beginner' ? 'Débutant' :
                 course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <BookOpen size={14} className="mr-1" />
              <span>{course.lessonsCount} leçons</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{course.estimatedTime} min</span>
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{course.enrolledCount.toLocaleString()}</span>
            </div>
          </div>
          {/* Badges */}
          {course.badges && course.badges.length > 0 && (
            <div className="mb-2">
              <strong>Badges :</strong> {course.badges.map(b => <span key={b} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 text-xs">{b}</span>)}
            </div>
          )}
          {/* Quiz */}
          {course.quiz && course.quiz.length > 0 && (
            <div className="mb-2">
              <strong>Quiz :</strong>
              {course.quiz.map((q, idx) => (
                <div key={idx} className="mt-1">
                  <span>{q.question}</span>
                  <ul className="list-disc ml-6">
                    {q.options.map(opt => <li key={opt}>{opt}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {/* Vidéo */}
          {course.videoUrl && (
            <div className="mb-2">
              <strong>Vidéo :</strong>
              <iframe width="220" height="120" src={course.videoUrl} title="Vidéo pédagogique" allowFullScreen className="mt-1 rounded" />
            </div>
          )}
          {/* Podcast */}
          {course.podcastUrl && (
            <div className="mb-2">
              <strong>Podcast :</strong>
              <audio controls src={course.podcastUrl} className="mt-1" />
            </div>
          )}
          {/* PDF / Ressources */}
          {course.resources && course.resources.length > 0 && (
            <div className="mb-2">
              <strong>Ressources PDF :</strong>
              <ul>
                {course.resources.map((r, idx) => (
                  <li key={idx}><a href={r} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Télécharger</a></li>
                ))}
              </ul>
            </div>
          )}
          {/* Traduction */}
          {course.translation && (
            <div className="mb-2">
              <strong>Traductions :</strong>
              <ul>
                {Object.entries(course.translation).map(([lang, txt]) => (
                  <li key={lang}><b>{lang} :</b> {txt}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Certification */}
          {course.certificateAvailable && (
            <div className="mb-2">
              <strong className="text-green-700">Certification disponible à la fin du cours !</strong>
            </div>
          )}
            
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              onClick={() => handleStartCourse(course.id)}
            >
              {course.progress > 0 ? 'Continuer' : 'Commencer'}
            </button>
          </div>
          
          {course.progress > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progression</span>
                <span className="text-red-600 dark:text-red-400">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center h-64" aria-label="Chargement des cours">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" aria-label="Chargement"></div>
        {(errorMsg || importProgress) && (
          <div className={`mt-4 p-3 rounded text-center ${errorMsg ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>{errorMsg || importProgress}</div>
        )}
      </main>
    );
  }



  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex flex-col items-center" aria-label="Catalogue des cours">
      {/* Header fixe façon social app */}
      <header className="w-full sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 shadow flex items-center justify-between px-8 py-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-1">Catalogue des cours</h1>
          <p className="text-blue-400 dark:text-blue-100">{courses.length.toLocaleString()} cours de russe pour tous les niveaux</p>
        </div>
        <button
          onClick={() => { window.scrollTo(0, 0); navigate('/dashboard'); }}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-full font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 transition-colors hover:scale-105"
          aria-label="Retour au dashboard"
        >
          <span className="material-icons align-middle">arrow_back</span> Dashboard
        </button>
      </header>

      {/* Filtres et recherche */}
      <section className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 flex flex-col lg:flex-row gap-8 items-center" aria-label="Filtres de recherche">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher un cours, une leçon, un mot-clé..."
          className="w-full max-w-md px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
        />
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 w-full text-center">
          {filteredCourses.length} cours trouvés
        </div>
      </section>

      {/* Feed de cours façon social app */}
      <section className="w-full max-w-7xl mx-auto" aria-label="Liste des cours">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCourses.map(course => (
              <CourseListItem key={course.id} course={course} />
            ))}
          </div>
        )}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </section>

      {/* Bouton flottant pour ajouter un cours */}
      <button className="fixed bottom-8 right-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-bold shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors hover:scale-105 z-50 flex items-center gap-2" aria-label="Ajouter un cours">
        <span className="material-icons">add_circle</span> Nouveau cours
      </button>
    </main>
  );
};

export default Courses;