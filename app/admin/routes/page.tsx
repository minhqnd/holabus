'use client'
import { RoutesList } from '@/components/routes-list'
import { withAuth } from '@/components/auth-guard'

function RoutesPage() {
  return (
    <div>
      <RoutesList />
    </div>
  )
}

export default withAuth(RoutesPage)

