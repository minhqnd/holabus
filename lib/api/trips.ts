
/**
 * Lấy danh sách chuyến xe theo tỉnh.
 * @param {string} provinceId 
 * @returns {Promise<Array>} Danh sách chuyến xe.
 */
export async function getTripsByProvince(provinceId: string) {
    const res = await fetch(`/api/trips?routeId=${provinceId.toUpperCase()}`);
    if (!res.ok) {
        return [];
    }
    return await res.json();
}

/**
 * Lấy thông tin chi tiết của một chuyến xe theo tripId.
 * @param {string} tripId 
 * @returns {Promise<Object>} Thông tin chuyến xe.
 */
export async function getTripsById(tripId: string) {
    const res = await fetch(`/api/trips/${tripId}`);
    if (!res.ok) {
        throw new Error('Failed to fetch trip data');
    }
    return await res.json();
}

export async function getMapById(routeId: string) {
    const res = await fetch(`/api/route-maps/${routeId}`);
    if (!res.ok) {
        return null;
    }
    const data = await res.json();
    return data ? data.iframeMap : null;
}
