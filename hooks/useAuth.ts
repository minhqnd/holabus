'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check localStorage for login state
        const storedEmail = localStorage.getItem('admin_email')
        if (storedEmail) {
            setIsLoggedIn(true)
            setEmail(storedEmail)
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Login failed')
            }

            const data = await res.json()
            localStorage.setItem('admin_email', data.email)
            setIsLoggedIn(true)
            setEmail(data.email)
            router.push('/admin')
            return true
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('admin_email')
        setIsLoggedIn(false)
        setEmail(null)
        router.push('/login')
    }

    return { isLoggedIn, loading, email, login, logout }
}