// Importe tous les cours et leçons Stepik dans Firestore avec explication TDAH en français
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fetch = require('node-fetch');

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// const stepikProxy = '';
const pageSize = 100;
const maxPages = 10;

function tdahExplanation(title, description) {
  return `Explication TDAH : Ce cours "${title}" est conçu pour être accessible et stimulant. Les leçons sont courtes, illustrées et interactives pour faciliter la concentration et l'apprentissage. ${description}`;
}

async function importStepikCourses() {
  let allCourses = [];
  for (let page = 1; page <= maxPages; page++) {
    const apiUrl = `https://stepik.org/api/courses?is_public=true&language=ru&page=${page}&page_size=${pageSize}`;
    const res = await fetch(apiUrl);
    if (!res.ok) break;
    const data = await res.json();
    for (const c of data.courses || []) {
      const course = {
        id: c.id?.toString(),
        title: c.title || '',
        description: c.summary || c.description || '',
        imageUrl: c.cover || '',
        lessonsCount: c.sections?.length || 1,
        estimatedTime: c.workload || 60,
        enrolledCount: c.learners_count || 0,
        rating: c.rating || 0,
        level: 'beginner',
        category: c.subjects ? c.subjects.join(', ') : 'Général',
        tags: c.subjects || [],
        isCompleted: false,
        progress: 0,
        tdahExplanation: tdahExplanation(c.title, c.summary || c.description || ''),
      };
      await db.collection('courses').doc(course.id).set(course);
      // Importer les leçons pour chaque cours
      if (c.sections && c.sections.length > 0) {
        for (const sectionId of c.sections) {
          const sectionApi = `https://stepik.org/api/sections/${sectionId}`;
          const sectionRes = await fetch(sectionApi);
          if (sectionRes.ok) {
            const sectionData = await sectionRes.json();
            for (const section of sectionData.sections || []) {
              if (section.units && section.units.length > 0) {
                for (const unitId of section.units) {
                  const unitApi = `https://stepik.org/api/units/${unitId}`;
                  const unitRes = await fetch(unitApi);
                  if (unitRes.ok) {
                    const unitData = await unitRes.json();
                    const unit = unitData.units?.[0];
                    const lesson = {
                      id: unitId.toString(),
                      title: unit?.title || `Leçon ${unitId}`,
                      content: unit?.description || '',
                      courseId: course.id,
                      tdahExplanation: tdahExplanation(unit?.title || `Leçon ${unitId}`, unit?.description || ''),
                    };
                    await db.collection('lessons').doc(lesson.id).set(lesson);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (!data.courses || data.courses.length < pageSize) break;
  }
  console.log('Import Stepik terminé.');
}

importStepikCourses();
