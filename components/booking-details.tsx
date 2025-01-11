import { Calendar, Clock, MapPin, Phone, Mail, User, CreditCard, Ticket, Bus } from 'lucide-react'
import Image from 'next/image'

interface Booking {
    createdAt: string;
    paid: boolean;
    tripId: string;
    userId: string;
}
interface Trip {
    date: string;
    name: string;
    price: string;
    routeId: string;
    slot: number;
    time: string;
}
interface Route {
    locations: string[];
    name: string;
    price: string;
    available?: boolean;
}
interface UserData {
    mail?: string;
    name?: string;
    phone?: string;
    destination?: string;
    transferPoint?: string;
    sex?: string;
}
interface BookingInfo {
    bookingId: string;
    booking: Booking;
    trip: Trip;
    route: Route;
    user: UserData;
}

interface BookingDetailsProps {
    info: BookingInfo;
}

export function BookingDetails({ info }: BookingDetailsProps) {
    if (!info || !info.booking || !info.trip || !info.route || !info.user) {
        return <div>No booking details found</div>;
    }
    const { booking, trip, route, user, bookingId } = info
    const qrUrl = `https://api.holabus.com.vn/api/gen-qr?data=${route.name}`;
    const transferPoints: Record<string, string> = {
        "Tu_di_den_truong": "Tự đi đến trường",
        "Den_do_tan_xa": "Đèn đỏ Tân Xã",
        "Cay_xang_39": "Cây xăng 39",
        "Cay_xa_cu_phenikaa": "Cây xăng xà cừ",
        "Cho_hoa_lac": "Chợ Hoà Lạc",
    };
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg">
                {/* Ticket Header */}
                <div className="relative border-b border-dashed bg-red-50/50 p-6">
                    <div className="absolute -left-4 -top-4 h-24 w-24 rotate-12 text-red-100">
                        <Bus className="h-full w-full" />
                    </div>
                    <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-red-800">HolaBus</h2>
                            <p className="text-lg text-gray-600">Vé xe khách</p>
                        </div>
                        <div className="flex h-auto md:w-32 w-[70%] items-center justify-center rounded-lg bg-white p-2 shadow-md">
                            <Image
                                src={qrUrl}
                                alt="QR Code"
                                className="h-full w-full rounded-xl"
                                width={256}
                                height={256}
                            />
                        </div>
                    </div>
                </div>

                {/* Ticket Body */}
                <div className="grid gap-6 p-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-red-800">Thông tin chuyến đi</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <MapPin className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tuyến đường</p>
                                        <p className="font-medium">{route.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <Calendar className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày đi</p>
                                        <p className="font-medium">{trip.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <Clock className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Giờ khởi hành</p>
                                        <p className="font-medium">{trip.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <MapPin className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Điểm xuống</p>
                                        <p className="font-medium">{user.destination || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <MapPin className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Điểm trung chuyển</p>
                                        <p className="font-medium">{transferPoints[user.transferPoint ?? ''] || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-red-800">Thông tin vé</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <CreditCard className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Mã vé</p>
                                        <p className="font-medium">{bookingId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <Ticket className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Giá vé</p>
                                        <p className="text-xl font-bold text-red-600">{trip.price} VND</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-red-800">Thông tin hành khách</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <User className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Họ và tên</p>
                                        <p className="font-medium">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <Phone className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                        <Mail className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{user.mail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${booking.paid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {booking.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route Details */}
                <div className="border-t border-dashed bg-gray-50/50">
                    <div className="p-6">
                        <h3 className="mb-6 text-lg font-semibold text-red-800">Lộ trình chi tiết</h3>
                        <div className="relative ml-2">
                            <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gray-200"></div>
                            <ul className="space-y-6">
                                {route.locations.map((location: string, index: number) => (
                                    <li key={index} className="relative flex items-center gap-4">
                                        <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${index === 0
                                            ? 'bg-green-500 text-white'
                                            : index === route.locations.length - 1
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white'
                                            }`}>
                                            <span className="text-sm font-medium">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{location}</p>
                                            {index === 0 && <p className="text-sm text-green-600">Điểm đón</p>}
                                            {index === route.locations.length - 1 && <p className="text-sm text-red-600">Điểm đến</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Ticket Footer */}
                <div className="border-t border-dashed bg-red-50/50 p-4 text-center text-sm text-gray-500">
                    <p>Vui lòng đến trước giờ khởi hành 15 phút. Xin cảm ơn quý khách!</p>
                </div>
            </div>
        </div>
    )
}

