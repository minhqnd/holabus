'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditModal } from '@/components/edit-modal'
import { Pencil, Mail, Check, Trash2, ChevronDown, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { subscribeToCollection, updateDocument, deleteDocument } from '@/lib/firebase'
import { getProvinceNameById } from '@/lib/utils/province'
import { Spinner } from '@/components/ui/spinner'
import { toast, ToastContainer } from 'react-toastify';

interface Booking {
  userId: string;
  tripId: string;
  paid: boolean;
  createdAt: string;
  note?: string;
  destination: string;
}

interface Route {
  name: string;
  price: string;
  available: boolean;
  locations: string[];
}

interface User {
  transferPoint: string
  destination: string
  name: string;
  mail: string;
  phone: string;
  sex: string;
}

interface Trip {
  name: string
  routeId: string
  slot: number
  date: string
  time: string
  price: string
  locations: string[]
}

// interface EditableBooking {
//     tripId: string;
//     userId: string;
//     paid: boolean;
//     note: string;
// }

export function BookingsList() {
  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending')
  const [editingBooking, setEditingBooking] = useState<string | null>(null)
  const [editedBooking, setEditedBooking] = useState<typeof bookings[keyof typeof bookings] | null>(null)
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null)
  const [filterRouteId, setFilterRouteId] = useState<string | null>(null)
  const [filterDate, setFilterDate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState<Record<string, Booking>>({})
  const [users, setUsers] = useState<Record<string, User>>({})
  const [trips, setTrips] = useState<Record<string, Trip>>({})
  const [routes, setRoutes] = useState<Record<string, Route>>({})
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [flashingBookings] = useState<Record<string, boolean>>({});
  const [sendingEmails, setSendingEmails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribeBookings = subscribeToCollection<Record<string, Booking>>('bookings', (data) => {
      setBookings(data || {} as Record<string, Booking>)
    })

    const unsubscribeUsers = subscribeToCollection<Record<string, User>>('users', (data) => {
      setUsers(data || {} as Record<string, User>)
    })

    const unsubscribeTrips = subscribeToCollection<Record<string, Trip>>('trips', (data) => {
      setTrips(data || {} as Record<string, Trip>)
    })

    const unsubscribeRoutes = subscribeToCollection<Record<string, Route>>('routes', (data) => {
      setRoutes(data || {} as Record<string, Route>)
    })

    return () => {
      unsubscribeBookings()
      unsubscribeUsers()
      unsubscribeTrips()
      unsubscribeRoutes()
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
          {Object.entries(routes).map(([value, route]) => (
            <SelectItem key={value} value={value}>
              {route.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )

  const filteredBookings = Object.entries(bookings as Record<string, Booking>)
    .filter(([key, booking]) => {
      const user = users[booking.userId]
      const trip = trips[booking.tripId]
      const matchesSearch =
        searchTerm === '' ||
        key.includes(searchTerm) ||
        (user?.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return (
        (activeTab === 'pending' ? !booking.paid : booking.paid) &&
        (!filterRouteId || trip?.routeId === filterRouteId) &&
        (!filterDate || booking.createdAt.startsWith(filterDate)) &&
        matchesSearch
      )
    })
    .sort(([, a], [, b]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const groupedBookings = filteredBookings.reduce((acc, [id, booking]) => {
    const trip = trips[booking.tripId]
    if (!trip) return acc

    if (!acc[trip.routeId]) {
      acc[trip.routeId] = {}
    }
    if (!acc[trip.routeId][booking.tripId]) {
      acc[trip.routeId][booking.tripId] = []
    }
    acc[trip.routeId][booking.tripId].push([id, booking])
    return acc
  }, {} as Record<string, Record<string, typeof filteredBookings>>)

  const handleSendEmail = async (bookingId: string, type: 'payment' | 'ticket', e: React.MouseEvent) => {
    e.stopPropagation()
    setSendingEmails(prev => ({ ...prev, [bookingId]: true }))
    try {
      console.log(`Sending ${type} email for booking ${bookingId}`)
      const booking = bookings[bookingId]
      const user = users[booking.userId]
      const trip = trips[booking.tripId]
      const route = routes[trip.routeId]

      if (!route) {
        throw new Error('Không tìm thấy route cho chuyến xe này.')
      }

      const userData = {
        bookingId: bookingId,
        tripId: booking.tripId,
        price: trip.price,
        createdAt: booking.createdAt,
        locations: trip?.locations || [],
        tripInfo: {
          name: trip.name,
          time: trip.time,
          date: trip.date,
          price: trip.price,
          location: route.locations,
        },
        userInfo: {
          sex: user.sex,
          name: user.name,
          mail: user.mail,
          phone: user.phone,
          destination: user.destination,
        },
      }
      console.log(userData)
      const response = await fetch('https://api.holabus.com.vn/api/send-payment-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`Không thể gửi vé: ${response.status} ${response.statusText}`)
      }

      console.log('Ticket sent successfully')
      toast.success('Gửi hóa đơn thành công');
    } catch (error) {
      console.error('Error sending ticket:', error)
      toast.error('Error sending ticket, retry');
    } finally {
      setSendingEmails(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  const handleEditClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const booking = bookings[id]
    const user = users[booking.userId]
    setEditingBooking(id)
    setEditedBooking(booking)
    setEditedUser({ ...user })
  }

  const handleSaveEdit = async () => {
    if (editingBooking && editedBooking && editedUser) {
      try {
        // Cập nhật thông tin booking
        await updateDocument(`bookings/${editingBooking}`, editedBooking)
        // Cập nhật thông tin user
        await updateDocument(`users/${editedBooking.userId}`, editedUser)
        setEditingBooking(null)
        setEditedBooking(null)
        setEditedUser(null)
        toast.success('Sửa đơn thành công');
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error)
        toast.error('Error updating booking');
      }
    }
  }

  const handleSendTicket = async (id: string) => {
    try {
      const booking = bookings[id];
      const user = users[booking.userId];
      const trip = trips[booking.tripId];
      const route = routes[trip.routeId];

      if (!route) {
        throw new Error('Không tìm thấy route cho chuyến xe này.');
      }

      const ticketData = {
        bookingId: id,
        tripId: booking.tripId,
        price: trip.price,
        createdAt: booking.createdAt,
        locations: route.locations,
        tripInfo: {
          name: trip.name,
          time: trip.time,
          date: trip.date,
          price: trip.price,
          location: route.locations,
        },
        userInfo: {
          sex: user.sex,
          name: user.name,
          mail: user.mail,
          phone: user.phone,
          destination: user.destination,
        },
      };

      console.log(JSON.stringify(ticketData));
      const response = await fetch('https://api.holabus.com.vn/api/send-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to send ticket');
      }

      console.log('Ticket sent successfully');
      // toast.success('Gửi vé thành công');
    } catch (error) {
      console.error('Error sending ticket:', error);
      toast.error('Lỗi khi gửi vé');

    }
  }

  const handleResendEmail = async (id: string) => {
    setSendingEmails(prev => ({ ...prev, [id]: true }));
    try {
      await handleSendTicket(id);
      toast.success('Gửi lại vé thành công');
    } catch (error) {
      console.error('Lỗi khi gửi lại vé:', error);
      toast.error('Lỗi khi gửi lại vé');
    } finally {
      setSendingEmails(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleConfirmPayment = async (id: string) => {
    setConfirmPaymentId(null);
    setSendingEmails(prev => ({ ...prev, [id]: true }));
    try {
      const booking = bookings[id];
      const trip = trips[booking.tripId];

      if (!trip) {
        throw new Error('Không tìm thấy chuyến xe này.');
      }
      await handleSendTicket(id);
      await updateDocument(`bookings/${id}`, { paid: true });

      const newSlot = trip.slot - 1;
      await updateDocument(`trips/${booking.tripId}`, { slot: newSlot });

      toast.success('Xác nhận thành công');
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
      toast.error('Lỗi khi xác nhận thanh toán');
    } finally {
      setSendingEmails(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCancelPayment = async (id: string) => {
    try {
      const booking = bookings[id]
      const trip = trips[booking.tripId]

      // Cập nhật trạng thái thanh toán của booking
      await updateDocument(`bookings/${id}`, { paid: false })

      // Cập nhật số slot của trip
      if (trip) {
        const newSlot = trip.slot + 1
        await updateDocument(`trips/${booking.tripId}`, { slot: newSlot })
      }
      toast.success('Hủy trạng thái thanh toán thành công');

    } catch (error) {
      console.error('Lỗi khi hủy thanh toán:', error)
    }
  }

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteDocument(`bookings/${id}`)
      setDeletingBookingId(null)
      toast.success('Xóa vé thành công');
    } catch (error) {
      console.error('Lỗi khi xóa vé:', error)
      toast.error(`Lỗi khi xóa vé`);
    }
  }

  const toggleGroup = (routeId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }))
  }

  const handleEditNote = (id: string, currentNote: string) => {
    setEditingNote(id);
    setNoteText(currentNote || '');
  };

  const handleSaveNote = async (id: string) => {
    try {
      await updateDocument(`bookings/${id}`, { note: noteText });
      setEditingNote(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật ghi chú:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
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
            {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
          </div>
        </div>
      </div>
      {Object.entries(groupedBookings).map(([routeId, tripGroups]) => (
        <div key={routeId}>
          <div
            className="flex my-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => toggleGroup(routeId)}
          >
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold break-words">
              {getProvinceNameById(routeId)}
            </h2>
          </div>

          {!collapsedGroups[routeId] && (
            <div className="space-y-8 ml-4 p-4 rounded-xl border bg-card text-card-foreground shadow cursor-pointer hover:shadow-md transition-shadow duration-200">
              {Object.entries(tripGroups).map(([tripId, bookings]) => {
                const trip = trips[tripId]
                return (
                  <div key={tripId} className="mb-6">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-medium break-words mr-2">
                        ({trip?.name || `Trip ${tripId}`})
                      </h3>
                      <Badge variant={trip?.slot > 0 ? "default" : "destructive"} className="text-base">
                        {trip?.slot > 0 ? `Còn ${trip?.slot} vé` : "Hết vé"}
                      </Badge>
                    </div>
                    <div className="overflow-x-auto rounded-xl border bg-card text-card-foreground shadow cursor-pointer hover:shadow-md transition-shadow duration-200">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-100">
                          <tr className="text-gray-700">
                            <th className="p-2">#</th>
                            <th className="p-2">Booking ID</th>
                            <th className="p-2">Khách hàng</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">SĐT</th>
                            <th className="p-2">Giới tính</th>
                            <th className="p-2">Ngày tạo</th>
                            <th className="p-2">Giá</th>
                            <th className="p-2">Điểm đến</th>
                            <th className="p-2">Điểm trung chuyển</th>
                            <th className="p-2">Trạng thái</th>
                            <th className="p-2">Ghi chú</th>
                            <th className="p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map(([id, booking]: [string, Booking], index: number) => {
                            const isSending = sendingEmails[id]
                            const transferPoints: Record<string, string> = {
                              "Tu_di_den_truong": "Tự đi đến trường",
                              "Den_do_tan_xa": "Đèn đỏ Tân Xã",
                              "Cay_xang_39": "Cây xăng 39",
                              "Cay_xa_cu_phenikaa": "Cây xăng xà cừ",
                              "Cho_hoa_lac": "Chợ Hoà Lạc",
                            };
                            return (
                              <tr key={id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-2 whitespace-nowrap">{index + 1}</td>
                                <td className="p-2 text-ellipsis overflow-hidden max-w-[100px] whitespace-nowrap" title={id}>
                                  {id}
                                </td>
                                <td className="p-2">{users[booking.userId].name}</td>
                                <td
                                  className="p-2 text-ellipsis overflow-hidden max-w-40 whitespace-nowrap"
                                  title={users[booking.userId].mail}
                                >
                                  {users[booking.userId].mail}
                                </td>
                                <td className="p-2">{users[booking.userId].phone}</td>
                                <td className="p-2">
                                  {users[booking.userId].sex === "1" ? "Nam" : "Nữ"}
                                </td>
                                <td className="p-2">
                                  {new Date(booking.createdAt).toLocaleString('vi-VN')}
                                </td>
                                <td className="p-2">{trip?.price} VND</td>
                                <td className="p-2">
                                  {users[booking.userId].destination || 'N/A'}
                                </td>
                                <td className="p-2">
                                  {transferPoints[users[booking.userId].transferPoint as keyof typeof transferPoints] || 'N/A'}
                                </td>
                                <td className="p-2">
                                  {booking.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                                </td>
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    {/* <span className="text-sm text-gray-600">Ghi chú:</span> */}
                                    {editingNote === id ? (
                                      <div className="flex gap-2">
                                        <Input
                                          value={noteText}
                                          onChange={(e) => setNoteText(e.target.value)}
                                          className="text-sm"
                                        />
                                        <Button
                                          size="sm"
                                          onClick={() => handleSaveNote(id)}
                                        >
                                          Lưu
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                          {booking.note || ''}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEditNote(id, booking.note ?? '')}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          return booking.paid ? handleResendEmail(id) : handleSendEmail(id, 'payment', e);
                                        }}
                                        disabled={isSending}
                                      >
                                        <Mail className="mr-2 h-4 w-4" />
                                        {isSending ? <Spinner className="mr-2 h-4 w-4" /> : booking.paid ? "Gửi lại vé" : "Gửi lại hóa đơn"}
                                      </Button>
                                    </div>
                                    <div className="flex space-x-2">
                                      {booking.paid ? (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleCancelPayment(id)}
                                        >
                                          <X className="mr-2 h-4 w-4" />
                                          Hủy thanh toán
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => setConfirmPaymentId(id)}
                                        >
                                          <Check className="mr-2 h-4 w-4" />
                                          {isSending ? <Spinner className="mr-2 h-4 w-4" /> : "Thanh toán"}
                                        </Button>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" onClick={(e) => handleEditClick(id, e)}>
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeletingBookingId(id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      {editingBooking && editedBooking && editedUser && (
        <EditModal
          isOpen={true}
          onClose={() => {
            setEditingBooking(null)
            setEditedBooking(null)
            setEditedUser(null)
          }}
          title="Chỉnh sửa đặt vé"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thông tin khách hàng</label>
              <Input
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                placeholder="Tên khách hàng"
                className="mt-1"
              />
              <Input
                value={editedUser.mail}
                onChange={(e) => setEditedUser({ ...editedUser, mail: e.target.value })}
                placeholder="Email"
                className="mt-1"
              />
              <Input
                value={editedUser.phone}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                placeholder="Số điện thoại"
                className="mt-1"
              />
              <select
                value={editedUser.sex}
                onChange={(e) => setEditedUser({ ...editedUser, sex: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="1">Nam</option>
                <option value="2">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thông tin chuyến xe</label>
              <Input
                value={editedBooking.tripId}
                onChange={(e) => setEditedBooking({ ...editedBooking, tripId: e.target.value })}
                placeholder="Mã chuyến xe"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái thanh toán</label>
              <select
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
            <DialogTitle>Xác nhận gửi vé</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn gửi vé cho khách hàng?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <>
              <Button variant="outline" onClick={() => setConfirmPaymentId(null)}>Hủy</Button>
              <Button onClick={() => confirmPaymentId && handleConfirmPayment(confirmPaymentId)}>Xác nhận</Button>
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingBookingId} onOpenChange={() => setDeletingBookingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa vé</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vé này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingBookingId(null)}>Hủy</Button>
            <Button
              variant="destructive"
              onClick={() => deletingBookingId && handleDeleteBooking(deletingBookingId)}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

