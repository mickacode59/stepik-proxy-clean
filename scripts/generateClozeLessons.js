// Génère des leçons avec texte à trous pour chaque cours
import fs from 'fs';

const courses = [
  { id: 'course1', title: 'Conversation Débutant #1' },
  { id: 'course2', title: 'Grammaire Intermédiaire #1' },
  { id: 'course3', title: 'Littérature Avancé #1' }
];

const clozeExercises = [
  {
    instruction: 'Complétez la phrase russe avec le mot manquant.',
    text: 'Я ___ студент.',
    answer: 'русский'
  },
  {
    instruction: 'Complétez la salutation.',
    text: '___ утро!',
    answer: 'Доброе'
  },
  {
    instruction: 'Complétez la phrase.',
    text: 'Меня зовут ___ .',
    answer: 'Анна'
  }
];

const lessons = [];

courses.forEach(course => {
  for (let i = 0; i < clozeExercises.length; i++) {
    lessons.push({
      id: `${course.id}-cloze-${i+1}`,
      courseId: course.id,
      title: `Texte à trous ${i+1}`,
      description: clozeExercises[i].instruction,
      content: { type: 'cloze', data: clozeExercises[i].text },
      exercises: [
        {
          type: 'cloze',
          text: clozeExercises[i].text,
          answer: clozeExercises[i].answer
        }
      ],
      order: i+10,
      estimatedTime: 8 + i * 2,
      isCompleted: false
    });
  }
});

fs.writeFileSync('./scripts/lessons.json', JSON.stringify(lessons, null, 2));
console.log('Leçons texte à trous générées dans lessons.json');
