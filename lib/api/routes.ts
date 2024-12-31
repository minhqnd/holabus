
export const BASE_URL = 'https://holabus-fpt-default-rtdb.asia-southeast1.firebasedatabase.app'

export async function getRouteByProvince(provinceId: string) {
    const res = await fetch(`${BASE_URL}/routes/${provinceId.toUpperCase()}.json`)
    if (!res.ok) {
        return null
    }
    return await res.json()
}