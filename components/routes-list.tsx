'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditModal } from '@/components/edit-modal'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export function RoutesList() {
  const [routes, setRoutes] = useState<Record<string, Route>>({})
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [editingRoute, setEditingRoute] = useState<string | null>(null)
  const [editedRoute, setEditedRoute] = useState<any | null>(null)
  const [isAddingRoute, setIsAddingRoute] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToCollection('routes', (data) => {
      setRoutes(data as Record<string, Route> || {})
    })
    return () => unsubscribe()
  }, [])

  const handleEditClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingRoute(id)
    setEditedRoute(routes[id])
  }

  const handleSaveEdit = async () => {
    if (editingRoute && editedRoute) {
      try {
        await updateDocument(`routes/${editingRoute}`, editedRoute)
        setEditingRoute(null)
        setEditedRoute(null)
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error)
      }
    }
  }

  const handleAddRoute = async (newRoute: any) => {
    try {
      const routeId = newRoute.name.toUpperCase().replace(/\s+/g, '')
      await setDocument(`routes/${routeId}`, {
        ...newRoute,
        available: true
      })
      setIsAddingRoute(false)
    } catch (error) {
      console.error('Lỗi khi thêm mới:', error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDocument(`users/${id}`)
      setDeletingUserId(null)
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý tuyến xe</h1>
        <Button onClick={() => setIsAddingRoute(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tuyến xe mới
        </Button>
      </div>
      {Object.entries(routes).map(([id, route]) => (
        <Card key={id} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{route.name}</CardTitle>
            <Badge variant={route.available ? "default" : "destructive"}>
              {route.available ? "Hoạt động" : "Không hoạt động"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Mã tuyến: {id}</p>
                <p className="font-semibold">{route.price} VND</p>
              </div>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={(e) => handleEditClick(id, e)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDeletingUserId(id)}
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
                onClick={() => setExpandedRoute(expandedRoute === id ? null : id)}
              >
                {expandedRoute === id ? "Ẩn điểm dừng" : "Xem điểm dừng"}
              </Button>
              {expandedRoute === id && (
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <ul className="list-disc list-inside text-sm">
                    {route.locations.map((location, index) => (
                      <li key={index}>{location}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {editingRoute && editedRoute && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingRoute(null)}
          title="Chỉnh sửa tuyến xe"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên tuyến</label>
              <Input
                id="name"
                value={editedRoute.name}
                onChange={(e) => setEditedRoute({ ...editedRoute, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
              <Input
                id="price"
                value={editedRoute.price}
                onChange={(e) => setEditedRoute({ ...editedRoute, price: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                id="available"
                value={editedRoute.available ? 'true' : 'false'}
                onChange={(e) => setEditedRoute({ ...editedRoute, available: e.target.value === 'true' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>
            <div>
              <label htmlFor="locations" className="block text-sm font-medium text-gray-700">Điểm dừng</label>
              <textarea
                id="locations"
                value={editedRoute.locations.join('\n')}
                onChange={(e) => setEditedRoute({ ...editedRoute, locations: e.target.value.split('\n') })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={5}
              />
            </div>
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </EditModal>
      )}
      <Dialog open={isAddingRoute} onOpenChange={setIsAddingRoute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm tuyến xe mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newRoute = {
              name: formData.get('name') as string,
              price: formData.get('price') as string,
              available: formData.get('available') === 'true',
              locations: (formData.get('locations') as string).split('\n'),
            };
            handleAddRoute(newRoute);
          }} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên tuyến</label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
              <Input id="price" name="price" required className="mt-1" />
            </div>
            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select id="available" name="available" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>
            <div>
              <label htmlFor="locations" className="block text-sm font-medium text-gray-700">Điểm dừng (mỗi điểm một dòng)</label>
              <textarea
                id="locations"
                name="locations"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Thêm tuyến xe</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deletingUserId} onOpenChange={() => setDeletingUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tuyến xe</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tuyến xe này? Hành động này không thể hoàn tác.
              Lưu ý: Việc xóa tuyến xe sẽ ảnh hưởng đến các vé đã đặt của họ.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUserId(null)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletingUserId && handleDeleteUser(deletingUserId)}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

