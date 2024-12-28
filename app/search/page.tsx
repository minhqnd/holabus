'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SearchHeader } from '@/components/search-header'
import { FlightResults } from '@/components/bus-results'
import { ProgressSteps } from '@/components/progress-steps'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function SearchPage() {
    const [currentStep] = useState(3)
    const [currentPage, setCurrentPage] = useState('FPT - Quảng Ninh')

    return (
        <main className="min-h-screen h-full bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
            <Navbar />
            <Breadcrumbs currentPage={currentPage} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen ">
                <div className="mb-16 mx-auto md:w-4/5">
                    <ProgressSteps currentStep={currentStep} />
                </div>
                <SearchHeader />
                <div className="mb-8">
                    <FlightResults />
                </div>
            </div>
            <Footer />
        </main>
    )
}

