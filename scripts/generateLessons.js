// Script Node.js pour générer automatiquement des leçons pour chaque cours
import fs from 'fs';

// Liste des cours à enrichir (ids à adapter selon Firestore)
const courses = [
  { id: 'course1', title: 'Conversation Débutant #1' },
  { id: 'course2', title: 'Grammaire Intermédiaire #1' },
  { id: 'course3', title: 'Littérature Avancé #1' }
];

const lessonTemplates = [
  { title: 'Introduction', description: 'Présentation du cours.' },
  { title: 'Vocabulaire clé', description: 'Mots et expressions utiles.' },
  { title: 'Exercices pratiques', description: 'Mettez en pratique vos connaissances.' },
  { title: 'Dialogue', description: 'Exemple de conversation.' },
  { title: 'Quiz final', description: 'Testez vos acquis.' }
];

const lessons = [];

courses.forEach(course => {
  for (let i = 0; i < lessonTemplates.length; i++) {
    lessons.push({
      id: `${course.id}-lesson-${i+1}`,
      courseId: course.id,
      title: `Leçon ${i+1} : ${lessonTemplates[i].title}`,
      description: lessonTemplates[i].description,
      content: { type: 'text', data: `Contenu de la leçon ${i+1} pour ${course.title}.` },
      exercises: [],
      order: i+1,
      estimatedTime: 10 + i * 2,
      isCompleted: false
    });
  }
});

fs.writeFileSync('./scripts/lessons.json', JSON.stringify(lessons, null, 2));
console.log('Leçons générées automatiquement dans lessons.json');
