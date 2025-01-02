'use client'

import { BookingsList } from '@/components/bookings-list'
import { withAuth } from '@/components/auth-guard'

function BookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đặt vé</h1>
      <BookingsList />
    </div>
  )
}

export default withAuth(BookingsPage)

