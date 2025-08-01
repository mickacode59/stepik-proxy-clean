// Script pour ajouter des cours de test dans Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'VOTRE_API_KEY',
  authDomain: 'VOTRE_AUTH_DOMAIN',
  projectId: 'VOTRE_PROJECT_ID',
  storageBucket: 'VOTRE_STORAGE_BUCKET',
  messagingSenderId: 'VOTRE_MESSAGING_SENDER_ID',
  appId: 'VOTRE_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const courses = [
  {
    title: 'Russe Débutant',
    description: 'Commencez à apprendre le russe de zéro avec des bases solides.',
    level: 'beginner',
    category: 'Général',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 12,
    estimatedTime: 90,
    tags: ['alphabet', 'bases', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 1200,
  },
  {
    title: 'Conversation courante',
    description: 'Apprenez à tenir une conversation simple en russe.',
    level: 'beginner',
    category: 'Conversation',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 10,
    estimatedTime: 75,
    tags: ['conversation', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 950,
  },
  {
    title: 'Grammaire intermédiaire',
    description: 'Maîtrisez les points clés de la grammaire russe.',
    level: 'intermediate',
    category: 'Grammaire',
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 15,
    estimatedTime: 120,
    tags: ['grammaire', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 800,
  },
  {
    title: 'Russe avancé',
    description: 'Perfectionnez votre russe avec des textes et dialogues complexes.',
    level: 'advanced',
    category: 'Littérature',
    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 18,
    estimatedTime: 150,
    tags: ['avancé', 'littérature'],
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledCount: 500,
  },
  {
    title: 'Vocabulaire thématique',
    description: 'Enrichissez votre vocabulaire par thèmes (voyage, travail, famille...).',
    level: 'intermediate',
    category: 'Vocabulaire',
    imageUrl: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 14,
    estimatedTime: 100,
    tags: ['vocabulaire', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.4,
    enrolledCount: 700,
  },
];

async function seedCourses() {
  for (const course of courses) {
    await addDoc(collection(db, 'courses'), course);
    console.log(`Ajouté : ${course.title}`);
  }
  console.log('Tous les cours ont été ajoutés !');
}

seedCourses();
