'use client'

import { useEffect, useState } from 'react'
import { BusCard } from '@/components/bus-card'
import busRoutes from '@/data/bus-routes.json'
import { getProvinceNameById } from '@/lib/utils/province'

interface BusResultsProps {
    provinceId: string;
}

interface Trip {
    id: string;
    name: string;
    time: string;
    date: string;
    price: string;
    slot: number;
    location: string[];
}

interface RouteData {
    name: string;
    trips: Trip[];
}

interface Routes {
    [key: string]: RouteData;
}

interface BusRoutes {
    routes: Routes;
}

// Thêm kiểu cho busRoutes
const typedBusRoutes = busRoutes as BusRoutes;

export function BusResults({ provinceId }: BusResultsProps) {
    const [trips, setTrips] = useState<Trip[]>([])

    useEffect(() => {
        if (provinceId) {
            // Lấy chuyến đi dựa theo provinceId
            const routeData = typedBusRoutes.routes[provinceId.toUpperCase()]
            if (routeData) {
                setTrips(routeData.trips)
            } else {
                setTrips([])
            }
        }
    }, [provinceId])

    return (
        <div className="grid gap-6">
            <div className="space-y-6">
                <div className="rounded-3xl bg-white md:p-6">
                    <div className="mb-4">
                        <div className="flex gap-2 md:flex-row flex-col">
                            <div className="text-xl font-bold text-red-600">
                                HolaBus
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">
                                    Đại học FPT (Hà Nội) → {getProvinceNameById(provinceId)}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-16">
                        <div className="text-sm text-gray-500">
                            Tìm thấy {trips.length} chuyến
                        </div>
                        {trips.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Rất tiếc địa điểm bạn chọn HolaBus đã hết vé hoặc không có tuyến rồi 😿</p>
                            </div>
                        ) : (
                            trips.map((trip) => (
                                <BusCard key={trip.id} {...trip} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

