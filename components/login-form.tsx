'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-red-800">Đăng nhập</h1>
        <p className="mt-2 text-gray-600">Chào mừng bạn trở lại với HolaBus</p>
      </div>
      <form className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>  
          <Input 
            height="3rem"
            width="100%"
            borderRadius="9999px"
            backgroundColor="white"
            borderColor="#e5e7eb"
            fontSize="1rem"
            padding="0.75rem 1rem"
            id="email" 
            type="email" 
            className="mt-2" 
            placeholder="Nhập email của bạn" 
          />
        </div>
        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input 
            height="3rem"

            id="password" 
            type="password" 
            className="mt-2 rounded-full" 
            placeholder="Nhập mật khẩu" 
          />
        </div>
        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-sm text-red-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <Button type="submit" className="w-full rounded-full bg-red-600 hover:bg-red-700">
          Đăng nhập
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="rounded-full">
            <img
              src="/placeholder.svg?height=24&width=24"
              alt="Google"
              className="mr-2 h-6 w-6"
            />
            Google
          </Button>
          <Button variant="outline" className="rounded-full">
            <img
              src="/placeholder.svg?height=24&width=24"
              alt="Facebook"
              className="mr-2 h-6 w-6"
            />
            Facebook
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-medium text-red-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  )
}

