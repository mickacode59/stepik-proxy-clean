export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  joinedAt: Date;
  lastActiveAt: Date | string | null;
  incognitoMode: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  badges: Badge[];
  bio?: string;
  friends?: string[];
  status?: 'online' | 'away' | 'offline';
  hideLastActive?: boolean;
  posts?: Post[];
  stories?: Story[];
  isPrivate?: boolean;
}

export interface Story {
  id: string;
  image: string;
  title?: string;
}

export interface Story {
  id: string;
  image: string;
  title?: string;
}
export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  imageUrl: string;
  lessonsCount: number;
  estimatedTime: number;
  tags: string[];
  isCompleted: boolean;
  progress: number;
  rating: number;
  enrolledCount: number;
  badges?: string[];
  quiz?: Array<{ question: string; options: string[]; answer: string }>;
  videoUrl?: string;
  podcastUrl?: string;
  resources?: string[];
  pathId?: string;
  certificateAvailable?: boolean;
  translation?: { [lang: string]: string };
  tdahExplanation?: string;
}


export interface UserPreferences {
  language: 'fr' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
    weeklyProgress: boolean;
    socialActivity: boolean;
  };
  privacy: {
    showProgress: boolean;
    showActivity: boolean;
    allowFriendRequests: boolean;
  };
}

export interface UserStats {
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  totalTimeSpent: number; // en minutes
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  coursesCompleted: number;
  posts?: number;
  followers?: number;
  following?: number;

// ...existing code...
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  imageUrl: string;
  lessonsCount: number;
  estimatedTime: number; // en minutes
  prerequisites?: string[];
  tags: string[];
  isCompleted: boolean;
  progress: number; // 0-100
  rating: number;
  enrolledCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: LessonContent;
  exercises: Exercise[];
  order: number;
  estimatedTime: number;
  isCompleted: boolean;
  score?: number;
  completedAt?: Date;
}

export interface LessonContent {
  type: 'text' | 'video' | 'audio' | 'interactive';
  data: string | object;
  vocabulary?: VocabularyItem[];
  grammar?: GrammarRule[];
}

export interface VocabularyItem {
  russian: string;
  french: string;
  phonetic: string;
  audioUrl?: string;
  examples: Example[];
}

export interface Example {
  russian: string;
  french: string;
  audioUrl?: string;
}

export interface GrammarRule {
  title: string;
  explanation: string;
  examples: Example[];
}

export interface Exercise {
  id: string;
  type: 'mcq' | 'fill-blank' | 'drag-drop' | 'audio' | 'pronunciation' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Post {
  id: string;
  authorId: string;
  author: {
    displayName: string;
    photoURL?: string;
    level: number;
  };
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: string[];
  comments: Comment[];
  tags: string[];
  isVisible: boolean; // Pour le mode incognito
}

export interface Comment {
  id: string;
  authorId: string;
  author: {
    displayName: string;
    photoURL?: string;
  };
  content: string;
  createdAt: Date;
  likes: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  chatId: string;
  readBy: string[];
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  participants: string[];
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  acceptedAt?: Date;
}

export interface CulturalResource {
  id: string;
  title: string;
  description: string;
  type: 'monument' | 'media' | 'article' | 'video' | 'podcast';
  url?: string;
  imageUrl: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number;
}