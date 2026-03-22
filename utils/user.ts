export const saveUserData = async (userData: {
    sex: string;
    name: string;
    mail: string;
    phone: string;
    destination?: string;
    transferPoint?: string;
}): Promise<string> => {
    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            throw new Error('Failed to save user data');
        }

        const data = await res.json();
        console.log('User data saved successfully:', data.userId);
        return data.userId;
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
};
