
export const BASE_URL = 'https://holabus-fpt-default-rtdb.asia-southeast1.firebasedatabase.app'

export async function getTripsByProvince(provinceId: string) {
    const res = await fetch(`${BASE_URL}/trips/${provinceId.toUpperCase()}.json`)
    if (!res.ok) {
        return []
    }
    const data = await res.json()
    return Object.entries(data || {}).map(([id, item]) => ({
        id,
        ...item
    }))
}