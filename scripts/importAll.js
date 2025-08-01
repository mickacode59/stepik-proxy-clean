
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Utilise le chemin direct pour la clé de service
initializeApp({
  credential: cert('./scripts/serviceAccountKey.json'),
});
const db = getFirestore();

// Import des cours
const courses = JSON.parse(fs.readFileSync('./scripts/courses.json', 'utf8'));
// Import des leçons
const lessons = JSON.parse(fs.readFileSync('./scripts/lessons.json', 'utf8'));

async function importAll() {
  // Importer les cours
  for (const course of courses) {
    await db.collection('courses').add(course);
    console.log('Cours ajouté:', course.title);
  }
  // Importer les leçons
  for (const lesson of lessons) {
    await db.collection('lessons').add(lesson);
    console.log('Leçon ajoutée:', lesson.title);
  }
  console.log('Importation terminée !');
}

importAll();
