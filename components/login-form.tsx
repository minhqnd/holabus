'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-red-800">Đăng nhập Admin</h1>
        <p className="mt-2 text-gray-600">Nhập email và mật khẩu để đăng nhập</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none"
            placeholder="admin@holabus.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </div>
  )
}
