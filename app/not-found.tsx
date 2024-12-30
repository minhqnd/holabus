'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#FFF9F0] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="container max-w-2xl px-4 py-16 text-center">
                    <h1 className="mb-4 text-9xl font-bold text-red-800">404</h1>
                    <h2 className="mb-8 text-2xl font-semibold text-gray-700">
                        Oops! Trang bạn đang tìm kiếm không tồn tại.
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Có vẻ như trang bạn đang cố truy cập đã bị di chuyển hoặc không còn tồn tại.
                    </p>
                    <Link href="/">
                        <Button className="rounded-full bg-red-600 hover:bg-red-700">
                            <Home className="mr-2 h-4 w-4" />
                            Về trang chủ
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    )
} 