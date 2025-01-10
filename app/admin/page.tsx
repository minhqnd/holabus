"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, Calendar, FileText, DollarSign, Clock } from 'lucide-react'
import { subscribeToCollection } from '@/lib/firebase'
import { useEffect, useState } from 'react'
import { withAuth } from '@/components/auth-guard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Trip {
  price?: string;
}

interface Booking {
  paid?: boolean;
  tripId?: string;
  createdAt?: string;
}

interface ChartDataPoint {
  date: string;
  bookings: number;
  revenue: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    todayBookings: 0
  })
  const [tripsData, setTripsData] = useState<Record<string, Trip>>({})
  const [bookingsData, setBookingsData] = useState<Record<string, Booking>>({})
  const [chartData, setChartData] = useState<Array<ChartDataPoint>>([])

  useEffect(() => {
    const unsubscribeRoutes = subscribeToCollection('routes', (data) => {
      setStats(prev => ({ ...prev, totalRoutes: Object.keys(data || {}).length }))
    })

    const unsubscribeTrips = subscribeToCollection('trips', (data) => {
      setTripsData(data as Record<string, Trip>)
      setStats(prev => ({ ...prev, totalTrips: Object.keys(data || {}).length }))
    })

    // const unsubscribeUsers = subscribeToCollection('users', (data) => {
    //   setStats(prev => ({ ...prev, totalUsers: Object.keys(data || {}).length }))
    // })

    const unsubscribeBookings = subscribeToCollection('bookings', (data) => {
      return setBookingsData(data as Record<string, Booking> || {})
    })

    return () => {
      unsubscribeRoutes()
      unsubscribeTrips()
      // unsubscribeUsers()
      unsubscribeBookings()
    }
  }, [])

  useEffect(() => {
    if (!Object.keys(tripsData).length || !Object.keys(bookingsData).length) return
    const today = new Date().toISOString().split('T')[0]
    let totalRevenue = 0
    let pendingCount = 0
    let completedCount = 0
    let todayCount = 0

    Object.values(bookingsData).forEach((booking: Booking) => {
      if (booking.paid) {
        totalRevenue += parseInt(
          tripsData[booking.tripId || '']?.price?.replace(/\./g, '') || '0'
        )
        completedCount++
      } else {
        pendingCount++
      }
      if (booking.createdAt?.startsWith(today)) {
        todayCount++
      }
    })

    setStats(prev => ({
      ...prev,
      totalBookings: Object.keys(bookingsData).length,
      totalRevenue,
      pendingBookings: pendingCount,
      completedBookings: completedCount,
      todayBookings: todayCount
    }))
  }, [tripsData, bookingsData])

  useEffect(() => {
    if (!Object.keys(bookingsData).length || !Object.keys(tripsData).length) return
    
    // Process data for chart
    const dailyStats = Object.values(bookingsData).reduce((acc: Record<string, ChartDataPoint>, booking) => {
      const date = booking.createdAt?.split('T')[0] || 'unknown'
      
      if (!acc[date]) {
        acc[date] = { date, bookings: 0, revenue: 0 }
      }
      
      acc[date].bookings += 1
      
      if (booking.paid) {
        acc[date].revenue += parseInt(
          tripsData[booking.tripId || '']?.price?.replace(/\./g, '') || '0'
        )
      }
      
      return acc
    }, {})

    // Convert to array and sort by date
    const sortedData = Object.values(dailyStats)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7) // Last 7 days

    setChartData(sortedData)
  }, [tripsData, bookingsData])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tổng quan</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số tuyến xe</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số chuyến xe</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số đặt vé</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Đã thanh toán: {stats.completedBookings} | Chưa thanh toán: {stats.pendingBookings}
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                .format(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đặt vé hôm nay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayBookings}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Thống kê theo ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                  stroke="#64748b"
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#6366f1"
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  labelFormatter={(value) => `Ngày ${new Date(value).toLocaleDateString('vi-VN')}`}
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                      }).format(value as number), 'Doanh thu']
                    }
                    return [`${value} vé`, 'Số vé']
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#6366f1', strokeWidth: 2, r: 6, fill: 'white' }}
                  name="bookings"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6, fill: 'white' }}
                  name="revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(AdminDashboard)

