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
import { saveBookingData } from '@/utils/booking'
import { getTripsById } from '@/lib/api/trips'
import { getRouteByProvince } from '@/lib/api/routes'

interface UserData {
    sex: string
    name: string
    mail: string
    phone: string
    address?: string
}

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedTripId, setSelectedTripId] = useState<string>('')
    const [provinceId, setProvinceId] = useState<string>('')
    const [provinceName, setProvinceName] = useState<string>('')
    
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

    const handleFormSubmit = async (bookingId: string, userData: UserData) => {
        try {
            console.log('1. Bắt đầu quá trình gửi form');
            
            // Lưu user data và lấy userId
            const userId = await saveUserData(userData);
            console.log('2. Đã lưu user data, userId:', userId);
            
            // Lưu booking data
            await saveBookingData(bookingId, selectedTripId, userId, false);
            console.log('3. Đã lưu booking data');
            
            // Lấy thông tin trip
            const tripData = await getTripsById(selectedTripId);
            console.log('4. Trip data:', tripData);
            
            // Lấy thông tin route
            const routeData = await getRouteByProvince(provinceId);
            console.log('5. Route data:', routeData);

            // Chuẩn bị data để gửi email
            const emailData = {
                bookingId: bookingId,
                tripId: selectedTripId,
                price: tripData?.price,
                createdAt: new Date().toISOString(),
                locations: routeData?.locations || [],
                tripInfo: {
                    name: tripData?.name,
                    time: tripData?.time,
                    date: tripData?.date,
                    slot: tripData?.slot
                },
                userInfo: {
                    name: userData.name,
                    email: userData.mail,
                    phone: userData.phone
                }
            };
            console.log('6. Email data chuẩn bị gửi:', emailData);

            // Gửi request đến API email
            const emailResponse = await fetch('https://api.minhqnd.me/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });
            console.log('7. Email response:', await emailResponse.json());

            if (!emailResponse.ok) {
                throw new Error('Lỗi khi gửi email');
            }

            console.log('8. Hoàn tất, chuyển hướng đến trang thanh toán');
            // router.push(`/payment?booking=${bookingId}`);
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error);
            alert('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
        }
    };

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
