// Script Node.js pour importer des leçons dans Firestore
// Place ce fichier dans le dossier scripts/ puis lance-le avec 'node scripts/importLessons.js'


import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Utilise le chemin relatif depuis le dossier scripts/
initializeApp({
  credential: cert('./serviceAccountKey.json'),
});
const db = getFirestore();

// Lecture du fichier lessons.json (tableau de leçons)
const lessons = JSON.parse(fs.readFileSync('./lessons.json', 'utf8'));

async function importLessons() {
  for (const lesson of lessons) {
    await db.collection('lessons').add(lesson);
    console.log('Ajouté:', lesson.title);
  }
  console.log('Import terminé.');
}

importLessons();
