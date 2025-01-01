'use client'

import { BookingsList } from '@/components/bookings-list'

export default function BookingsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý đặt vé</h1>
      <BookingsList />
    </div>
  )
}

