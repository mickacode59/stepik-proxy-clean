
// Module d’importation automatique de cours russes gratuits depuis Open Education (openedu.ru)
// Utilisation :
// 1. Importation directe depuis l’API publique Open Education (pas besoin de clé API)
// 2. Importation possible depuis un fichier JSON si besoin

import { Course } from '../types';

// Importation depuis Open Education (API publique, documentation : https://openedu.ru/api/)
export async function importCoursesFromOpenEdu(): Promise<Course[]> {
  // Exemple d’endpoint public pour les cours (documentation en russe)
  const apiUrl = 'https://openedu.ru/api/courses/v1/courses/';
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Erreur lors de la récupération des cours OpenEdu');
  const data = await response.json();
  // Adapter le mapping selon la structure OpenEdu
  // Ici, on suppose que data.results contient la liste des cours
  return (data.results || []).map((c: any, idx: number) => ({
    id: c.id?.toString() || `${idx + 1}`,
    title: c.name || c.title,
    description: c.short_description || c.description || '',
    level: 'beginner', // OpenEdu ne fournit pas toujours le niveau, à adapter si besoin
    category: c.subject_area || 'Général',
    imageUrl: c.course_image_url || '',
    lessonsCount: c.weeks_count || 1,
    estimatedTime: c.effort || 60,
    tags: c.subject_area ? [c.subject_area] : [],
    isCompleted: false,
    progress: 0,
    rating: 0,
    enrolledCount: c.enrollment_count || 0,
  }));
}

// Importation depuis un fichier JSON local
export async function importCoursesFromFile(filePath: string): Promise<Course[]> {
  const response = await fetch(filePath);
  if (!response.ok) throw new Error('Erreur lors de la récupération du fichier de cours');
  const data = await response.json();
  return data.courses.map((c: any, idx: number) => ({
    id: c.id?.toString() || `${idx + 1}`,
    title: c.title,
    description: c.description,
    level: c.level || 'beginner',
    category: c.category || 'Général',
    imageUrl: c.imageUrl || '',
    lessonsCount: c.lessonsCount || 1,
    estimatedTime: c.estimatedTime || 60,
    tags: c.tags || [],
    isCompleted: false,
    progress: 0,
    rating: c.rating || 0,
    enrolledCount: c.enrolledCount || 0,
  }));
}

// Exemple d’utilisation dans votre composant React
// import { importCoursesFromOpenEdu, importCoursesFromFile } from '../data/importCourses';
// useEffect(() => {
//   importCoursesFromOpenEdu().then(setCourses);
//   // ou
//   importCoursesFromFile('/public/courses.json').then(setCourses);
// }, []);
