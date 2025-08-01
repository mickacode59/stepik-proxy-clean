// ...existing code...
import { Course, Lesson, Exercise, GrammarRule } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Données de base pour générer les cours
const russianTopics = [
  'Alphabet et prononciation', 'Salutations de base', 'Famille et relations', 'Nourriture et boissons',
  'Couleurs et formes', 'Nombres et comptage', 'Temps et saisons', 'Vêtements et accessoires',
  'Maison et meubles', 'Ville et transports', 'Travail et professions', 'Loisirs et hobbies',
  'Santé et corps humain', 'École et éducation', 'Technologie moderne', 'Culture russe',
  'Histoire de Russie', 'Littérature russe', 'Cuisine traditionnelle', 'Fêtes et traditions',
  'Géographie de Russie', 'Sport en Russie', 'Arts et musique', 'Cinéma russe',
  'Économie russe', 'Politique et société', 'Sciences et innovations', 'Environnement',
  'Voyages et tourisme', 'Business et commerce'
];

const grammarTopics = [
  'Les cas (nominatif, accusatif, génitif, datif, instrumental, prépositionnel)',
  'Les verbes de mouvement', 'Les aspects perfectif et imperfectif',
  'La conjugaison présent, passé, futur', 'Les adjectifs et leurs accords',
  'Les pronoms personnels et possessifs', 'Les nombres ordinaux et cardinaux',
  'Les prépositions et leur usage', 'La formation des mots',
  'L\'expression du temps', 'Les constructions impersonnelles',
  'Le style direct et indirect', 'Les participes et gérondifs',
  'Les constructions conditionnelles', 'L\'imperatif et le subjonctif'
];

const vocabularyWords = [
  { russian: 'привет', french: 'salut', phonetic: 'privét' },
  { russian: 'спасибо', french: 'merci', phonetic: 'spasiba' },
  { russian: 'пожалуйста', french: 's\'il vous plaît', phonetic: 'pazhaluysta' },
  { russian: 'да', french: 'oui', phonetic: 'da' },
  { russian: 'нет', french: 'non', phonetic: 'nyet' },
  { russian: 'дом', french: 'maison', phonetic: 'dom' },
  { russian: 'семья', french: 'famille', phonetic: 'semya' },
  { russian: 'работа', french: 'travail', phonetic: 'rabota' },
  { russian: 'школа', french: 'école', phonetic: 'shkola' },
  { russian: 'книга', french: 'livre', phonetic: 'kniga' },
  { russian: 'время', french: 'temps', phonetic: 'vremya' },
  { russian: 'день', french: 'jour', phonetic: 'den' },
  { russian: 'ночь', french: 'nuit', phonetic: 'noch' },
  { russian: 'утро', french: 'matin', phonetic: 'utro' },
  { russian: 'вечер', french: 'soir', phonetic: 'vecher' }
];

export const generateCourses = (count: number = 15000): Course[] => {
  const courses: Course[] = [];
  const levels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
  
  for (let i = 0; i < count; i++) {
    const topicIndex = i % russianTopics.length;
    const levelIndex = Math.floor(i / russianTopics.length) % levels.length;
    const courseNumber = Math.floor(i / (russianTopics.length * levels.length)) + 1;
    
    const course: Course = {
      id: uuidv4(),
      title: `${russianTopics[topicIndex]} ${courseNumber > 1 ? `- Partie ${courseNumber}` : ''}`,
      description: `Apprenez ${russianTopics[topicIndex].toLowerCase()} niveau ${levels[levelIndex]}`,
      level: levels[levelIndex],
      category: getCategory(topicIndex),
                imageUrl: '/monuments/kremlin.jpg',
      lessonsCount: Math.floor(Math.random() * 10) + 5,
      estimatedTime: Math.floor(Math.random() * 120) + 30,
      prerequisites: levelIndex > 0 ? [courses[i - russianTopics.length]?.id] : undefined,
      tags: generateTags(topicIndex, levelIndex),
      isCompleted: false,
      progress: 0,
      rating: Math.random() * 2 + 3.5,
      enrolledCount: Math.floor(Math.random() * 10000)
    };
    
    courses.push(course);
  }
  
  return courses;
};

export const generateLessons = (courseId: string, count: number = 8): Lesson[] => {
  const lessons: Lesson[] = [];
  
  for (let i = 0; i < count; i++) {
    const lesson: Lesson = {
      id: uuidv4(),
      courseId,
      title: `Leçon ${i + 1}`,
      description: `Description de la leçon ${i + 1}`,
      content: generateLessonContent(i),
      exercises: generateExercises(5),
      order: i + 1,
      estimatedTime: Math.floor(Math.random() * 30) + 15,
      isCompleted: false
    };
    
    lessons.push(lesson);
  }
  
  return lessons;
};

const generateLessonContent = (index: number) => {
  const vocabulary = vocabularyWords.slice(0, 5).map(word => ({
    ...word,
    examples: [
      {
        russian: `Это ${word.russian}`,
        french: `C'est ${word.french}`
      }
    ]
  }));

  const grammar: GrammarRule[] = [{
    title: grammarTopics[index % grammarTopics.length],
    explanation: `Explication détaillée de ${grammarTopics[index % grammarTopics.length]}`,
    examples: [
      {
        russian: 'Я читаю книгу',
        french: 'Je lis un livre'
      }
    ]
  }];

  return {
    type: 'interactive' as const,
    data: {
      text: `Contenu de la leçon avec explications détaillées...`,
      audio: `https://example.com/audio/lesson-${index}.mp3`
    },
    vocabulary,
    grammar
  };
};

const generateExercises = (count: number): Exercise[] => {
  const exercises: Exercise[] = [];
  const types: Exercise['type'][] = ['mcq', 'fill-blank', 'drag-drop', 'matching', 'pronunciation'];
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    
    exercises.push({
      id: uuidv4(),
      type,
      question: getQuestionForType(type, i),
      options: type === 'mcq' ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] : undefined,
      correctAnswer: 'Option 1',
      explanation: `Explication de la réponse correcte pour l'exercice ${i + 1}`,
      difficulty: ['easy', 'medium', 'hard'][i % 3] as Exercise['difficulty']
    });
  }
  
  return exercises;
};

const getQuestionForType = (type: Exercise['type'], index: number): string => {
  switch (type) {
    case 'mcq':
      return `Question à choix multiples ${index + 1}: Comment dit-on "bonjour" en russe ?`;
    case 'fill-blank':
      return `Complétez la phrase: Я _____ студент (Je suis étudiant)`;
    case 'drag-drop':
      return `Glissez les mots dans le bon ordre pour former une phrase correcte`;
    case 'matching':
      return `Associez les mots russes avec leur traduction française`;
    case 'pronunciation':
      return `Prononcez correctement le mot: здравствуйте`;
    default:
      return `Exercice ${index + 1}`;
  }
};

const getCategory = (topicIndex: number): string => {
  const categories = [
    'Débutant', 'Vocabulaire', 'Grammaire', 'Culture', 'Conversation',
    'Compréhension', 'Expression', 'Phonétique', 'Histoire', 'Littérature'
  ];
  return categories[topicIndex % categories.length];
};

const generateTags = (topicIndex: number, levelIndex: number): string[] => {
  const baseTags = ['russe', 'apprentissage'];
  const levelTags = ['débutant', 'intermédiaire', 'avancé'];
  const topicTags = ['vocabulaire', 'grammaire', 'culture', 'conversation', 'phonétique'];
  
  return [
    ...baseTags,
    levelTags[levelIndex],
    topicTags[topicIndex % topicTags.length]
  ];
};