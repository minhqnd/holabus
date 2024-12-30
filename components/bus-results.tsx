'use client'

import { useEffect, useState } from 'react'
import { BusCard } from '@/components/bus-card'
import busRoutes from '@/data/bus-routes.json'
// import { getProvinceNameById } from '@/lib/utils/province'

interface BusResultsProps {
    provinceId: string;
    provinceName: string;
    selectedTripId: string;
    onTripSelect: (tripId: string) => void;
    currentStep: number;
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

export function BusResults({ provinceId, provinceName, selectedTripId, onTripSelect, currentStep }: BusResultsProps) {
    const [trips, setTrips] = useState<Trip[]>([])

    useEffect(() => {
        if (provinceId) {
            const routeData = typedBusRoutes.routes[provinceId.toUpperCase()]
            if (routeData) {
                setTrips(routeData.trips)
            } else {
                setTrips([])
            }
        }
    }, [provinceId])

    // Lọc chỉ hiển thị chuyến được chọn khi ở bước 2
    const displayedTrips = currentStep === 2 
        ? trips.filter(trip => trip.id === selectedTripId)
        : trips

    return (
        <div className="space-y-6 mb-8">
            <div className="rounded-3xl bg-white p-6">
                <div className="mb-4">
                    <div className="flex gap-2 md:flex-row flex-col">
                        <div className="text-xl font-bold text-red-600">
                            HolaBus
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                Đại học FPT (Hà Nội) → {provinceName}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className={`space-y-4 ${currentStep === 1 ? 'mb-16' : 'mb-0'}`}>
                    {currentStep === 1 && (
                        <div className="text-sm text-gray-500">
                            Tìm thấy {trips.length} chuyến
                        </div>
                    )}
                    {displayedTrips.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Rất tiếc địa điểm bạn chọn HolaBus đã hết vé hoặc không có tuyến rồi 😿</p>
                        </div>
                    ) : (
                        displayedTrips.map((trip) => (
                            <BusCard 
                                key={trip.id} 
                                {...trip} 
                                isSelected={trip.id === selectedTripId}
                                onSelect={() => onTripSelect(trip.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

