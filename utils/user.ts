import { ref, set } from 'firebase/database';
import { database } from '@/firebase';

const generateUserId = (): string => {
    return 'USER' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const saveUserData = async (userData: {
    sex: string;
    name: string;
    mail: string;
    phone: string;
}): Promise<string> => {
    try {
        const userId = generateUserId();
        const userRef = ref(database, `users/${userId}`);
        
        console.log('Saving user data:', userId, userData);
        await set(userRef, userData);
        console.log('User data saved successfully');
        
        return userId;
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
};
