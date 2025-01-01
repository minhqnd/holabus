'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditModal } from '@/components/edit-modal'
import { Pencil, Mail, Filter, Search, Plus, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { subscribeToCollection, updateDocument } from '@/lib/firebase'

interface Booking {
  userId: string;
  tripId: string;
  paid: boolean;
  createdAt: string;
}

const bookings = {
"4K6K4": {
  "createdAt": "2025-01-01T17:01:05.794Z",
  "paid": false,
  "tripId": "HNQN01",
  "userId": "USERDTACO"
},
"7M6EG": {
  "createdAt": "2025-01-01T18:15:22.803Z",
  "paid": false,
  "tripId": "HNQN01",
  "userId": "USERDVXIE"
},
"EPFMI": {
  "createdAt": "2025-01-01T17:22:33.527Z",
  "paid": true,
  "tripId": "HNHD01",
  "userId": "USERTVUOB"
}
}

const users = {
"USERDTACO": {
  "mail": "12341234234@12312312.123123123",
  "name": "moi testst",
  "phone": "1234123412",
  "sex": "1"
},
"USERDVXIE": {
  "mail": "123123123@123123123.123123123",
  "name": "123123123",
  "phone": "1231231231",
  "sex": "1"
},
"USERTVUOB": {
  "mail": "12341234@12341234123.123412341234",
  "name": "1234123412341",
  "phone": "2341234123",
  "sex": "1"
}
}

const trips = {
"HNHD01": {
  "date": "13/01/2025",
  "name": "FPT - Hải Dương",
  "price": "145.000",
  "routeId": "HAIDUONG",
  "slot": 29,
  "time": "8:30"
},
"HNQN01": {
  "date": "13/01/2025",
  "name": "FPT - Quảng Ninh",
  "price": "189.000",
  "routeId": "QUANGNINH",
  "slot": 29,
  "time": "7:35"
}
}

const routes = {
"HAIDUONG": "Hải Dương",
"QUANGNINH": "Quảng Ninh"
}

const routeOptions = Object.entries(routes).map(([value, label]) => ({
  value,
  label
}))

export function BookingsList() {
  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending')
  const [editingBooking, setEditingBooking] = useState<string | null>(null)
  const [editedBooking, setEditedBooking] = useState<typeof bookings[keyof typeof bookings] | null>(null)
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null)
  const [filterRouteId, setFilterRouteId] = useState<string | null>(null)
  const [filterDate, setFilterDate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState<any>({})
  const [users, setUsers] = useState<any>({})
  const [trips, setTrips] = useState<any>({})

  useEffect(() => {
    const unsubscribeBookings = subscribeToCollection('bookings', (data) => {
      setBookings(data || {})
    })
    
    const unsubscribeUsers = subscribeToCollection('users', (data) => {
      setUsers(data || {})
    })
    
    const unsubscribeTrips = subscribeToCollection('trips', (data) => {
      setTrips(data || {})
    })

    return () => {
      unsubscribeBookings()
      unsubscribeUsers()
      unsubscribeTrips()
    }
  }, [])

  const handleRouteChange = (value: string) => {
    setFilterRouteId(value === "all" ? null : value)
  }

  const RouteFilter = () => (
    <Select
      value={filterRouteId || "all"}
      onValueChange={handleRouteChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select route" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All routes</SelectItem>
          {routeOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )

  const filteredBookings = Object.entries(bookings as Record<string, Booking>).filter(([id, booking]) => {
    const user = users[booking.userId]
    const trip = trips[booking.tripId]
    
    return (
      (activeTab === 'pending' ? !booking.paid : booking.paid) &&
      (!filterRouteId || trip.routeId === filterRouteId) &&
      (!filterDate || booking.createdAt.startsWith(filterDate)) &&
      (!searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        trip.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  })

  const groupedBookings = filteredBookings.reduce((acc, [id, booking]) => {
    const trip = trips[(booking as Booking).tripId]
    if (!trip) return acc
    
    if (!acc[trip.routeId]) {
      acc[trip.routeId] = []
    }
    acc[trip.routeId].push([id, booking])
    return acc
  }, {} as Record<string, typeof filteredBookings>)

  const handleSendEmail = (bookingId: string, type: 'payment' | 'ticket', e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`Sending ${type} email for booking ${bookingId}`)
    // Implement email sending logic here
  }

  const handleEditClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingBooking(id)
    setEditedBooking(bookings[id as keyof typeof bookings])
  }

  const handleSaveEdit = async () => {
    if (editingBooking && editedBooking) {
      try {
        await updateDocument(`bookings/${editingBooking}`, editedBooking)
        setEditingBooking(null)
        setEditedBooking(null)
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error)
      }
    }
  }

  const handleConfirmPayment = async (id: string) => {
    try {
      await updateDocument(`bookings/${id}`, { paid: true })
      setConfirmPaymentId(null)
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            Đang đợi thanh toán
          </Button>
          <Button
            variant={activeTab === 'paid' ? 'default' : 'outline'}
            onClick={() => setActiveTab('paid')}
          >
            Đã thanh toán
          </Button>
        </div>
        <div className="flex space-x-2">
          <RouteFilter />
          <Input
            type="date"
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-[180px]"
          />
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      {Object.entries(groupedBookings).map(([routeId, bookings]) => (
        <div key={routeId} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{routes[routeId as keyof typeof routes]}</h2>
          <div className="space-y-4">
            {bookings.map(([id, booking]) => {
              const user = users[booking.userId as keyof typeof users]
              const trip = trips[booking.tripId as keyof typeof trips]
              return (
                <Card key={id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mã đặt vé: {id}</CardTitle>
                    <Badge variant={booking.paid ? "default" : "destructive"}>
                      {booking.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Khách hàng</p>
                        <p className="text-sm">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Chuyến xe</p>
                        <p className="text-sm">{trip.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ngày tạo</p>
                        <p className="text-sm">{new Date(booking.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Giá</p>
                        <p className="text-sm font-semibold">{trip.price} VND</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleSendEmail(id, booking.paid ? 'ticket' : 'payment', e)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        {booking.paid ? "Gửi lại vé" : "Gửi lại mail thanh toán"}
                      </Button>
                      <div className="space-x-2">
                        {!booking.paid && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setConfirmPaymentId(id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Đã thanh toán
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={(e) => handleEditClick(id, e)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
      {editingBooking && editedBooking && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingBooking(null)}
          title="Chỉnh sửa đặt vé"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            <div>
              <label htmlFor="tripId" className="block text-sm font-medium text-gray-700">Mã chuyến xe</label>
              <Input
                id="tripId"
                value={editedBooking.tripId}
                onChange={(e) => setEditedBooking({ ...editedBooking, tripId: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Mã khách hàng</label>
              <Input
                id="userId"
                value={editedBooking.userId}
                onChange={(e) => setEditedBooking({ ...editedBooking, userId: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="paid" className="block text-sm font-medium text-gray-700">Trạng thái thanh toán</label>
              <select
                id="paid"
                value={editedBooking.paid ? 'true' : 'false'}
                onChange={(e) => setEditedBooking({ ...editedBooking, paid: e.target.value === 'true' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="true">Đã thanh toán</option>
                <option value="false">Chưa thanh toán</option>
              </select>
            </div>
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </EditModal>
      )}
      <Dialog open={!!confirmPaymentId} onOpenChange={() => setConfirmPaymentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thanh toán</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đánh dấu đơn đặt vé này là đã thanh toán?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPaymentId(null)}>Hủy</Button>
            <Button onClick={() => confirmPaymentId && handleConfirmPayment(confirmPaymentId)}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

