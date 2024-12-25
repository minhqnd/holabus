import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6">
          <Link href="/" className="text-xl font-bold text-red-600">
            HolaBus
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/tim-du-thuyen" className="text-sm hover:text-red-600">
              Tìm du thuyền
            </Link>
            <Link href="/tim-ve-may-bay" className="text-sm hover:text-red-600">
              Tìm vé máy bay
            </Link>
            <Link href="/tim-khach-san" className="text-sm hover:text-red-600">
              Tìm khách sạn
            </Link>
            <Link href="/doanh-nghiep" className="text-sm hover:text-red-600">
              Doanh nghiệp
            </Link>
            <Link href="/blog" className="text-sm hover:text-red-600">
              Blog
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">Hotline: 0901234567</span>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            Liên hệ HolaBus
          </Button>
        </div>
      </div>
    </nav>
  )
}

