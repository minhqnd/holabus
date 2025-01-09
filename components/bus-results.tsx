'use client'

import { useEffect, useState } from 'react'
import { BusCard } from '@/components/bus-card'
import { getMapById, getTripsByProvince } from '@/lib/api/trips'
import { Skeleton } from '@/components/ui/skeleton'
import { getRouteByProvince } from '@/lib/api/routes'
// import { getProvinceNameById } from '@/lib/utils/province'

interface BusResultsProps {
    provinceId: string;
    provinceName: string;
    selectedTripId: string;
    onTripSelect: (tripId: string) => void;
    price: (price: string) => void;
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


interface RawTrip {
    id: string
    name: string
    time: string
    date: string
    price: string
    slot: number
}

// Thêm kiểu cho busRoutes

export function BusResults({ provinceId, provinceName, selectedTripId, onTripSelect, currentStep, price }: BusResultsProps) {
    const [trips, setTrips] = useState<Trip[]>([])
    const [map, setMap] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const routeData = await getRouteByProvince(provinceId)
                
                // Kiểm tra route có available không
                if (!routeData?.available) {
                    setTrips([])
                    setLoading(false)
                    return
                }

                const fetchedTrips = await getTripsByProvince(provinceId)
                const mapUrl = await getMapById(provinceId)
                setMap(mapUrl)
                
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                
                const availableTrips = (fetchedTrips as RawTrip[])
                    .map((trip: RawTrip) => ({
                        ...trip,
                        location: routeData?.locations || []
                    }))
                    .filter((trip: Trip) => {
                        const [day, month, year] = trip.date.split('/')
                        const tripDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                        tripDate.setHours(0, 0, 0, 0)
                        
                        return Number(trip.slot) > 0 && tripDate >= today
                    })

                setTrips(availableTrips)
            } catch (error) {
                console.error('Error fetching trips:', error)
                setTrips([])
            }
            setLoading(false)
        }

        fetchData()
    }, [provinceId])

    const displayedTrips = currentStep === 1 ? trips : trips.filter(trip => trip.id === selectedTripId)

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
                    {map && (
                        <div className="mt-4" dangerouslySetInnerHTML={{ __html: map }} />
                    )}
                </div>

                <div className={`space-y-4 ${currentStep === 1 ? 'mb-8' : 'mb-0'}`}>
                    {currentStep === 1 && !loading && (
                        <div className="text-sm text-gray-500">
                            Tìm thấy {trips.length} chuyến
                        </div>
                    )}
                    
                    {loading ? (
                        // Loading skeleton
                        Array(3).fill(0).map((_, index) => (
                            <div key={index} className="rounded-xl border p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-10 w-32" />
                                </div>
                            </div>
                        ))
                    ) : trips.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Rất tiếc tuyến xe này hiện không hoạt động hoặc đã hết vé 😿</p>
                        </div>
                    ) : (
                        displayedTrips.map((trip) => (
                            <BusCard 
                                key={trip.id} 
                                id={trip.id}
                                name={trip.name}
                                time={trip.time}
                                date={trip.date}
                                price={trip.price}
                                slot={trip.slot}
                                location={trip.location}
                                isSelected={trip.id === selectedTripId}
                                onSelect={() => {
                                    onTripSelect(trip.id)
                                    price(trip.price)
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

