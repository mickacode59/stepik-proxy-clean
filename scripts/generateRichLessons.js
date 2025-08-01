// Script Node.js pour générer des leçons enrichies et variées
import fs from 'fs';

const courses = [
  { id: 'course1', title: 'Conversation Débutant #1' },
  { id: 'course2', title: 'Grammaire Intermédiaire #1' },
  { id: 'course3', title: 'Littérature Avancé #1' }
];

const lessonSets = {
  'course1': [
    {
      title: 'Se présenter',
      description: 'Apprendre à se présenter en russe avec des exemples de dialogues.',
      content: { type: 'text', data: 'Dialogue : - Привет! Как тебя зовут? - Меня зовут Анна. А тебя?' }
    },
    {
      title: 'Vocabulaire de la famille',
      description: 'Les mots essentiels pour parler de la famille.',
      content: { type: 'text', data: 'Мама (maman), Папа (papa), Брат (frère), Сестра (soeur)...' }
    },
    {
      title: 'Commander au restaurant',
      description: 'Expressions et vocabulaire pour commander à manger.',
      content: { type: 'text', data: 'Je voudrais une soupe : Я хочу суп. L’addition, s’il vous plaît : Счёт, пожалуйста.' }
    },
    {
      title: 'Exercices de compréhension orale',
      description: 'Écoutez un dialogue et répondez aux questions.',
      content: { type: 'audio', data: 'audio-url-exemple' }
    },
    {
      title: 'Quiz : Conversation',
      description: 'Testez vos acquis sur la conversation.',
      content: { type: 'interactive', data: 'Quiz interactif sur les phrases de base.' }
    }
  ],
  'course2': [
    {
      title: 'Les cas russes',
      description: 'Comprendre et utiliser les six cas grammaticaux.',
      content: { type: 'text', data: 'Exemples : Я вижу стол (accusatif), Я думаю о книге (prépositionnel)...' }
    },
    {
      title: 'Verbes de mouvement',
      description: 'Différence entre идти, ходить, ехать, ездить.',
      content: { type: 'text', data: 'Идти (aller à pied, une fois), Ходить (aller à pied, régulièrement)...' }
    },
    {
      title: 'Accord des adjectifs',
      description: 'Règles et exercices sur l’accord des adjectifs.',
      content: { type: 'text', data: 'Exercice : Красивый дом, красивая машина, красивое окно.' }
    },
    {
      title: 'Exercices de traduction',
      description: 'Traduisez des phrases du français au russe.',
      content: { type: 'interactive', data: 'Traduisez : "Je vais à l’école".' }
    },
    {
      title: 'Quiz : Grammaire',
      description: 'Quiz sur les points clés de la grammaire russe.',
      content: { type: 'interactive', data: 'Quiz interactif sur les cas et verbes.' }
    }
  ],
  'course3': [
    {
      title: 'Introduction à la littérature russe',
      description: 'Présentation des grands auteurs russes.',
      content: { type: 'text', data: 'Pouchkine, Tolstoï, Dostoïevski, Tchekhov...' }
    },
    {
      title: 'Lecture : extrait de Dostoïevski',
      description: 'Analyse d’un extrait des "Frères Karamazov".',
      content: { type: 'text', data: 'Extrait : "Tout le monde est responsable de tout devant tous".' }
    },
    {
      title: 'Vocabulaire littéraire',
      description: 'Mots et expressions pour parler de littérature.',
      content: { type: 'text', data: 'Roman (роман), Poème (стихотворение), Auteur (автор)...' }
    },
    {
      title: 'Exercice de compréhension écrite',
      description: 'Répondez à des questions sur un texte littéraire.',
      content: { type: 'interactive', data: 'Questions sur le texte lu.' }
    },
    {
      title: 'Quiz : Littérature russe',
      description: 'Quiz sur les auteurs et œuvres russes.',
      content: { type: 'interactive', data: 'Quiz interactif sur la littérature.' }
    }
  ]
};

const lessons = [];

courses.forEach(course => {
  const set = lessonSets[course.id];
  set.forEach((template, i) => {
    lessons.push({
      id: `${course.id}-lesson-${i+1}`,
      courseId: course.id,
      title: `Leçon ${i+1} : ${template.title}`,
      description: template.description,
      content: template.content,
      exercises: [],
      order: i+1,
      estimatedTime: 12 + i * 3,
      isCompleted: false
    });
  });
});

fs.writeFileSync('./scripts/lessons.json', JSON.stringify(lessons, null, 2));
console.log('Leçons enrichies générées dans lessons.json');
