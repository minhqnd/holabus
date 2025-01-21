'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditModal } from '@/components/edit-modal'
import { Pencil, Plus, Trash2, Circle } from 'lucide-react'
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
import { toast } from 'react-toastify'
import { Checkbox } from "@/components/ui/checkbox"

const transferPoints: Record<string, string> = {
  "Tu_di_den_truong": "Tự đi đến trường",
  "Den_do_tan_xa": "Đèn đỏ Tân Xã",
  "Cay_xang_39": "Cây xăng 39",
  "Cay_xa_cu_phenikaa": "Cây xăng xà cừ",
  "Cho_hoa_lac": "Chợ Hoà Lạc",
}

interface Bus {
    id: string;
    name: string;
    plateNumber: string;
    active: boolean;
    bookingIds?: string[];
}

interface Booking {
    checkin: any
    userId: string;
    tripId: string;
    busId: string;
    paid: boolean;
    createdAt: string;
}

interface User {
    name: string;
    mail: string;
    phone: string;
    sex: string;
    transferPoint: string;
    destination: string;
}

interface Trip {
    name: string;
    routeId: string;
    date: string;
    time: string;
}

export function BusesList() {
    const [buses, setBuses] = useState<Record<string, Bus>>({})
    const [bookings, setBookings] = useState<Record<string, Booking>>({})
    const [editingBus, setEditingBus] = useState<Bus | null>(null)
    const [isAddingBus, setIsAddingBus] = useState(false)
    const [deletingBusId, setDeletingBusId] = useState<string | null>(null)
    const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
    const [showBookingSelector, setShowBookingSelector] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [trips, setTrips] = useState<Record<string, Trip>>({});

    useEffect(() => {
        const unsubscribeBuses = subscribeToCollection('buses', (data) => {
            setBuses(data as Record<string, Bus> || {})
        })

        const unsubscribeBookings = subscribeToCollection('bookings', (data) => {
            setBookings(data as Record<string, Booking> || {})
        })

        const unsubscribeUsers = subscribeToCollection('users', (data) => {
            setUsers(data as Record<string, User> || {})
        })

        const unsubscribeTrips = subscribeToCollection('trips', (data) => {
            setTrips(data as Record<string, Trip> || {})
        })

        return () => {
            unsubscribeBuses()
            unsubscribeBookings()
            unsubscribeUsers()
            unsubscribeTrips()
        }
    }, [])

    const handleSaveEdit = async () => {
        if (!editingBus) return

        const toastId = toast.loading('Đang cập nhật...')
        try {
            await updateDocument(`buses/${editingBus.id}`, editingBus)
            setEditingBus(null)
            toast.update(toastId, {
                render: 'Cập nhật thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            })
        } catch (error) {
            toast.update(toastId, {
                render: 'Lỗi khi cập nhật',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            })
        }
    }

    const handleAddBus = async (busData: Bus) => {
        const toastId = toast.loading('Đang thêm xe...')
        try {
            await setDocument(`buses/${busData.id}`, busData)
            setIsAddingBus(false)
            toast.update(toastId, {
                render: 'Thêm xe thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            })
        } catch (error) {
            toast.update(toastId, {
                render: 'Lỗi khi thêm xe',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            })
        }
    }

    const handleDeleteBus = async (id: string) => {
        const toastId = toast.loading('Đang xóa...')
        try {
            await deleteDocument(`buses/${id}`)
            setDeletingBusId(null)
            toast.update(toastId, {
                render: 'Xóa thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            })
        } catch (error) {
            toast.update(toastId, {
                render: 'Lỗi khi xóa',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            })
        }
    }

    const getBusBookings = (busId: string) => {
        return Object.entries(bookings)
            .filter(([, booking]) => booking.busId === busId)
            .sort((a, b) => new Date(b[1].createdAt).getTime() - new Date(a[1].createdAt).getTime())
    }

    const handleAddBookingsToBus = async () => {
        if (!selectedBusId) return;

        const toastId = toast.loading('Đang thêm khách...');
        try {
            await Promise.all(
                selectedBookings.map(bookingId =>
                    updateDocument(`bookings/${bookingId}`, { busId: selectedBusId })
                )
            );

            setShowBookingSelector(false);
            setSelectedBookings([]);
            toast.update(toastId, {
                render: 'Thêm khách thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        } catch (error) {
            toast.update(toastId, {
                render: 'Lỗi khi thêm khách',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        }
    };

    const getAvailableBookings = () => {
        return Object.entries(bookings)
            .filter(([, booking]) => booking.paid && !booking.busId)
            .sort((a, b) => new Date(b[1].createdAt).getTime() - new Date(a[1].createdAt).getTime());
    };

    const getAvailableBookingsByTrip = () => {
        const bookingsByTrip: Record<string, Array<[string, Booking]>> = {};

        Object.entries(bookings)
            .filter(([, booking]) => booking.paid && !booking.busId)
            .forEach(([bookingId, booking]) => {
                if (!bookingsByTrip[booking.tripId]) {
                    bookingsByTrip[booking.tripId] = [];
                }
                bookingsByTrip[booking.tripId].push([bookingId, booking]);
            });

        return bookingsByTrip;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý xe bus</h1>
                <Button onClick={() => setIsAddingBus(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm xe mới
                </Button>
            </div>

            {Object.entries(buses).map(([id, bus]) => (
                <Card key={id} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {bus.name} - {bus.plateNumber}
                        </CardTitle>
                        <Badge variant={bus.active ? "default" : "destructive"}>
                            {bus.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground">ID: {id}</p>
                            </div>
                            <div className="space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => setEditingBus(bus)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingBusId(id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">Danh sách hành khách</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedBusId(id);
                                        setShowBookingSelector(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm khách
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">#</th>
                                            <th className="px-4 py-2 text-left">Booking ID</th>
                                            <th className="px-4 py-2 text-left">Họ tên</th>
                                            <th className="px-4 py-2 text-left">Số điện thoại</th>
                                            <th className="px-4 py-2 text-left">Điểm đến</th>
                                            <th className="px-4 py-2 text-left">Điểm đón</th>
                                            <th className="px-4 py-2 text-center">Check-in</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getBusBookings(id).map(([bookingId, booking], index) => {
                                            const user = users[booking.userId] || {};
                                            return (
                                                <tr key={bookingId} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{bookingId}</td>
                                                    <td className="px-4 py-2">{user.name}</td>
                                                    <td className="px-4 py-2">{user.phone}</td>
                                                    <td className="px-4 py-2">{user.destination}</td>
                                                    <td className="px-4 py-2">{transferPoints[user.transferPoint as keyof typeof transferPoints] || 'N/A'}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <Circle
                                                            className={`h-4 w-4 stroke-0 inline-block`}
                                                            fill={booking.checkin ? 'green' : 'red'}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={isAddingBus} onOpenChange={setIsAddingBus}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm xe mới</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const newBus: Bus = {
                            id: formData.get('id') as string,
                            name: formData.get('name') as string,
                            plateNumber: formData.get('plateNumber') as string,
                            active: true
                        }
                        handleAddBus(newBus)
                    }} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ID xe</label>
                            <Input name="id" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên xe</label>
                            <Input name="name" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Biển số xe</label>
                            <Input name="plateNumber" required />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Thêm xe</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {editingBus && (
                <EditModal
                    isOpen={true}
                    onClose={() => setEditingBus(null)}
                    title="Chỉnh sửa thông tin xe"
                >
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSaveEdit()
                    }} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ID xe</label>
                            <Input
                                value={editingBus.id}
                                onChange={(e) => setEditingBus({ ...editingBus, id: e.target.value })}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên xe</label>
                            <Input
                                value={editingBus.name}
                                onChange={(e) => setEditingBus({ ...editingBus, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Biển số xe</label>
                            <Input
                                value={editingBus.plateNumber}
                                onChange={(e) => setEditingBus({ ...editingBus, plateNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Trạng thái</label>
                            <select
                                value={editingBus.active.toString()}
                                onChange={(e) => setEditingBus({ ...editingBus, active: e.target.value === 'true' })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="true">Đang hoạt động</option>
                                <option value="false">Ngừng hoạt động</option>
                            </select>
                        </div>
                        <Button type="submit">Lưu thay đổi</Button>
                    </form>
                </EditModal>
            )}

            <Dialog open={!!deletingBusId} onOpenChange={() => setDeletingBusId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa xe</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingBusId(null)}>
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletingBusId && handleDeleteBus(deletingBusId)}
                        >
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showBookingSelector} onOpenChange={setShowBookingSelector}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Chọn khách hàng để thêm vào xe</DialogTitle>
                        <DialogDescription>
                            Chọn các khách hàng đã thanh toán để thêm vào xe.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        {Object.entries(getAvailableBookingsByTrip()).map(([tripId, tripBookings]) => {
                            const trip = trips[tripId];
                            return (
                                <div key={tripId} className="mb-6">
                                    <h3 className="font-medium text-lg mb-2 bg-gray-100 p-2 rounded">
                                        {trip?.name} - {trip?.date} {trip?.time}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px]">
                                            <thead className="bg-white">
                                                <tr>
                                                    <th className="p-2"></th>
                                                    <th className="p-2 text-left">Booking ID</th>
                                                    <th className="p-2 text-left">Khách hàng</th>
                                                    <th className="p-2 text-left">Số điện thoại</th>
                                                    <th className="p-2 text-left">Điểm đến</th>
                                                    <th className="p-2 text-left">Điểm đón</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tripBookings.map(([bookingId, booking]) => {
                                                    const user = users[booking.userId] || {};
                                                    return (
                                                        <tr key={bookingId} className="border-b hover:bg-gray-50">
                                                            <td className="p-2">
                                                                <Checkbox
                                                                    checked={selectedBookings.includes(bookingId)}
                                                                    onCheckedChange={(checked) => {
                                                                        setSelectedBookings(prev =>
                                                                            checked
                                                                                ? [...prev, bookingId]
                                                                                : prev.filter(id => id !== bookingId)
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="p-2">{bookingId}</td>
                                                            <td className="p-2">{user.name || 'N/A'}</td>
                                                            <td className="p-2">{user.phone || 'N/A'}</td>
                                                            <td className="p-2">{user.destination || 'N/A'}</td>
                                                            <td className="p-2">
                                                                {transferPoints[user.transferPoint as keyof typeof transferPoints] || 'N/A'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBookingSelector(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleAddBookingsToBus}
                            disabled={selectedBookings.length === 0}
                        >
                            Thêm {selectedBookings.length} khách
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

