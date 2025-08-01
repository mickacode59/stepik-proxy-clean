// Script Node.js pour ajouter 12 000 cours dans Firestore
// À lancer en local (node scripts/seedCoursesFirestore.js)

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialisation Firebase Admin
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const modules = [
  'Général', 'Conversation', 'Grammaire', 'Littérature', 'Vocabulaire',
  'Prononciation', 'Conjugaison', 'Compréhension orale', 'Écriture', 'Culture', 'Lecture'
];

async function seedCourses() {
  for (let i = 0; i < 12000; i++) {
    const moduleIndex = i % modules.length;
    const level = i % 3 === 0 ? 'beginner' : i % 3 === 1 ? 'intermediate' : 'advanced';
    const course = {
      title: `${modules[moduleIndex]} ${level === 'beginner' ? 'Débutant' : level === 'intermediate' ? 'Intermédiaire' : 'Avancé'} #${Math.floor(i / modules.length) + 1}`,
      description: `Cours ${i + 1} du module ${modules[moduleIndex]} (${level}) pour progresser en russe.`,
      level,
      category: modules[moduleIndex],
      imageUrl: `https://source.unsplash.com/600x400/?russia,${modules[moduleIndex]},${level}`,
      lessonsCount: 8 + (i % 15),
      estimatedTime: 60 + (i % 90),
      tags: [modules[moduleIndex].toLowerCase(), level],
      isCompleted: false,
      progress: 0,
      rating: 4 + ((i % 10) * 0.1),
      enrolledCount: 100 + (i % 2000),
    };
    await db.collection('courses').add(course);
    if ((i+1) % 100 === 0) console.log(`Ajouté: ${i+1} cours...`);
  }
  console.log('Seed terminé !');
}

seedCourses();
