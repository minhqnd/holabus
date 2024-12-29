'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SearchHeader } from '@/components/search-header'
import { BusResults } from '@/components/bus-results'
import { ProgressSteps } from '@/components/progress-steps'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PassengerForm } from '@/components/passenger-form'

export default function SearchPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState(2)
    const [currentPage] = useState('FPT - Quảng Ninh')
    const [selectedFlight, setSelectedFlight] = useState<any>(null)
    const [provinceId, setProvinceId] = useState<string>('')
    
    useEffect(() => {
        const tinh = searchParams.get('tinh')
        if (tinh) {
            setProvinceId(tinh)
        }
    }, [searchParams])

    const handleFlightSelect = (flight: any) => {
        setSelectedFlight(flight)
        setCurrentStep(2)
    }

    const handleFormSubmit = () => {
        router.push('/payment')
    }

    return (
        <main className="min-h-screen h-full bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 min-h-screen ">
            <Breadcrumbs currentPage={currentPage} />
                <div className="mb-16 mx-auto md:w-4/5">
                    <ProgressSteps currentStep={currentStep} />
                </div>
                <SearchHeader />
                <div className="mb-8">
                    {currentStep === 1 && (
                        <BusResults provinceId={provinceId} />
                    )}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="rounded-3xl bg-white p-6">
                                <BusResults provinceId={provinceId} />
                            </div>
                            <PassengerForm onSubmit={handleFormSubmit} />
                        </div>
                    )}
                    {currentStep === 3 && (
                        <BusResults provinceId={provinceId} />
                    )}
                </div>
            </div>
            <Footer />
        </main>
    )
}
