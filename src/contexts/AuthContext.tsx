import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// ...
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

import { User } from '../types';
import toast from 'react-hot-toast';
import { trackEvent } from '../components/analytics';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  incognitoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  toggleIncognitoMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      // Redirection forcée après connexion Google
      if (!result.user.displayName) {
        toast('Merci de compléter votre profil.');
        window.location.href = '/completer-profil';
      } else {
        toast.success('Connexion avec Google réussie !');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast('Connexion Google annulée.');
      } else if (error.code === 'auth/account-exists-with-different-credential' || error.code === 'auth/email-already-in-use') {
        toast.error("Un compte existe déjà avec cette adresse Google. Veuillez utiliser 'Se connecter' pour accéder à votre compte.");
      } else {
        toast.error(`Erreur Google: [${error.code}] ${error.message}`);
      }
      // Redirection vers login en cas d'échec (sauf popup fermé)
      if (error.code !== 'auth/popup-closed-by-user') {
        window.location.href = '/login';
        throw error;
      }
    }
  };
  // const [currentUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);


  const createUserProfile = async (user: FirebaseUser, additionalData?: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      const userData: User = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Utilisateur',
        photoURL: user.photoURL || undefined,
        level: 1,
        xp: 0,
        streak: 0,
        joinedAt: new Date(),
        lastActiveAt: new Date(),
        incognitoMode: false,
        preferences: {
          language: 'fr',
          theme: 'auto',
          notifications: {
            email: true,
            push: true,
            dailyReminder: true,
            weeklyProgress: true,
            socialActivity: true
          },
          privacy: {
            showProgress: true,
            showActivity: true,
            allowFriendRequests: true
          }
        },
        stats: {
          totalLessonsCompleted: 0,
          totalExercisesCompleted: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          currentStreak: 0,
          longestStreak: 0,
          wordsLearned: 0,
          coursesCompleted: 0
        },
        badges: [],
        ...(additionalData as Record<string, unknown>)
      };

      // Supprimer photoURL si undefined (Firestore n'accepte pas undefined)
      if (userData.photoURL === undefined) {
        delete userData.photoURL;
      }

      await setDoc(userRef, userData);
      setUserProfile(userData);
    } else {
      const userData = userDoc.data() as User;
      setUserProfile(userData);
      setIncognitoMode(userData.incognitoMode || false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user);
      toast.success('Connexion réussie !');
    } catch (error: any) {
      toast.error('Erreur de connexion: ' + error.message);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      await createUserProfile(result.user, { displayName });
      toast.success('Inscription réussie !');
      window.location.href = '/';
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser 'Mot de passe oublié' si besoin.");
      } else {
        toast.error('Erreur d\'inscription: ' + error.message);
      }
      throw error;
    }
  };



  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setIncognitoMode(false);
      toast.success('Déconnexion réussie');
      trackEvent('logout_success', {});
    } catch (error: any) {
      toast.error('Erreur de déconnexion: ' + error.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser || !userProfile) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);
      setUserProfile({ ...userProfile, ...data });
      toast.success('Profil mis à jour !');
    } catch (error: any) {
      toast.error('Erreur de mise à jour: ' + error.message);
      throw error;
    }
  };

  const toggleIncognitoMode = async () => {
    if (!currentUser || !userProfile) return;

    try {
      const newIncognitoMode = !incognitoMode;
      await updateUserProfile({ incognitoMode: newIncognitoMode });
      setIncognitoMode(newIncognitoMode);
      toast.success(newIncognitoMode ? 'Mode incognito activé' : 'Mode incognito désactivé');
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await createUserProfile(user);
      } else {
        setUserProfile(null);
        setIncognitoMode(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    incognitoMode,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    toggleIncognitoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};