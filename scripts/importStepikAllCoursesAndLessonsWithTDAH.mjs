// Importe tous les cours et leçons Stepik dans Firestore avec explication TDAH
// Usage : node scripts/importStepikAllCoursesAndLessonsWithTDAH.mjs

import fetch from 'node-fetch';
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./scripts/serviceAccountkey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

async function fetchAllStepikCourses() {
  let allCourses = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const res = await fetch(`https://stepik.org/api/courses?is_public=true&page=${page}`);
    const data = await res.json();
    const courses = data.courses || [];
    if (courses.length === 0) break;
    allCourses = allCourses.concat(courses);
    page++;
    hasMore = data.meta && data.meta.has_next;
  }
  return allCourses;
}

async function importStepikAllCoursesAndLessonsWithTDAH() {
  console.log('Récupération de tous les cours Stepik...');
  const courses = await fetchAllStepikCourses();
  console.log(`Nombre total de cours récupérés : ${courses.length}`);

  for (const course of courses) {
    const tdahExplanation = `Ce cours est conçu pour être accessible à tous, y compris les personnes avec TDAH. Les leçons sont courtes, structurées, et chaque étape est expliquée simplement. N’hésite pas à faire des pauses, à avancer à ton rythme, et à utiliser les quiz pour renforcer ta mémoire.`;
    const courseDoc = {
      stepikId: course.id,
      title: course.title || course.slug || `Cours #${course.id}`,
      summary: course.summary || '',
      url: `https://stepik.org/course/${course.id}`,
      createdAt: new Date(),
      source: 'stepik',
      tdahExplanation,
    };
    await db.collection('courses').doc(String(course.id)).set(courseDoc);
    console.log(`Importé cours : ${courseDoc.title}`);

    // Récupérer les leçons du cours
    console.log(`Récupération des leçons pour le cours ${course.id}...`);
    const lessonsRes = await fetch(`https://stepik.org/api/lessons?course=${course.id}`);
    const lessonsData = await lessonsRes.json();
    const lessons = lessonsData.lessons || [];
    console.log(`Nombre de leçons récupérées : ${lessons.length}`);

    for (const lesson of lessons) {
      const lessonDoc = {
        stepikLessonId: lesson.id,
        courseId: String(course.id),
        title: lesson.title || `Leçon #${lesson.id}`,
        slug: lesson.slug || '',
        url: `https://stepik.org/lesson/${lesson.id}`,
        summary: lesson.description || '',
        createdAt: new Date(),
        source: 'stepik',
      };
      await db.collection('lessons').doc(String(lesson.id)).set(lessonDoc);
      console.log(`Importé leçon : ${lessonDoc.title}`);
    }
  }
  console.log('Importation terminée.');
}

importStepikAllCoursesAndLessonsWithTDAH().catch(console.error);
