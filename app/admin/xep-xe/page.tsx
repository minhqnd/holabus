'use client'
import { BusesList } from '@/components/buslist'
import { withAuth } from '@/components/auth-guard'

function TripsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Chuyến xe</h1>
      <BusesList />
    </div>
  )
}

export default withAuth(TripsPage)

