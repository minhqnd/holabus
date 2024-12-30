import { PROVINCES } from '@/lib/constants/provinces'

export function getProvinceNameById(id: string): string {
    const province = PROVINCES.find(p => p.id === id.toUpperCase())
    return province?.name || ''
} 