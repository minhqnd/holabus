'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookingDetails } from '@/components/booking-details'
import { getBookingById } from '@/lib/api/bookings'
import { getTripsById } from '@/lib/api/trips'
import { getRouteByProvince } from '@/lib/api/routes'
import { getUserById } from '@/lib/api/user'
import { sendGAEvent } from '@next/third-parties/google'

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

export function BookingLookup() {
    const [bookingId, setBookingId] = useState('')
    const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null)
    const [error, setError] = useState('')

    const searchParams = useSearchParams()
    const initialBookingId = searchParams.get('bookingId') || ''

    const handleSearch = useCallback(async (id?: string): Promise<void> => {
        const searchId = id || bookingId
        setError('')
        setBookingInfo(null)
        sendGAEvent('event', 'tra-cuu', { value: searchId })

        if (!searchId) {
            setError('Vui lòng nhập mã đặt chỗ')
            return
        }
        try {
            const booking = await getBookingById(searchId)
            if (!booking) {
                setError('Không tìm thấy thông tin đặt chỗ')
                return
            }
            const trip = await getTripsById(booking.tripId)
            const route = await getRouteByProvince(trip.routeId)
            const user = await getUserById(booking.userId)
            setBookingInfo({ booking, trip, route, user, bookingId: searchId })
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Lỗi không xác định')
            }
        }
    }, [bookingId, setError, setBookingInfo])

    useEffect(() => {
        if (!bookingId && initialBookingId) {
            setBookingId(initialBookingId)
            handleSearch(initialBookingId)
        }
    }, [initialBookingId, handleSearch])

    return (
        <div className="rounded-3xl bg-white p-6 shadow-lg" >
            <div className="mb-6" >
                <Label htmlFor="bookingId" > Mã đặt chỗ </Label>
                < div className="mt-2 flex gap-4" >
                    <Input
                        type="text"
                        id="bookingId"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)
                        }
                        placeholder="Nhập mã vé"
                        className="rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-500 focus-visible:ring-2 text-base px-4 w-full"
                        height="3rem"
                        borderRadius="9999px"
                    />
                    <Button onClick={() => handleSearch()} className="rounded-full bg-red-600 h-[3rem] hover:bg-red-700" >
                        Tra cứu
                    </Button>
                </div>
            </div>

            {error && <p className="mb-4 text-center text-red-600" > {error} </p>}

            {bookingInfo && <BookingDetails info={bookingInfo} />}
        </div>
    )
}

