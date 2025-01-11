export const BASE_URL = 'https://holabus-fpt-default-rtdb.asia-southeast1.firebasedatabase.app'

export async function getUserById(userID: string) {
    const res = await fetch(`${BASE_URL}/users/${userID}.json`)
    if (!res.ok) {
        return null
    }
    return await res.json()
}