'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditModal } from '@/components/edit-modal'
import { Pencil, Plus } from 'lucide-react'
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
},
"HNQN02": {
  "date": "13/01/2025",
  "name": "FPT - Quảng Ninh",
  "price": "189.000",
  "routeId": "QUANGNINH",
  "slot": 29,
  "time": "13:05"
}
}

const routes = {
"HAIDUONG": {
  "name": "Hải Dương",
  "locations": [
    "Đại học FPT",
    "QL5",
    "Gia Lộc",
    "Hải Tân",
    "Tứ Kỳ"
  ]
},
"QUANGNINH": {
  "name": "Quảng Ninh",
  "locations": [
    "Đại học FPT",
    "Cầu Đại Phúc (QL18)",
    "Sao Đỏ (Hải Dương)",
    "Ngã 6 Đông Triều",
    "Uông Bí",
    "Tuần Châu",
    "BX Bãi Cháy"
  ]
}
}

export function TripsList() {
const [expandedTrip, setExpandedTrip] = useState<string | null>(null)
const [editingTrip, setEditingTrip] = useState<string | null>(null)
const [editedTrip, setEditedTrip] = useState<typeof trips[keyof typeof trips] | null>(null)
const [isAddingTrip, setIsAddingTrip] = useState(false)

const groupedTrips = Object.entries(trips).reduce((acc, [id, trip]) => {
  if (!acc[trip.routeId]) {
    acc[trip.routeId] = []
  }
  acc[trip.routeId].push({ id, ...trip })
  return acc
}, {} as Record<string, Array<{ id: string } & typeof trips[keyof typeof trips]>>)

const handleEditClick = (id: string, e: React.MouseEvent) => {
  e.stopPropagation()
  setEditingTrip(id)
  setEditedTrip(trips[id as keyof typeof trips])
}

const handleSaveEdit = () => {
  if (editingTrip && editedTrip) {
    // In a real application, you would update the backend here
    console.log('Saving edited trip:', editingTrip, editedTrip)
    // Update the local state to reflect the changes
    trips[editingTrip as keyof typeof trips] = editedTrip
    setEditingTrip(null)
    setEditedTrip(null)
  }
}

const handleAddTrip = (newTrip: typeof trips[keyof typeof trips]) => {
  // In a real application, you would update the backend here
  const newId = `NEW${Object.keys(trips).length + 1}`
  trips[newId as keyof typeof trips] = newTrip
  setIsAddingTrip(false)
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
        <h2 className="mb-4 text-xl font-semibold">{routes[routeId as keyof typeof routes].name}</h2>
        <div className="space-y-4">
          {routeTrips.map((trip) => (
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
                  <Button variant="ghost" size="sm" onClick={(e) => handleEditClick(trip.id, e)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
                        {routes[trip.routeId as keyof typeof routes].locations.map((location, index) => (
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
        onClose={() => setEditingTrip(null)}
        title="Chỉnh sửa chuyến xe"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
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
          const newTrip = {
            name: formData.get('name') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            price: formData.get('price') as string,
            routeId: formData.get('routeId') as string,
            slot: parseInt(formData.get('slot') as string),
          };
          handleAddTrip(newTrip);
        }} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên chuyến</label>
            <Input id="name" name="name" required className="mt-1" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Ngày</label>
            <Input id="date" name="date" type="date" required className="mt-1" />
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
              {Object.entries(routes).map(([id, route]) => (
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
  </div>
)
}

