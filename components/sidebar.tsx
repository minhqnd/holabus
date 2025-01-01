"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Bus, Calendar, FileText, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  { href: '/admin/routes', label: 'Tuyến xe', icon: Bus },
  { href: '/admin/trips', label: 'Chuyến xe', icon: Calendar },
  { href: '/admin/bookings', label: 'Đặt vé', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // This would typically come from your authentication system
  const user = {
    name: 'Admin User',
    email: 'admin@example.com',
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...')
  }

  return (
    <>
      <Button
        variant="outline"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-red-600">HolaBus Admin</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-2 text-sm font-medium",
                pathname.startsWith(item.href)
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </>
  )
}

