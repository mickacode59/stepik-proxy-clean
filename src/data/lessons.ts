// Génère des leçons locales pour chaque cours
import { Lesson } from '../types';
import { localCourses } from './courses';

// Pour la démo, chaque cours a un nombre de leçons égal à lessonsCount, avec du contenu factice
export const localLessons: Record<string, Lesson[]> = {};

localCourses.forEach(course => {
  const lessons: Lesson[] = Array.from({ length: course.lessonsCount }, (_, i) => ({
    id: `${course.id}-lesson-${i+1}`,
    courseId: course.id,
    title: `Leçon ${i+1} : Introduction à ${course.title}`,
    description: `Description de la leçon ${i+1} pour le cours ${course.title}.`,
    content: {
      type: 'text',
      data: `Ceci est le contenu principal de la leçon ${i+1} du cours ${course.title}.`,
    },
    exercises: [],
    order: i+1,
    estimatedTime: 10 + (i % 10),
    isCompleted: false,
  }));
  localLessons[course.id] = lessons;
});

export default localLessons;
