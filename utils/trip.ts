import { get, ref } from 'firebase/database';
import { database } from '@/firebase';

export const getTripDetails = async (tripId: string) => {
  try {
    // Get the province code from tripId (first 2 characters are HN, next 2 are province code)
    const provinceCode = tripId.substring(2, 4).toUpperCase();
    console.log('Fetching trip with:', { tripId, provinceCode });
    
    // Map province codes
    const provinceMap: { [key: string]: string } = {
      'QN': 'QUANGNINH',
      'HD': 'HAIDUONG',
      // Add other province mappings as needed
    };
    
    const fullProvinceCode = provinceMap[provinceCode];
    if (!fullProvinceCode) {
      console.error('Unknown province code:', provinceCode);
      return null;
    }

    const tripRef = ref(database, `trips/${fullProvinceCode}/${tripId}`);
    console.log('Trip reference path:', tripRef.toString());
    
    const snapshot = await get(tripRef);
    console.log('Trip snapshot exists:', snapshot.exists(), 'Data:', snapshot.val());
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching trip details:', error);
    return null;
  }
};
