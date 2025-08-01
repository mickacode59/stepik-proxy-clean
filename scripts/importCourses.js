// Script Node.js pour importer des cours existants dans Firestore
// Place ce fichier dans le dossier scripts/ puis lance-le avec 'node scripts/importCourses.js'

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialise Firebase Admin avec la clé de service
initializeApp({
  credential: cert('./scripts/serviceAccountKey.json'),
});
const db = getFirestore();

// Lecture du fichier courses.json avec chemin compatible ES modules
const courses = JSON.parse(fs.readFileSync(new URL('./courses.json', import.meta.url), 'utf8'));

async function importCourses() {
  for (const course of courses) {
    await db.collection('courses').add(course);
    console.log('Ajouté:', course.title);
  }
  console.log('Import terminé.');
}

importCourses();
