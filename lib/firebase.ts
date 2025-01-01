import { ref, onValue, set, update, remove } from 'firebase/database';
import { database } from '@/firebase';

export const subscribeToCollection = <T>(path: string, callback: (data: T | null) => void) => {
    const dbRef = ref(database, path);
    return onValue(dbRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const updateDocument = async <T>(path: string, data: Partial<T>) => {
    const dbRef = ref(database, path);
    return update(dbRef, data);
};

export const setDocument = async <T>(path: string, data: T) => {
    const dbRef = ref(database, path);
    return set(dbRef, data);
};

export const deleteDocument = async (path: string) => {
    const dbRef = ref(database, path);
    return remove(dbRef);
}; 