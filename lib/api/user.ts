
export async function getUserById(userID: string) {
    const res = await fetch(`/api/users/${userID}`)
    if (!res.ok) {
        return null
    }
    return await res.json()
}