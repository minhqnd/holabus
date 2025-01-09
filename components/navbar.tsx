'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Menu } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white w-full sticky top-0 z-50">
      <div className="container flex h-20 md:h-24 items-center justify-between mx-auto px-4 md:px-30 font-medium">
        <div className="flex gap-6">
          <Link href="/" className="">
            <Image src="/red-logo.png" width={0} height={0} sizes="50vw" className="w-auto md:w-auto h-12 md:h-14" alt="Logo" />
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
        <div className="flex items-center gap-1 md:gap-4">
          <div className="items-center gap-2 text-red-600 hidden md:flex">
            <Phone className="h-4 w-4" />
            <span className="text-base font-medium">Hotline: 0944355789</span>
          </div>
            <Link href="https://www.facebook.com/HolaBusFPTU.CSKH/" target="_blank" rel="noopener noreferrer">
              <Button 
                className="bg-red-600 hover:bg-red-700"
              >
                Liên hệ HolaBus
              </Button>
            </Link>
          <Button 
            variant="ghost" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/search" 
              className="text-base hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Tìm xe bus
            </Link>
            <Link 
              href="/tra-cuu" 
              className="text-base hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Tra cứu vé
            </Link>
            <div className="flex items-center gap-2 text-red-600">
              <Phone className="h-4 w-4" />
              <span className="text-base font-medium">Hotline: 0944355789</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

