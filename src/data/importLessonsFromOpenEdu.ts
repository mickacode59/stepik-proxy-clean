// Automatisation de l’import des leçons réelles pour chaque cours OpenEdu
// Ce script récupère les leçons pour chaque cours via l’API et les enregistre dans Firestore

import { db } from '../config/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { importCoursesFromOpenEdu } from './importCourses';

// Fonction pour importer les leçons d’un cours OpenEdu
async function importLessonsForCourse(courseId: string) {
  // Endpoint OpenEdu pour les leçons d’un cours
  const apiUrl = `https://openedu.ru/api/courses/v1/course/${courseId}/blocks/`;
  const response = await fetch(apiUrl);
  if (!response.ok) return [];
  const data = await response.json();
  // Adapter le mapping selon la structure OpenEdu
  // Ici, on suppose que data.blocks contient la liste des leçons
  return (data.blocks || []).map((block: any, idx: number) => ({
    id: block.id?.toString() || `${courseId}-lesson-${idx + 1}`,
    title: block.display_name || `Leçon ${idx + 1}`,
    content: {
      type: 'text',
      data: block.description || block.text || '',
    },
    courseId,
  }));
}

// Fonction principale pour automatiser l’import de toutes les leçons
export async function importAllLessonsFromOpenEdu() {
  const courses = await importCoursesFromOpenEdu();
  for (const course of courses) {
    const lessons = await importLessonsForCourse(course.id);
    for (const lesson of lessons) {
      // Enregistrement dans Firestore (collection 'lessons')
      await setDoc(doc(collection(db, 'lessons'), lesson.id), lesson);
    }
  }
  return true;
}

// Utilisation :
// importAllLessonsFromOpenEdu().then(() => console.log('Importation terminée !'));
