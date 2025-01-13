import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, signInWithPopup, googleProvider, signOut, database, ref, get } from '@/firebase'
import { User } from 'firebase/auth'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const email = result.user.email?.replace(/\./g, '_')

            // Kiểm tra trong database
            const adminRef = ref(database, `admin/${email}`)
            const snapshot = await get(adminRef)

            if (snapshot.exists()) {
                router.push('/admin')
            } else {
                await signOut(auth)
                alert('Bạn không có quyền truy cập!, vui lòng liên hệ admin để được cấp quyền!')
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error)
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            router.push('/login')
        } catch (error) {
            console.error('Lỗi đăng xuất:', error)
        }
    }

    return { user, loading, signInWithGoogle, logout }
}