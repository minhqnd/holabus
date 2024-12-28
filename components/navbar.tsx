import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
  return (
    <nav className="bg-white w-full sticky top-0 z-50">
      <div className="container flex h-20 md:h-24 items-center justify-between mx-auto px-4 md:px-30 font-medium">
        <div className="flex gap-6">
          <Link href="/" className="">

          <img src="/red-logo.png" className="w-auto h-12" alt="Logo" />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/search" className="text-base hover:text-red-600">
              Tìm xe bus
            </Link>
            <Link href="/tra-cuu" className="text-base hover:text-red-600">
              Tra cứu vé
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="items-center gap-2 text-red-600 hidden md:flex">
            <Phone className="h-4 w-4" />
            <span className="text-base font-medium">Hotline: 0901234567</span>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            Liên hệ HolaBus
          </Button>
        </div>
      </div>
    </nav>
  )
}

