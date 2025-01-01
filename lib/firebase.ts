import { ref, onValue, set, update } from 'firebase/database';
import { database } from '@/firebase';

export const subscribeToCollection = (path: string, callback: (data: any) => void) => {
  const dbRef = ref(database, path);
  return onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const updateDocument = async (path: string, data: any) => {
  const dbRef = ref(database, path);
  return update(dbRef, data);
};

export const setDocument = async (path: string, data: any) => {
  const dbRef = ref(database, path);
  return set(dbRef, data);
}; 