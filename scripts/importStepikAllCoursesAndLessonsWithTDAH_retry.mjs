// Importe tous les cours et leçons Stepik dans Firestore avec explication TDAH et gestion des erreurs réseau (retry)
// Usage : node scripts/importStepikAllCoursesAndLessonsWithTDAH_retry.mjs

import fetch from 'node-fetch';
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./scripts/serviceAccountkey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i < retries - 1) {
        console.warn(`Erreur réseau sur ${url}, tentative ${i + 1}/${retries}...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.error(`Échec définitif sur ${url}:`, err);
        return null;
      }
    }
  }
}

async function fetchAllStepikCourses() {
  let allCourses = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const data = await fetchWithRetry(`https://stepik.org/api/courses?is_public=true&page=${page}`);
    if (!data || !data.courses || data.courses.length === 0) break;
    allCourses = allCourses.concat(data.courses);
    page++;
    hasMore = data.meta && data.meta.has_next;
  }
  return allCourses;
}

async function importStepikAllCoursesAndLessonsWithTDAH_retry() {
  console.log('Récupération de tous les cours Stepik...');
  const courses = await fetchAllStepikCourses();
  console.log(`Nombre total de cours récupérés : ${courses.length}`);
  let failedCourses = [];

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

    // Récupérer les leçons du cours avec retry
    console.log(`Récupération des leçons pour le cours ${course.id}...`);
    const lessonsData = await fetchWithRetry(`https://stepik.org/api/lessons?course=${course.id}`);
    if (!lessonsData || !lessonsData.lessons) {
      console.error(`Leçons non récupérées pour le cours ${course.id}`);
      failedCourses.push(course.id);
      continue;
    }
    const lessons = lessonsData.lessons;
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
  if (failedCourses.length > 0) {
    console.log('Cours avec échec de récupération des leçons :', failedCourses);
  }
  console.log('Importation terminée.');
}

importStepikAllCoursesAndLessonsWithTDAH_retry().catch(console.error);
