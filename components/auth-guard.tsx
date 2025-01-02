'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
    return function AuthenticatedComponent(props: T) {
        const { user, loading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login')
            }
        }, [user, loading, router])

        if (loading) {
            return (
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            )
        }

        if (!user) {
            return null
        }

        return <Component {...props} />
    }
} 