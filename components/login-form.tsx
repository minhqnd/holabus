'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

export function LoginForm() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-red-800">Đăng nhập Admin</h1>
        <p className="mt-2 text-gray-600">Vui lòng đăng nhập bằng email đã được whitelist</p>
      </div>
      <Button 
        onClick={signInWithGoogle}
        className="w-full rounded-full flex items-center justify-center gap-2"
        variant="outline"
      >
        <Image
          src="/img/gmail.png"
          alt="Google"
          width={20}
          height={20}
        />
        Đăng nhập với Google
      </Button>
    </div>
  )
}

