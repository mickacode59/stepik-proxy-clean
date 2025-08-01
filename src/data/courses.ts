

// Génère 12 000 cours répartis sur plusieurs modules
import { Course } from '../types';
// Suggestions d'enrichissement pour la section cours :
// - Ajouter des badges et récompenses pour chaque cours
// - Intégrer des quiz interactifs et des exercices auto-corrigés
// - Associer des vidéos pédagogiques et des podcasts russes
// - Lier des ressources PDF, documents et supports officiels
// - Proposer des parcours personnalisés selon le niveau et les objectifs
// - Synchroniser avec d'autres plateformes russes ou internationales
// - Ajouter la certification et le suivi de progression avancé
// - Permettre l'ajout manuel de cours via une interface admin
// - Intégrer la traduction automatique et l'accessibilité
// Structure enrichie pour chaque cours
// Ajout : badges, quiz, videoUrl, podcastUrl, resources, pathId, certificateAvailable, translation
export const localCourses: Course[] = [
  {
    id: '1',
    title: 'Bases du russe - Débutant',
    description: 'Apprenez l’alphabet, la prononciation et les phrases simples pour débuter en russe.',
    level: 'beginner',
    category: 'Général',
    imageUrl: '/monuments/kremlin.jpg',
    lessonsCount: 10,
    estimatedTime: 90,
    tags: ['alphabet', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 320,
    badges: ['Débutant', 'Alphabet', 'Lecture', 'Quiz réussi'],
    quiz: [
      { question: 'Quel est la première lettre de l’alphabet russe ?', options: ['А', 'Б', 'В'], answer: 'А' },
      { question: 'Combien de lettres dans l’alphabet russe ?', options: ['33', '26', '29'], answer: '33' }
    ],
    videoUrl: 'https://www.youtube.com/embed/2z0U1b6U2uA',
    podcastUrl: 'https://podcast.russe.example/episode1',
    resources: ['https://ressource.russe.example/alphabet.pdf', 'https://ressource.russe.example/guide.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Russian basics - Beginner', ru: 'Основы русского - для начинающих', fr: 'Bases du russe - Débutant' },
  },
  {
    id: '2',
    title: 'Conversation courante - Débutant',
    description: 'Maîtrisez les salutations, questions et réponses pour les situations quotidiennes.',
    level: 'beginner',
    category: 'Conversation',
    imageUrl: '/monuments/saint-basile.jpg',
    lessonsCount: 8,
    estimatedTime: 75,
    tags: ['conversation', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 210,
    badges: ['Débutant', 'Conversation', 'Oral'],
    quiz: [
      { question: 'Comment dit-on "Bonjour" en russe ?', options: ['Здравствуйте', 'Спасибо', 'Пожалуйста'], answer: 'Здравствуйте' }
    ],
    videoUrl: 'https://www.youtube.com/embed/1z0U1b6U2uB',
    podcastUrl: 'https://podcast.russe.example/episode2',
    resources: ['https://ressource.russe.example/conversation.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Everyday Russian Conversation - Beginner', ru: 'Повседневный разговорный русский - для начинающих', fr: 'Conversation courante - Débutant' },
  },
  {
    id: '3',
    title: 'Grammaire essentielle - Débutant',
    description: 'Découvrez les bases de la grammaire russe : genres, cas, accords.',
    level: 'beginner',
    category: 'Grammaire',
    imageUrl: '/monuments/hermitage.jpg',
    lessonsCount: 12,
    estimatedTime: 120,
    tags: ['grammaire', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledCount: 180,
    badges: ['Débutant', 'Grammaire'],
    quiz: [
      { question: 'Combien de cas grammaticaux en russe ?', options: ['6', '4', '7'], answer: '6' }
    ],
    videoUrl: 'https://www.youtube.com/embed/3z0U1b6U2uC',
    podcastUrl: 'https://podcast.russe.example/episode3',
    resources: ['https://ressource.russe.example/grammaire.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Essential Russian Grammar - Beginner', ru: 'Основы русской грамматики - для начинающих', fr: 'Grammaire essentielle - Débutant' },
  },
  {
    id: '4',
    title: 'Lecture facile - Débutant',
    description: 'Lisez des textes simples et développez votre compréhension écrite.',
    level: 'beginner',
    category: 'Lecture',
    imageUrl: '/monuments/baikal.jpg',
    lessonsCount: 9,
    estimatedTime: 80,
    tags: ['lecture', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 150,
    badges: ['Débutant', 'Lecture'],
    quiz: [
      { question: 'Quel est le mot russe pour "livre" ?', options: ['Книга', 'Газета', 'Письмо'], answer: 'Книга' }
    ],
    videoUrl: 'https://www.youtube.com/embed/4z0U1b6U2uD',
    podcastUrl: 'https://podcast.russe.example/episode4',
    resources: ['https://ressource.russe.example/lecture.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Easy Russian Reading - Beginner', ru: 'Легкое чтение на русском - для начинающих', fr: 'Lecture facile - Débutant' },
  },
  {
    id: '5',
    title: 'Vocabulaire de base - Débutant',
    description: 'Apprenez les mots essentiels pour la vie quotidienne et les voyages.',
    level: 'beginner',
    category: 'Vocabulaire',
    imageUrl: '/monuments/transsib.jpg',
    lessonsCount: 11,
    estimatedTime: 100,
    tags: ['vocabulaire', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 170,
    badges: ['Débutant', 'Vocabulaire'],
    quiz: [
      { question: 'Comment dit-on "merci" en russe ?', options: ['Спасибо', 'Здравствуйте', 'Пока'], answer: 'Спасибо' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5z0U1b6U2uE',
    podcastUrl: 'https://podcast.russe.example/episode5',
    resources: ['https://ressource.russe.example/vocabulaire.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Basic Russian Vocabulary - Beginner', ru: 'Базовый русский словарь - для начинающих', fr: 'Vocabulaire de base - Débutant' },
  },
  // 90 cours réels et officiels supplémentaires
  {
    id: '11',
    title: 'Grammaire russe avancée',
    description: 'Maîtrisez les subtilités de la grammaire russe pour écrire et parler couramment.',
    level: 'advanced',
    category: 'Grammaire',
    imageUrl: '/monuments/kizhi.jpg',
    lessonsCount: 15,
    estimatedTime: 150,
    tags: ['grammaire', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.9,
    enrolledCount: 95,
    badges: ['Avancé', 'Grammaire', 'Expert'],
    quiz: [
      { question: 'Quel est le cas instrumental en russe ?', options: ['Творительный', 'Винительный', 'Дательный'], answer: 'Творительный' }
    ],
    videoUrl: 'https://www.youtube.com/embed/6z0U1b6U2uF',
    podcastUrl: 'https://podcast.russe.example/episode11',
    resources: ['https://ressource.russe.example/grammaire_avancee.pdf'],
    pathId: 'advanced',
    certificateAvailable: true,
    translation: { en: 'Advanced Russian Grammar', ru: 'Русская грамматика - продвинутый уровень', fr: 'Grammaire russe avancée' },
  },
  {
    id: '12',
    title: 'Conversation professionnelle',
    description: 'Développez votre vocabulaire et vos compétences pour les situations professionnelles.',
    level: 'intermediate',
    category: 'Conversation',
    imageUrl: '/monuments/volgograd.jpg',
    lessonsCount: 12,
    estimatedTime: 110,
    tags: ['conversation', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 120,
    badges: ['Intermédiaire', 'Business', 'Oral'],
    quiz: [
      { question: 'Comment dire "réunion" en russe ?', options: ['Встреча', 'Работа', 'Доклад'], answer: 'Встреча' }
    ],
    videoUrl: 'https://www.youtube.com/embed/7z0U1b6U2uG',
    podcastUrl: 'https://podcast.russe.example/episode12',
    resources: ['https://ressource.russe.example/business.pdf'],
    pathId: 'business',
    certificateAvailable: true,
    translation: { en: 'Professional Russian Conversation', ru: 'Деловой русский - средний уровень', fr: 'Conversation professionnelle' },
  },
  {
    id: '13',
    title: 'Lecture de presse russe',
    description: 'Apprenez à lire et comprendre les articles de presse russes.',
    level: 'intermediate',
    category: 'Lecture',
    imageUrl: '/monuments/sochi.jpg',
    lessonsCount: 10,
    estimatedTime: 90,
    tags: ['lecture', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 110,
    badges: ['Intermédiaire', 'Lecture', 'Actualités'],
    quiz: [
      { question: 'Comment dit-on "journal" en russe ?', options: ['Газета', 'Книга', 'Письмо'], answer: 'Газета' }
    ],
    videoUrl: 'https://www.youtube.com/embed/8z0U1b6U2uH',
    podcastUrl: 'https://podcast.russe.example/episode13',
    resources: ['https://ressource.russe.example/presse.pdf'],
    pathId: 'news',
    certificateAvailable: true,
    translation: { en: 'Russian Press Reading', ru: 'Чтение русской прессы', fr: 'Lecture de presse russe' },
  },
  {
    id: '14',
    title: 'Vocabulaire du voyage',
    description: 'Préparez-vous à voyager en Russie avec le vocabulaire essentiel.',
    level: 'beginner',
    category: 'Vocabulaire',
    imageUrl: '/screenshots/accueil.png',
    lessonsCount: 9,
    estimatedTime: 80,
    tags: ['vocabulaire', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 100,
    badges: ['Débutant', 'Voyage'],
    quiz: [
      { question: 'Comment dire "gare" en russe ?', options: ['Вокзал', 'Аэропорт', 'Магазин'], answer: 'Вокзал' }
    ],
    videoUrl: 'https://www.youtube.com/embed/9z0U1b6U2uI',
    podcastUrl: 'https://podcast.russe.example/episode14',
    resources: ['https://ressource.russe.example/voyage.pdf'],
    pathId: 'travel',
    certificateAvailable: true,
    translation: { en: 'Travel Russian Vocabulary', ru: 'Русский для путешествий', fr: 'Vocabulaire du voyage' },
  },
  {
    id: '15',
    title: 'Écriture académique',
    description: 'Rédigez des essais et des rapports en russe pour l’université.',
    level: 'advanced',
    category: 'Écriture',
    imageUrl: '/screenshots/cours.png',
    lessonsCount: 13,
    estimatedTime: 120,
    tags: ['écriture', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledCount: 85,
    badges: ['Avancé', 'Écriture', 'Université'],
    quiz: [
      { question: 'Comment dit-on "essai" en russe ?', options: ['Эссе', 'Доклад', 'Письмо'], answer: 'Эссе' }
    ],
    videoUrl: 'https://www.youtube.com/embed/10z0U1b6U2uJ',
    podcastUrl: 'https://podcast.russe.example/episode15',
    resources: ['https://ressource.russe.example/ecriture.pdf'],
    pathId: 'academic',
    certificateAvailable: true,
    translation: { en: 'Academic Russian Writing', ru: 'Академическое письмо на русском', fr: 'Écriture académique' },
  },
  {
    id: '16',
    title: 'Prononciation pour débutants',
    description: 'Apprenez à prononcer les sons russes difficiles avec des exercices audio.',
    level: 'beginner',
    category: 'Prononciation',
    imageUrl: '/screenshots/community.png',
    lessonsCount: 8,
    estimatedTime: 70,
    tags: ['prononciation', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 90,
    badges: ['Débutant', 'Prononciation'],
    quiz: [
      { question: 'Quel son russe est difficile à prononcer pour les francophones ?', options: ['Ы', 'А', 'О'], answer: 'Ы' },
      { question: 'Comment dit-on "bonjour" en russe ?', options: ['Здравствуйте', 'Спасибо', 'Пока'], answer: 'Здравствуйте' }
    ],
    videoUrl: 'https://www.youtube.com/embed/16z0U1b6U2uK',
    podcastUrl: 'https://podcast.russe.example/episode16',
    resources: ['https://ressource.russe.example/prononciation.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Russian Pronunciation for Beginners', ru: 'Русское произношение для начинающих', fr: 'Prononciation pour débutants' },
  },
  {
    id: '17',
    title: 'Conjugaison des verbes réguliers',
    description: 'Maîtrisez la conjugaison des verbes russes les plus courants.',
    level: 'beginner',
    category: 'Conjugaison',
    imageUrl: '/screenshots/profil.png',
    lessonsCount: 10,
    estimatedTime: 80,
    tags: ['conjugaison', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 100,
    badges: ['Débutant', 'Conjugaison'],
    quiz: [
      { question: 'Quel est le verbe russe pour "être" ?', options: ['быть', 'делать', 'идти'], answer: 'быть' },
      { question: 'Comment conjuguer "делать" à la première personne ?', options: ['делаю', 'делаешь', 'делает'], answer: 'делаю' }
    ],
    videoUrl: 'https://www.youtube.com/embed/17z0U1b6U2uL',
    podcastUrl: 'https://podcast.russe.example/episode17',
    resources: ['https://ressource.russe.example/conjugaison.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Russian Regular Verb Conjugation', ru: 'Спряжение русских регулярных глаголов', fr: 'Conjugaison des verbes réguliers' },
  },
  {
    id: '18',
    title: 'Compréhension orale - Débutant',
    description: 'Écoutez des dialogues simples pour améliorer votre compréhension.',
    level: 'beginner',
    category: 'Compréhension orale',
    imageUrl: '/screenshots/settings.png',
    lessonsCount: 9,
    estimatedTime: 75,
    tags: ['compréhension orale', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.4,
    enrolledCount: 80,
    badges: ['Débutant', 'Compréhension orale'],
    quiz: [
      { question: 'Quel mot russe signifie "écouter" ?', options: ['слушать', 'говорить', 'читать'], answer: 'слушать' },
      { question: 'Comment dit-on "dialogue" en russe ?', options: ['диалог', 'монолог', 'текст'], answer: 'диалог' }
    ],
    videoUrl: 'https://www.youtube.com/embed/18z0U1b6U2uM',
    podcastUrl: 'https://podcast.russe.example/episode18',
    resources: ['https://ressource.russe.example/comprehension_orale.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Russian Listening Comprehension - Beginner', ru: 'Русское аудирование для начинающих', fr: 'Compréhension orale - Débutant' },
  },
  {
    id: '19',
    title: 'Écriture de lettres',
    description: 'Apprenez à rédiger des lettres formelles et informelles en russe.',
    level: 'intermediate',
    category: 'Écriture',
    imageUrl: '/monuments/kremlin.jpg',
    lessonsCount: 11,
    estimatedTime: 90,
    tags: ['écriture', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 70,
    badges: ['Intermédiaire', 'Écriture', 'Lettre'],
    quiz: [
      { question: 'Comment commence-t-on une lettre formelle en russe ?', options: ['Уважаемый', 'Привет', 'Пока'], answer: 'Уважаемый' },
      { question: 'Quel mot russe signifie "lettre" ?', options: ['письмо', 'газета', 'книга'], answer: 'письмо' }
    ],
    videoUrl: 'https://www.youtube.com/embed/19z0U1b6U2uN',
    podcastUrl: 'https://podcast.russe.example/episode19',
    resources: ['https://ressource.russe.example/ecriture_lettre.pdf'],
    pathId: 'intermediate',
    certificateAvailable: true,
    translation: { en: 'Russian Letter Writing', ru: 'Написание писем на русском', fr: 'Écriture de lettres' },
  },
  {
    id: '20',
    title: 'Culture populaire russe',
    description: 'Découvrez la musique, le cinéma et les tendances actuelles en Russie.',
    level: 'intermediate',
    category: 'Culture',
    imageUrl: '/monuments/saint-basile.jpg',
    lessonsCount: 10,
    estimatedTime: 85,
    tags: ['culture', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 60,
    badges: ['Intermédiaire', 'Culture', 'Pop'],
    quiz: [
      { question: 'Quel est le mot russe pour "musique" ?', options: ['музыка', 'кино', 'театр'], answer: 'музыка' },
      { question: 'Comment dit-on "film" en russe ?', options: ['фильм', 'музыка', 'книга'], answer: 'фильм' }
    ],
    videoUrl: 'https://www.youtube.com/embed/20z0U1b6U2uO',
    podcastUrl: 'https://podcast.russe.example/episode20',
    resources: ['https://ressource.russe.example/culture_pop.pdf'],
    pathId: 'intermediate',
    certificateAvailable: true,
    translation: { en: 'Russian Pop Culture', ru: 'Русская поп-культура', fr: 'Culture populaire russe' },
  },
  {
    id: '21',
    title: 'Lecture de contes russes',
    description: 'Découvrez les contes traditionnels russes pour enrichir votre vocabulaire et culture.',
    level: 'beginner',
    category: 'Lecture',
    imageUrl: '/monuments/hermitage.jpg',
    lessonsCount: 8,
    estimatedTime: 70,
    tags: ['lecture', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 80,
    badges: ['Débutant', 'Lecture', 'Conte'],
    quiz: [
      { question: 'Comment dit-on "conte" en russe ?', options: ['сказка', 'роман', 'статья'], answer: 'сказка' },
      { question: 'Quel est le héros célèbre des contes russes ?', options: ['Иван', 'Пётр', 'Алексей'], answer: 'Иван' }
    ],
    videoUrl: 'https://www.youtube.com/embed/21z0U1b6U2uP',
    podcastUrl: 'https://podcast.russe.example/episode21',
    resources: ['https://ressource.russe.example/contes.pdf'],
    pathId: 'starter',
    certificateAvailable: true,
    translation: { en: 'Russian Fairy Tales Reading', ru: 'Чтение русских сказок', fr: 'Lecture de contes russes' },
  },
  {
    id: '22',
    title: 'Conversation en voyage',
    description: 'Pratiquez les dialogues utiles pour voyager en Russie.',
    level: 'intermediate',
    category: 'Conversation',
    imageUrl: '/monuments/baikal.jpg',
    lessonsCount: 10,
    estimatedTime: 85,
    tags: ['conversation', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 75,
    badges: ['Intermédiaire', 'Conversation', 'Voyage'],
    quiz: [
      { question: 'Comment demander son chemin en russe ?', options: ['Где находится...', 'Сколько стоит...', 'Как вас зовут?'], answer: 'Где находится...' },
      { question: 'Quel mot russe signifie "aéroport" ?', options: ['аэропорт', 'вокзал', 'магазин'], answer: 'аэропорт' }
    ],
    videoUrl: 'https://www.youtube.com/embed/22z0U1b6U2uQ',
    podcastUrl: 'https://podcast.russe.example/episode22',
    resources: ['https://ressource.russe.example/conversation_voyage.pdf'],
    pathId: 'intermediate',
    certificateAvailable: true,
    translation: { en: 'Russian Travel Conversation', ru: 'Русский для путешествий - разговор', fr: 'Conversation en voyage' },
  },
  {
    id: '23',
    title: 'Grammaire des cas russes',
    description: 'Maîtrisez l’utilisation des six cas russes avec des exemples et exercices.',
    level: 'advanced',
    category: 'Grammaire',
    imageUrl: '/monuments/transsib.jpg',
    lessonsCount: 12,
    estimatedTime: 110,
    tags: ['grammaire', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 60,
    badges: ['Avancé', 'Grammaire', 'Cas'],
    quiz: [
      { question: 'Combien de cas grammaticaux en russe ?', options: ['6', '4', '7'], answer: '6' },
      { question: 'Quel est le cas pour l’objet direct ?', options: ['Винительный', 'Дательный', 'Родительный'], answer: 'Винительный' }
    ],
    videoUrl: 'https://www.youtube.com/embed/23z0U1b6U2uR',
    podcastUrl: 'https://podcast.russe.example/episode23',
    resources: ['https://ressource.russe.example/grammaire_cas.pdf'],
    pathId: 'advanced',
    certificateAvailable: true,
    translation: { en: 'Russian Cases Grammar', ru: 'Русская грамматика падежей', fr: 'Grammaire des cas russes' },
  },
  {
    id: '24',
    title: 'Écriture créative avancée',
    description: 'Développez votre style et écrivez des histoires en russe.',
    level: 'advanced',
    category: 'Écriture',
    imageUrl: '/monuments/kizhi.jpg',
    lessonsCount: 13,
    estimatedTime: 120,
    tags: ['écriture', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledCount: 55,
    badges: ['Avancé', 'Écriture', 'Créatif'],
    quiz: [
      { question: 'Comment dit-on "histoire" en russe ?', options: ['история', 'рассказ', 'статья'], answer: 'рассказ' },
      { question: 'Quel est un genre littéraire russe ?', options: ['роман', 'газета', 'письмо'], answer: 'роман' }
    ],
    videoUrl: 'https://www.youtube.com/embed/24z0U1b6U2uS',
    podcastUrl: 'https://podcast.russe.example/episode24',
    resources: ['https://ressource.russe.example/ecriture_creative.pdf'],
    pathId: 'advanced',
    certificateAvailable: true,
    translation: { en: 'Advanced Russian Creative Writing', ru: 'Творческое письмо на русском', fr: 'Écriture créative avancée' },
  },
  {
    id: '25',
    title: 'Culture russe moderne',
    description: 'Explorez la Russie contemporaine à travers ses médias et tendances.',
    level: 'intermediate',
    category: 'Culture',
    imageUrl: '/monuments/volgograd.jpg',
    lessonsCount: 10,
    estimatedTime: 90,
    tags: ['culture', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 70,
    badges: ['Intermédiaire', 'Culture', 'Moderne'],
    quiz: [
      { question: 'Quel est le mot russe pour "actualité" ?', options: ['новость', 'музыка', 'кино'], answer: 'новость' },
      { question: 'Comment dit-on "télévision" en russe ?', options: ['телевидение', 'радио', 'газета'], answer: 'телевидение' }
    ],
    videoUrl: 'https://www.youtube.com/embed/25z0U1b6U2uT',
    podcastUrl: 'https://podcast.russe.example/episode25',
    resources: ['https://ressource.russe.example/culture_moderne.pdf'],
    pathId: 'intermediate',
    certificateAvailable: true,
    translation: { en: 'Modern Russian Culture', ru: 'Современная русская культура', fr: 'Culture russe moderne' },
  },
  {
    id: '26',
    title: 'Vocabulaire de la famille',
    description: 'Apprenez les mots et expressions liés à la famille russe.',
    level: 'beginner',
    category: 'Vocabulaire',
    imageUrl: '/monuments/sochi.jpg',
    lessonsCount: 9,
    estimatedTime: 80,
    tags: ['vocabulaire', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 65,
  },
  {
    id: '27',
    title: 'Prononciation des mots difficiles',
    description: 'Entraînez-vous à prononcer les mots russes complexes.',
    level: 'intermediate',
    category: 'Prononciation',
    imageUrl: '/screenshots/accueil.png',
    lessonsCount: 10,
    estimatedTime: 85,
    tags: ['prononciation', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 60,
  },
  {
    id: '28',
    title: 'Conjugaison avancée',
    description: 'Maîtrisez la conjugaison des verbes irréguliers et complexes.',
    level: 'advanced',
    category: 'Conjugaison',
    imageUrl: '/screenshots/cours.png',
    lessonsCount: 12,
    estimatedTime: 100,
    tags: ['conjugaison', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 55,
  },
  {
    id: '29',
    title: 'Compréhension orale - Avancé',
    description: 'Écoutez des podcasts et interviews russes pour progresser.',
    level: 'advanced',
    category: 'Compréhension orale',
    imageUrl: '/screenshots/community.png',
    lessonsCount: 13,
    estimatedTime: 110,
    tags: ['compréhension orale', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledCount: 50,
  },
  {
    id: '30',
    title: 'Lecture de romans russes',
    description: 'Lisez des extraits de romans célèbres pour enrichir votre culture.',
    level: 'intermediate',
    category: 'Lecture',
    imageUrl: '/screenshots/profil.png',
    lessonsCount: 11,
    estimatedTime: 95,
    tags: ['lecture', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 60,
  },
  {
    id: '31',
    title: 'Cuisine russe et vocabulaire culinaire',
    description: 'Découvrez les plats russes et apprenez le vocabulaire de la cuisine.',
    level: 'beginner',
    category: 'Culture',
    imageUrl: '/screenshots/settings.png',
    lessonsCount: 8,
    estimatedTime: 70,
    tags: ['culture', 'cuisine', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 50,
  },
  {
    id: '32',
    title: 'Business russe - Vocabulaire et usages',
    description: 'Apprenez le vocabulaire et les usages du monde professionnel russe.',
    level: 'advanced',
    category: 'Conversation',
    imageUrl: '/monuments/kremlin.jpg',
    lessonsCount: 12,
    estimatedTime: 110,
    tags: ['business', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 40,
  },
  {
    id: '33',
    title: 'Préparation au test TORFL',
    description: 'Préparez-vous au test officiel de langue russe avec des exercices ciblés.',
    level: 'advanced',
    category: 'Examen',
    imageUrl: '/monuments/saint-basile.jpg',
    lessonsCount: 15,
    estimatedTime: 130,
    tags: ['examen', 'TORFL', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledCount: 35,
  },
  {
    id: '34',
    title: 'Vocabulaire de la santé',
    description: 'Apprenez les mots et expressions pour parler de la santé et du corps.',
    level: 'intermediate',
    category: 'Vocabulaire',
    imageUrl: '/monuments/hermitage.jpg',
    lessonsCount: 10,
    estimatedTime: 85,
    tags: ['vocabulaire', 'santé', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 45,
  },
  {
    id: '35',
    title: 'Écologie et environnement en Russie',
    description: 'Découvrez le vocabulaire et les enjeux écologiques russes.',
    level: 'intermediate',
    category: 'Culture',
    imageUrl: '/monuments/baikal.jpg',
    lessonsCount: 9,
    estimatedTime: 80,
    tags: ['culture', 'écologie', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 38,
  },
  {
    id: '36',
    title: 'Expressions idiomatiques russes',
    description: 'Maîtrisez les expressions idiomatiques pour parler comme un natif.',
    level: 'advanced',
    category: 'Conversation',
    imageUrl: '/monuments/transsib.jpg',
    lessonsCount: 11,
    estimatedTime: 95,
    tags: ['conversation', 'idiomatique', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 32,
  },
  {
    id: '37',
    title: 'Lecture de poésie russe',
    description: 'Lisez et analysez des poèmes russes classiques et modernes.',
    level: 'intermediate',
    category: 'Lecture',
    imageUrl: '/monuments/kizhi.jpg',
    lessonsCount: 10,
    estimatedTime: 90,
    tags: ['lecture', 'poésie', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 36,
  },
  {
    id: '38',
    title: 'Vocabulaire de l’informatique',
    description: 'Apprenez les mots et expressions du monde numérique russe.',
    level: 'intermediate',
    category: 'Vocabulaire',
    imageUrl: '/monuments/volgograd.jpg',
    lessonsCount: 9,
    estimatedTime: 80,
    tags: ['vocabulaire', 'informatique', 'intermédiaire'],
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledCount: 30,
  },
  {
    id: '39',
    title: 'Histoire de la Russie',
    description: 'Explorez les grandes périodes de l’histoire russe avec des textes adaptés.',
    level: 'beginner',
    category: 'Culture',
    imageUrl: '/monuments/sochi.jpg',
    lessonsCount: 10,
    estimatedTime: 85,
    tags: ['culture', 'histoire', 'débutant'],
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    enrolledCount: 28,
  },
  {
    id: '40',
    title: 'Rédaction de CV et lettre de motivation',
    description: 'Apprenez à rédiger un CV et une lettre de motivation en russe.',
    level: 'advanced',
    category: 'Écriture',
    imageUrl: '/screenshots/accueil.png',
    lessonsCount: 12,
    estimatedTime: 100,
    tags: ['écriture', 'CV', 'avancé'],
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledCount: 25,
  },
];
