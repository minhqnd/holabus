'use client';

import React, { useState, useEffect } from 'react';
import { Scanner, centerText } from '@yudiel/react-qr-scanner';
import { subscribeToCollection } from '@/lib/firebase' // or your fetching method
import { Label } from '@/components/ui/label'
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react'

const CheckinPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [paused, setPaused] = useState(false);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [bookings, setBookings] = useState<Record<string, any>>({});
  const [trips, setTrips] = useState<Record<string, any>>({});
  const [routes, setRoutes] = useState<Record<string, any>>({});

  useEffect(() => {
    // Fetch or subscribe to 'users' collection
    const unsubscribeBookings = subscribeToCollection<Record<string, any>>('bookings', (data) => {
      setBookings(data || {});
    });
    const unsubscribeUsers = subscribeToCollection<Record<string, any>>('users', (data) => {
      setUsers(data || {});
    });
    const unsubscribeTrips = subscribeToCollection<Record<string, any>>('trips', (data) => {
      setTrips(data || {});
    });
    const unsubscribeRoutes = subscribeToCollection<Record<string, any>>('routes', (data) => {
      setRoutes(data || {});
    });

    return () => {
      unsubscribeBookings();
      unsubscribeUsers();
      unsubscribeTrips();
      unsubscribeRoutes();
    };
  }, []);

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      setScanResult(result[0].rawValue);
      // setPaused(true);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const closePopup = () => {
    setScanResult(null);
    // setPaused(false);
  };

  return (
    <div className="w-full h-full pt-12 p-2">
      <div className="w-full h-auto">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          paused={paused}
          components={{ tracker: centerText }}
          styles={{
            container: { width: '100%', margin: '0 auto', height: '100%', borderRadius: '1rem' },
            video: { width: '100%', height: '100%' }
          }}
        />
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg p-6">
        <div className="border-b border-dashed bg-red-50/50 p-4 mb-4">
          <Label className="text-xl font-bold text-red-800">Check-in lên xe</Label>
        </div>
        <p className="mb-4 text-gray-500">{scanResult}</p>
        {scanResult && bookings[scanResult] ? (
          (() => {
            const booking = bookings[scanResult];
            const user = users[booking.userId];
            const trip = trips[booking.tripId];
            const route = trip ? routes[trip.routeId] : null;
            return (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left column */}
                <div className="space-y-4">
                  {/* Booking info */}
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-red-600" />
                    <p className="text-sm text-gray-600">Booking ID: <span className="font-medium">{scanResult}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-red-600" />
                    <p className="text-sm text-gray-600">Created At: <span className="font-medium">{booking.createdAt}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-red-600" />
                    <p className="text-sm text-gray-600">Paid: <span className="font-medium">{booking.paid ? "Yes" : "No"}</span></p>
                  </div>
                  {/* User info */}
                  {user ? (
                    <>
                      <hr className="my-4" />
                      <label className="text-red-800 font-medium">Thông tin hành khách</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-red-600" />
                          <p className="text-sm text-gray-600">{user.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-red-600" />
                          <p className="text-sm text-gray-600">{user.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-red-600" />
                          <p className="text-sm text-gray-600">{user.mail}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-600">Không tìm thấy thông tin người dùng.</p>
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Trip info */}
                  <hr className="my-4 md:hidden" />
                  <label className="text-red-800 font-medium">Thông tin chuyến xe</label>
                  {trip ? (
                    <div className="mt-2 space-y-2">
                      <p><strong>Trip Name:</strong> {trip.name}</p>
                      <p><strong>Time:</strong> {trip.time}</p>
                      {route ? <p><strong>Route Name:</strong> {route.name}</p> : null}
                    </div>
                  ) : (
                    <p className="text-red-600">Không tìm thấy thông tin chuyến xe.</p>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <p className="text-red-600">Không tìm thấy thông tin booking.</p>
        )}
        <div className="border-t border-dashed bg-gray-50/50 p-4 mt-4 text-center text-sm text-gray-500">
          <p>Vui lòng đến trước giờ khởi hành 15 phút. Xin cảm ơn quý khách!</p>
        </div>
      </div>
    </div>
  );
};

export default CheckinPage;
