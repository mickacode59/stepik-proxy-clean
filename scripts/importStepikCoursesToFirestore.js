// Script d'importation des cours Stepik dans Firestore
// Usage : node scripts/importStepikCoursesToFirestore.js

const fetch = require('node-fetch');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importStepikCourses() {
  console.log('Récupération des cours Stepik...');
  const res = await fetch('https://stepik.org/api/courses?is_public=true&page=1');
  const data = await res.json();
  const courses = data.courses || [];
  console.log(`Nombre de cours récupérés : ${courses.length}`);

  for (const course of courses) {
    const doc = {
      stepikId: course.id,
      title: course.title || course.slug || `Cours #${course.id}`,
      summary: course.summary || '',
      url: `https://stepik.org/course/${course.id}`,
      createdAt: new Date(),
      source: 'stepik',
    };
    await db.collection('courses').doc(String(course.id)).set(doc);
    console.log(`Importé : ${doc.title}`);
  }
  console.log('Importation terminée.');
}

importStepikCourses().catch(console.error);
