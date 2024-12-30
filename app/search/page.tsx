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

    const handleFormSubmit = () => {
        router.push('/payment')
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
