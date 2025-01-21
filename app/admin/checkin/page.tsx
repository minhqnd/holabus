'use client';

import React, { useState, useEffect } from 'react';
import { Scanner, centerText } from '@yudiel/react-qr-scanner';
import { subscribeToCollection, updateDocument } from '@/lib/firebase' // or your fetching method
import { Label } from '@/components/ui/label'
import { Calendar, Clock, MapPin, User, Phone, Mail, Circle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/button';
import { toast, ToastContainer } from 'react-toastify';
// import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  name: string;
  phone: string;
  mail: string;
  destination?: string;
  transferPoint?: string;
}

interface Booking {
  userId: string;
  tripId: string;
  paid: boolean;
  checkin?: string;
  busId?: string;
}

interface Trip {
  routeId: string;
  date: string;
  time: string;
}

interface Route {
  name: string;
}

interface Bus {
  id: string;
  name: string;
  plateNumber: string;
  active: boolean;
}



const CheckinPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [confirmCheckin, setConfirmCheckin] = useState(false);
  // const [paused, setPaused] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const [trips, setTrips] = useState<Record<string, Trip>>({});
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [buses, setBuses] = useState<Record<string, Bus>>({});
  // const [searchTerm] = useState('');
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  // const transferPoints: Record<string, string> = {
  //   "Tu_di_den_truong": "Tự đi đến trường",
  //   "Den_do_tan_xa": "Đèn đỏ Tân Xã",
  //   "Cay_xang_39": "Cây xăng 39",
  //   "Cay_xa_cu_phenikaa": "Cây xăng xà cừ",
  //   "Cho_hoa_lac": "Chợ Hoà Lạc",
  // }
  useEffect(() => {
    // Fetch or subscribe to 'users' collection
    const unsubscribeBookings = subscribeToCollection<Record<string, Booking>>('bookings', (data) => {
      setBookings(data || {});
    });
    const unsubscribeUsers = subscribeToCollection<Record<string, User>>('users', (data) => {
      setUsers(data || {});
    });
    const unsubscribeTrips = subscribeToCollection<Record<string, Trip>>('trips', (data) => {
      setTrips(data || {});
    });
    const unsubscribeRoutes = subscribeToCollection<Record<string, Route>>('routes', (data) => {
      setRoutes(data || {});
    });
    const unsubscribeBuses = subscribeToCollection<Record<string, Bus>>('buses', (data) => {
      setBuses(data || {});
    });

    return () => {
      unsubscribeBookings();
      unsubscribeUsers();
      unsubscribeTrips();
      unsubscribeRoutes();
      unsubscribeBuses();
    };
  }, []);

  const handleScan = (result: { rawValue: string }[]) => {
    if (result && result.length > 0) {
      setScanResult(null); // Clear content
      setConfirmCheckin(false); // Reset button state
      setTimeout(() => {
        setScanResult(result[0].rawValue);
        // document.querySelector('.flex-1.overflow-y-auto')?.scrollTo(0, 0); // Scroll to top
      }, 50); // Delay to ensure content is cleared
      // setPaused(true);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error('An unknown error occurred:', error);
    }
  };

  const handleCheckin = async () => {
    if (!confirmCheckin) {
      setConfirmCheckin(true);
    } else {
      const timestamp = new Date().toISOString();
      const toastid = toast.loading('Đang gửi hóa đơn...');
      try {
        await updateDocument(`bookings/${scanResult}`, { checkin: timestamp });
        // alert('Checkin thành công');
        toast.update(toastid, { render: "Checkin thành công", type: "success", isLoading: false, autoClose: 2000 });
      } catch (error) {
        console.error('Error updating checkin:', error);
        toast.update(toastid, { render: "Checkin thất bại", type: "error", isLoading: false, autoClose: 2000 });
        // alert('Checkin thất bại');
      }
      setConfirmCheckin(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getBusPassengers = (busId: string) => {
    return Object.entries(bookings)
      .filter(([, booking]) => booking.busId === busId)
      .map(([bookingId, booking]) => ({
        bookingId,
        ...booking,
        user: users[booking.userId],
      }));
  };

  // const filteredBuses = Object.entries(buses).filter(([, bus]) =>
  //   bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   bus.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const closePopup = () => {
  //   setScanResult(null);
  //   // setPaused(false);
  // };

  return (
    <div className="w-full h-screen pb-2 flex flex-col">
      <div className="snap-x snap-mandatory flex overflow-x-auto scrollbar-hide h-[calc(100vh-2rem)]">
        {/* Scanner Tab */}
        <div className="snap-center snap-always w-full h-full flex-shrink-0 flex flex-col">
          <div className="w-full h-full pt-2 p-2 flex flex-col items-center">
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light" />
            <Image src="/red-logo.png" alt="Red Logo" width={100} height={100} className='h-12 w-auto mb-4' />
            <div className="w-[70%] max-w-xl h-auto mx-auto mb-2">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                paused={false}
                components={{ tracker: centerText }}
                styles={{
                  container: { width: '100%', margin: '0 auto', height: '100%', borderRadius: '1rem' },
                  video: { width: '100%', height: '100%' }
                }}
              />
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg flex-1 flex flex-col items-center w-full">
              <div className="flex-1 overflow-y-auto w-full">
                <div className="relative border-b border-dashed bg-red-50/50 p-4 w-full">
                  <Label className="text-xl font-bold text-red-800 text-center">
                    {scanResult && bookings[scanResult] && users[bookings[scanResult].userId]
                      ? `${scanResult} - ${users[bookings[scanResult].userId].name}`
                      : 'Quét để xem thông tin booking'}
                  </Label>
                </div>
                {scanResult ? (
                  bookings[scanResult] ? (
                    (() => {
                      const booking = bookings[scanResult];
                      const user = users[booking.userId];
                      const trip = trips[booking.tripId];
                      const route = trip ? routes[trip.routeId] : null;
                      const transferPoints: Record<string, string> = {
                        "Tu_di_den_truong": "Tự đi đến trường",
                        "Den_do_tan_xa": "Đèn đỏ Tân Xã",
                        "Cay_xang_39": "Cây xăng 39",
                        "Cay_xa_cu_phenikaa": "Cây xăng xà cừ",
                        "Cho_hoa_lac": "Chợ Hoà Lạc",
                      };
                      return (
                        <div className="grid gap-3 md:grid-cols-2 p-4 w-full text-sm">
                          {/* Left column */}
                          <div className="space-y-2">
                            {/* Booking info */}
                            {/* <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                                <CreditCard className="h-5 w-5 text-red-600" />
                              </div>
                              <p className=" text-gray-600">{scanResult}</p>
                            </div> */}
                            {/* <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                                <User className="h-5 w-5 text-red-600" />
                              </div>
                              <p className=" text-gray-600">{user.name}</p>
                            </div> */}
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                                <Phone className="h-5 w-5 text-red-600" />
                              </div>
                              <p className="text-gray-600">{user.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                                <Mail className="h-5 w-5 text-red-600" />
                              </div>
                              <p className="text-gray-600">{user.mail}</p>
                            </div>
                            {/* </div> */}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${booking.paid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {booking.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </div>
                          </div>
                          {/* Right column */}
                          <div className="space-y-4">
                            {/* Trip info */}
                            <hr className="my-4 md:hidden" />
                            <h3 className="mb-4 text-lg font-semibold text-red-800">Thông tin chuyến đi</h3>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                  <MapPin className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Tuyến đường</p>
                                  <p className="font-medium">{route ? route.name : 'N/A'}</p>
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
                          <Button
                            className={`mt-4 rounded-full transition-colors duration-300 ${confirmCheckin ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'} text-white `}
                            onClick={handleCheckin}
                            disabled={!!booking.checkin}
                          >
                            {booking.checkin ? `Đã checkin lúc ${formatTimestamp(booking.checkin)}` : (confirmCheckin ? 'Xác nhận Checkin' : 'Checkin')}
                          </Button>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-red-600">Không tìm thấy thông tin booking.</p>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Bus Passengers Tab */}
        <div className="snap-center snap-always w-full h-full flex-shrink-0 p-4 flex flex-col">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedBusId} onValueChange={setSelectedBusId}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Chọn xe để xem danh sách khách" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(buses).map(([id, bus]) => (
                    <SelectItem key={id} value={id}>
                      {bus.name} - {bus.plateNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedBusId && (
                <Badge variant={buses[selectedBusId]?.active ? "default" : "destructive"}>
                  {getBusPassengers(selectedBusId).length} hành khách
                </Badge>
              )}
            </div>

            {selectedBusId && (
              <div className="border rounded-lg p-4 bg-white flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Họ tên</th>
                        <th className="px-4 py-2 text-left">SĐT</th>
                        {/* <th className="px-4 py-2 text-left">Điểm đón</th> */}
                        <th className="px-4 py-2 text-center">Check-in</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getBusPassengers(selectedBusId).map(({ bookingId, user, checkin }) => (
                        <tr key={bookingId} className="border-b">
                          <td className="px-4 py-2">{user?.name || 'N/A'}</td>
                            <td className="px-4 py-2">
                            {user?.phone ? (
                              <a href={`tel:${user.phone}`} className="text-blue-600 underline">
                              {user.phone}
                              </a>
                            ) : 'N/A'}
                            </td>
                          {/* <td className="px-4 py-2">
                            {user?.transferPoint ? transferPoints[user.transferPoint] : 'N/A'}
                          </td> */}
                          <td className="px-4 py-2 text-center">
                            <Circle
                              className="h-4 w-4 stroke-0 inline-block"
                              fill={checkin ? 'green' : 'red'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional: Tab indicators */}
      <div className="flex justify-center gap-2 py-2">
        <div className="w-2 h-2 rounded-full bg-red-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default CheckinPage;
