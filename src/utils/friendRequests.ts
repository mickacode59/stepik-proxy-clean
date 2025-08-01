// Utilitaires pour la gestion des demandes d'amis
import { getFirestore, collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export async function sendFriendRequest(targetUserId: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Utilisateur non connecté');
  // Vérifier si une demande existe déjà
  const q = query(collection(db, 'friendRequests'), where('from', '==', currentUser.uid), where('to', '==', targetUserId));
  const existing = await getDocs(q);
  if (!existing.empty) throw new Error('Demande déjà envoyée');
  await addDoc(collection(db, 'friendRequests'), {
    from: currentUser.uid,
    to: targetUserId,
    status: 'pending',
    createdAt: new Date()
  });
}

export async function acceptFriendRequest(requestId: string) {
  await updateDoc(doc(db, 'friendRequests', requestId), { status: 'accepted' });
}

export async function refuseFriendRequest(requestId: string) {
  await updateDoc(doc(db, 'friendRequests', requestId), { status: 'refused' });
}

export async function getFriendRequestStatus(targetUserId: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  const q = query(collection(db, 'friendRequests'), where('from', '==', currentUser.uid), where('to', '==', targetUserId));
  const sent = await getDocs(q);
  if (!sent.empty) return sent.docs[0].data().status;
  // Vérifier si on a reçu une demande
  const q2 = query(collection(db, 'friendRequests'), where('from', '==', targetUserId), where('to', '==', currentUser.uid));
  const received = await getDocs(q2);
  if (!received.empty) return received.docs[0].data().status;
  return null;
}

export async function getPendingFriendRequests() {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];
  const q = query(collection(db, 'friendRequests'), where('to', '==', currentUser.uid), where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
