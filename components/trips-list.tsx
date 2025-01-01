'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditModal } from '@/components/edit-modal'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { subscribeToCollection, updateDocument, setDocument, deleteDocument } from '@/lib/firebase'

interface Route {
  name: string;
  price: string;
  available: boolean;
  locations: string[];
}

interface Trip {
  routeId: string;
  name: string;
  price: string;
  date: string;
  time: string;
  slot: number;
}

interface EditableTrip extends Trip {
  id: string
}

export function TripsList() {
  const [trips, setTrips] = useState<Record<string, Trip>>({})
  const [routes, setRoutes] = useState<Record<string, Route>>({})
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null)
  const [editingTrip, setEditingTrip] = useState<string | null>(null)
  const [editedTrip, setEditedTrip] = useState<typeof trips[keyof typeof trips] | null>(null)
  const [isAddingTrip, setIsAddingTrip] = useState(false)
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribeTrips = subscribeToCollection<Record<string, Trip>>('trips', (data) => {
      setTrips(data || {} as Record<string, Trip>)
    })
    
    const unsubscribeRoutes = subscribeToCollection<Record<string, Route>>('routes', (data) => {
      setRoutes(data || {} as Record<string, Route>)
    })

    return () => {
      unsubscribeTrips()
      unsubscribeRoutes()
    }
  }, [])

  const groupedTrips = Object.entries(trips).reduce((acc, [id, trip]) => {
    if (!acc[trip.routeId]) {
      acc[trip.routeId] = []
    }
    acc[trip.routeId].push({ ...trip, id })
    return acc
  }, {} as Record<string, EditableTrip[]>)

  const handleEditClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTrip(id)
    setEditedTrip({ ...trips[id], id } as EditableTrip)
  }

  const handleSaveEdit = async () => {
    if (editingTrip && editedTrip) {
      try {
        if (editingTrip !== (editedTrip as EditableTrip).id) {
          await setDocument(`trips/${(editedTrip as EditableTrip).id}`, editedTrip)
          await deleteDocument(`trips/${editingTrip}`)
        } else {
          await updateDocument(`trips/${editingTrip}`, editedTrip)
        }
        setEditingTrip(null)
        setEditedTrip(null)
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error)
      }
    }
  }

  const handleAddTrip = async (newTrip: Trip & { id: string }) => {
    try {
      await setDocument(`trips/${newTrip.id}`, newTrip)
      setIsAddingTrip(false)
    } catch (error) {
      console.error('Lỗi khi thêm mới:', error)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    try {
      await deleteDocument(`trips/${id}`)
      setDeletingTripId(null)
    } catch (error) {
      console.error('Lỗi khi xóa chuyến xe:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý chuyến xe</h1>
        <Button onClick={() => setIsAddingTrip(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm chuyến xe mới
        </Button>
      </div>
      {Object.entries(groupedTrips).map(([routeId, routeTrips]) => (
        <div key={routeId}>
          <h2 className="mb-4 text-xl font-semibold">
            {routes[routeId]?.name || routeId}
          </h2>
          <div className="space-y-4">
            {routeTrips.map((trip: EditableTrip) => (
              <Card key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{trip.name}</CardTitle>
                  <Badge variant={trip.slot > 10 ? "default" : "destructive"}>
                    {trip.slot} chỗ trống
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Mã chuyến: {trip.id}</p>
                      <p className="font-semibold">{trip.price} VND</p>
                      <p className="text-sm">{trip.date} - {trip.time}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={(e) => handleEditClick(trip.id, e)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeletingTripId(trip.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}
                    >
                      {expandedTrip === trip.id ? "Ẩn điểm dừng" : "Xem điểm dừng"}
                    </Button>
                    {expandedTrip === trip.id && (
                      <div className="mt-2 p-2 bg-gray-100 rounded-md">
                        <ul className="list-disc list-inside text-sm">
                          {routes[trip.routeId]?.locations.map((location: string, index: number) => (
                            <li key={index}>{location}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      {editingTrip && editedTrip && (
        <EditModal
          isOpen={true}
          onClose={() => {
            setEditingTrip(null)
            setEditedTrip(null)
          }}
          title="Chỉnh sửa chuyến xe"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            <div>
              <label htmlFor="tripId" className="block text-sm font-medium text-gray-700">
                Mã chuyến xe (tối đa 6 ký tự)
              </label>
              <Input 
                id="tripId" 
                value={(editedTrip as EditableTrip).id}
                maxLength={6}
                pattern="^[A-Za-z0-9]{1,6}$"
                className="mt-1 uppercase"
                placeholder="VD: TR001"
                onChange={(e) => {
                  const newId = e.target.value.toUpperCase().slice(0, 6);
                  setEditedTrip({ ...editedTrip, id: newId } as EditableTrip)
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Chỉ cho phép chữ và số, tự động chuyển thành chữ in hoa
              </p>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên chuyến</label>
              <Input
                id="name"
                value={editedTrip.name}
                onChange={(e) => setEditedTrip({ ...editedTrip, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Ngày</label>
              <Input
                id="date"
                value={editedTrip.date}
                onChange={(e) => setEditedTrip({ ...editedTrip, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Giờ</label>
              <Input
                id="time"
                value={editedTrip.time}
                onChange={(e) => setEditedTrip({ ...editedTrip, time: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
              <Input
                id="price"
                value={editedTrip.price}
                onChange={(e) => setEditedTrip({ ...editedTrip, price: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="slot" className="block text-sm font-medium text-gray-700">Chỗ trống</label>
              <Input
                id="slot"
                type="number"
                value={editedTrip.slot}
                onChange={(e) => setEditedTrip({ ...editedTrip, slot: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </EditModal>
      )}
      <Dialog open={isAddingTrip} onOpenChange={setIsAddingTrip}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm chuyến xe mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            // Chuyển đổi định dạng ngày từ yyyy-mm-dd sang dd/mm/yyyy
            const rawDate = formData.get('date') as string;
            const [year, month, day] = rawDate.split('-');
            const formattedDate = `${day}/${month}/${year}`;
            
            const newTrip = {
              id: formData.get('tripId') as string,
              name: formData.get('name') as string,
              date: formattedDate, // Sử dụng ngày đã định dạng
              time: formData.get('time') as string,
              price: formData.get('price') as string,
              routeId: formData.get('routeId') as string,
              slot: parseInt(formData.get('slot') as string),
            };
            handleAddTrip(newTrip);
          }} className="space-y-4">
            <div>
              <label htmlFor="tripId" className="block text-sm font-medium text-gray-700">
                Mã chuyến xe (tối đa 6 ký tự)
              </label>
              <Input 
                id="tripId" 
                name="tripId" 
                required 
                maxLength={6}
                pattern="^[A-Za-z0-9]{1,6}$"
                className="mt-1 uppercase"
                placeholder="VD: TR001"
                onInput={(e) => {
                  const input = e.currentTarget;
                  input.value = input.value.toUpperCase().slice(0, 6);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Chỉ cho phép chữ và số, tự động chuyển thành chữ in hoa
              </p>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên chuyến</label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Ngày</label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                required 
                className="mt-1"
                min={new Date().toISOString().split('T')[0]} // Chỉ cho phép chọn từ ngày hiện tại trở đi
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Giờ</label>
              <Input id="time" name="time" type="time" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
              <Input id="price" name="price" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="routeId" className="block text-sm font-medium text-gray-700">Tuyến xe</label>
              <select id="routeId" name="routeId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                {Object.entries(routes as Record<string, Route>).map(([id, route]) => (
                  <option key={id} value={id}>{route.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="slot" className="block text-sm font-medium text-gray-700">Số chỗ trống</label>
              <Input id="slot" name="slot" type="number" required className="mt-1" />
            </div>
            <DialogFooter>
              <Button type="submit">Thêm chuyến xe</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deletingTripId} onOpenChange={() => setDeletingTripId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chuyến xe</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chuyến xe này? Hành động này không thể hoàn tác.
              Lưu ý: Việc xóa chuyến xe sẽ ảnh hưởng đến các vé đã đặt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTripId(null)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletingTripId && handleDeleteTrip(deletingTripId)}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

