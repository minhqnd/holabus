'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProgressSteps } from '@/components/progress-steps'
import { BusResults } from '@/components/bus-results'
import { SearchHeader } from '@/components/search-header'
import { PassengerForm } from '@/components/passenger-form'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PROVINCES } from '@/lib/constants/provinces'
import { saveUserData } from '@/utils/user'
import { generateUniqueBookingId, saveBookingData } from '@/utils/booking'
import { getTripsById } from '@/lib/api/trips'
import { getRouteByProvince } from '@/lib/api/routes'
import { Confirm } from '@/components/confirm'

interface UserData {
    sex: string
    name: string
    mail: string
    phone: string
    address?: string
}

interface TripData {
    name: string;
    time: string;
    date: string;
    price: string;
    location: string[];
}

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedTripId, setSelectedTripId] = useState<string>('')
    const [provinceId, setProvinceId] = useState<string>('')
    const [provinceName, setProvinceName] = useState<string>('')
    const [userData, setUserData] = useState<UserData | null>(null)
    const [tripData, setTripData] = useState<TripData | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    
    useEffect(() => {
        const tinh = searchParams.get('tinh')
        if (tinh) {
            setProvinceId(tinh)
            const province = PROVINCES.find(p => p.id === tinh.toUpperCase())
            setProvinceName(province?.name || '')
        }
    }, [searchParams])

    const handleTripSelect = (tripId: string) => {
        if (tripId === selectedTripId && currentStep === 2) {
            setCurrentStep(1)
            setSelectedTripId('')
        } else {
            setSelectedTripId(tripId)
            setCurrentStep(2)
        }
    }

    const handleBackButton = () => {
        setCurrentStep(1)
        setSelectedTripId('')
    }

    const handleFormSubmit = async (userData: UserData) => {
        setUserData(userData)
        
        try {
            // Lấy thông tin trip
            const tripData = await getTripsById(selectedTripId)
            // Lấy thông tin route
            const routeData = await getRouteByProvince(provinceId)
            
            setTripData({
                name: tripData?.name,
                time: tripData?.time,
                date: tripData?.date,
                price: tripData?.price,
                location: routeData?.locations || []
            })
            
            setCurrentStep(3)
        } catch (error) {
            console.error('Lỗi khi lấy thông tin:', error)
            alert('Có lỗi xảy ra. Vui lòng thử lại.')
        }
    }

    const handleConfirm = async () => {
        if (!userData || isProcessing) return
        
        setIsProcessing(true)
        try {
            const bookingId = await generateUniqueBookingId()
            const userId = await saveUserData(userData)
            
            // Chuẩn bị và gửi email với timeout
            const emailData = {
                bookingId,
                tripId: selectedTripId,
                price: tripData?.price,
                createdAt: new Date().toISOString(),
                locations: tripData?.location || [],
                tripInfo: tripData,
                userInfo: userData
            }

            let note = '';

            try {
                const emailResponse = await fetch('https://api.holabus.com.vn/api/send-payment-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData)
                });

                if (!emailResponse.ok) {
                    throw new Error('Lỗi khi gửi email');
                }
            } catch (error) {
                note = 'Không gửi được mail, vui lòng kiểm tra lại! ' + error;
            }

            // Lưu booking với trạng thái gửi email
            await saveBookingData(bookingId, selectedTripId, userId, false, note)

            // Chuyển hướng sau khi gửi email
            router.push(`/payment?booking=${bookingId}`)
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error)
            alert('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 min-h-screen">
            <Breadcrumbs currentPage={provinceName} />
            <div className="mb-16 mx-auto md:w-4/5">
                <ProgressSteps currentStep={currentStep} />
            </div>
            
            <div className={`relative mb-4 transition-[max-height] duration-500 ease-in-out ${
                currentStep === 1 ? 'max-h-[500px] overflow-visible' : 'max-h-0 overflow-hidden' 
            }`}>
                <SearchHeader provinceName={provinceName} />
            </div>
            
            {provinceId && (
                <BusResults 
                    provinceId={provinceId} 
                    provinceName={provinceName}
                    selectedTripId={selectedTripId}
                    onTripSelect={handleTripSelect}
                    currentStep={currentStep}
                />
            )}
            
            <div className={`relative transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                currentStep === 2 ? 'max-h-[1000px]' : 'max-h-0'
            }`}>
                <PassengerForm 
                    onSubmit={handleFormSubmit} 
                    onBack={handleBackButton}
                />
            </div>

            <div className={`relative transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                currentStep === 3 ? 'max-h-[1000px]' : 'max-h-0'
            }`}>
                {userData && tripData && (
                    <Confirm
                        tripData={tripData}
                        userData={userData}
                        onBack={() => setCurrentStep(2)}
                        onConfirm={handleConfirm}
                    />
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <main className="min-h-screen h-full bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
            <Navbar />
            <Suspense fallback={<div>Đang tải...</div>}>
                <SearchContent />
            </Suspense>
            <Footer />
        </main>
    )
}
