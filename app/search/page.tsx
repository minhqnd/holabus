'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SearchHeader } from '@/components/search-header'
import { FlightResults } from '@/components/bus-results'
import { ProgressSteps } from '@/components/progress-steps'

export default function SearchPage() {
    const [currentStep] = useState(1)

    return (
        <main className="min-h-screen bg-[#FFF9F0]">
            <Navbar />
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <SearchHeader />
                <div className="mb-8 mx-auto">
                    <ProgressSteps currentStep={currentStep} />
                </div>
                <FlightResults />
            </div>
            <Footer />
        </main>
    )
}

