import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCvuLYZSmf7-yemdSEltD2daj4cNxCLTVY",
  authDomain: "myrusse-2826d.firebaseapp.com",
  projectId: "myrusse-2826d",
  storageBucket: "myrusse-2826d.appspot.com",
  messagingSenderId: "208172249628",
  appId: "1:208172249628:web:8aabac96e47c76c807a5d9",
  measurementId: "G-LQ51YSDK4Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// En mode développement, utiliser les émulateurs
if (import.meta.env.DEV) {
  // Connecter aux émulateurs Firestore, Storage, Functions uniquement
  try {
    // connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    // Émulateurs déjà connectés
  }
}

export default app;