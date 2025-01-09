export const BASE_URL = 'https://holabus-fpt-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Lấy danh sách chuyến xe theo tỉnh.
 * @param {string} provinceId 
 * @returns {Promise<Array>} Danh sách chuyến xe.
 */
export async function getTripsByProvince(provinceId: string) {
    const res = await fetch(`${BASE_URL}/trips.json?orderBy=%22routeId%22&equalTo=%22${provinceId.toUpperCase()}%22`);
    if (!res.ok) {
        return [];
    }
    const data = await res.json();
    return Object.entries(data || {}).map(([id, item]) => ({
        id,
        ...(typeof item === 'object' && item !== null ? item : {})
    }));
}

/**
 * Lấy thông tin chi tiết của một chuyến xe theo tripId.
 * @param {string} tripId 
 * @returns {Promise<Object>} Thông tin chuyến xe.
 */
export async function getTripsById(tripId: string) {
    const res = await fetch(`${BASE_URL}/trips/${tripId}.json`);
    if (!res.ok) {
        throw new Error('Failed to fetch trip data');
    }
    return await res.json();
}

export async function getMapById(tripId: string) {
    const res = await fetch(`${BASE_URL}/routeMaps/${tripId}.json`);
    if (!res.ok) {
        throw new Error('Failed to fetch trip data');
    }
    // return await res.json().iframeMap;
    const data = await res.json();
    return data.iframeMap;
}
