
export async function getRouteByProvince(provinceId: string) {
    const res = await fetch(`/api/routes/${provinceId.toUpperCase()}`)
    if (!res.ok) {
        return null
    }
    return await res.json()
}