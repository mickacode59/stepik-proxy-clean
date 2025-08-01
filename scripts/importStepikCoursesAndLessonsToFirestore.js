// Script d'importation des cours et leçons Stepik dans Firestore
// Usage : node scripts/importStepikCoursesAndLessonsToFirestore.js

const fetch = require('node-fetch');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importStepikCoursesAndLessons() {
  console.log('Récupération des cours Stepik...');
  const res = await fetch('https://stepik.org/api/courses?is_public=true&page=1');
  const data = await res.json();
  const courses = data.courses || [];
  console.log(`Nombre de cours récupérés : ${courses.length}`);

  for (const course of courses) {
    const courseDoc = {
      stepikId: course.id,
      title: course.title || course.slug || `Cours #${course.id}`,
      summary: course.summary || '',
      url: `https://stepik.org/course/${course.id}`,
      createdAt: new Date(),
      source: 'stepik',
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

importStepikCoursesAndLessons().catch(console.error);
