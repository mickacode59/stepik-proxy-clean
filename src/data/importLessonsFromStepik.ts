// Importation automatique des leçons russes depuis Stepik (API publique)
// Documentation : https://stepik.org/api/docs/

import { Course } from '../types';

// Fonction pour récupérer les cours russes sur Stepik
export async function importCoursesFromStepik(): Promise<Course[]> {
  // Recherche de cours russes (lang=ru) via proxy, multi-pages
  // Utilisation d'un proxy alternatif (Cloudflare Workers ou autre)
  // Nouveau proxy pour les cours Stepik
  // const proxyUrl = '';
  let allCourses: Course[] = [];
  const pageSize = 100;
  let page = 1;
  let hasMore = true;
  try {
    while (hasMore && page <= 20) {
      const apiUrl = `/stepik/courses?is_public=true&language=ru&page=${page}&page_size=${pageSize}`;
      let response = await fetch(apiUrl);
      if (!response.ok) {
        // Fallback direct si proxy échoue
        const directUrl = `https://stepik.org/api/courses?is_public=true&language=ru&page=${page}&page_size=${pageSize}`;
        response = await fetch(directUrl);
        if (!response.ok) {
          console.error('Erreur import Stepik:', response.status, await response.text());
          break;
        }
      }
      const data = await response.json();
      const courses = (data.courses || []).map((c: any, idx: number) => ({
        id: c.id?.toString() || `${(page-1)*pageSize + idx + 1}`,
        title: c.title || '',
        description: c.summary || c.description || '',
        level: 'beginner',
        category: c.subjects ? c.subjects.join(', ') : 'Général',
        imageUrl: c.cover || '',
        lessonsCount: c.sections?.length || 1,
        estimatedTime: c.workload || 60,
        tags: c.subjects || [],
        isCompleted: false,
        progress: 0,
        rating: c.rating || 0,
        enrolledCount: c.learners_count || 0,
      }));
      allCourses = allCourses.concat(courses);
      hasMore = courses.length === pageSize;
      page++;
    }
    return allCourses;
  } catch (err) {
    console.error('Erreur import Stepik:', err);
    return [];
  }
}

// Fonction pour récupérer les leçons d’un cours Stepik
export async function importLessonsFromStepikCourse(courseId: string) {
  // Utilisation d'un proxy alternatif (Cloudflare Workers ou autre)
  // Nouveau proxy pour les leçons Stepik
  // const proxyUrl = '';
  const apiUrl = `/stepik/sections?course=${courseId}`;
  try {
    let response = await fetch(apiUrl);
    if (!response.ok) {
      // Fallback direct si proxy échoue
      const directUrl = `https://stepik.org/api/sections?course=${courseId}`;
      response = await fetch(directUrl);
      if (!response.ok) {
        console.error('Erreur import Stepik:', response.status, await response.text());
        return [];
      }
    }
    const data = await response.json();
    let lessons: any[] = [];
    for (const section of data.sections || []) {
      if (section.units && section.units.length > 0) {
        for (const unitId of section.units) {
          const unitApiUrl = `/stepik/units/${unitId}`;
          let unitRes = await fetch(unitApiUrl);
          if (!unitRes.ok) {
            // Fallback direct si proxy échoue
            const directUnitUrl = `https://stepik.org/api/units/${unitId}`;
            unitRes = await fetch(directUnitUrl);
          }
          if (unitRes.ok) {
            const unitData = await unitRes.json();
            const unit = unitData.units?.[0];
            lessons.push({
              id: unitId.toString(),
              title: unit?.title || `Leçon ${unitId}`,
              content: {
                type: 'text',
                data: unit?.description || '',
              },
              courseId: courseId.toString(),
            });
          }
        }
      }
    }
    return lessons;
  } catch (err) {
    console.error('Erreur import Stepik:', err);
    return [];
  }
}

// Exemple d’utilisation :
// const courses = await importCoursesFromStepik();
// const lessons = await importLessonsFromStepikCourse(courses[0].id);
