import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9F0]">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-red-600">404</h1>
        <h2 className="mb-6 text-2xl font-semibold">Không tìm thấy trang</h2>
        <p className="mb-8 text-gray-600">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button asChild className="rounded-full bg-red-600 hover:bg-red-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}

