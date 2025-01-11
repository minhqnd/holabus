'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BookingLookup } from '@/components/booking-lookup'
import { Suspense } from 'react'

export default function BookingLookupPage() {
    return (
        <main className="min-h-screen bg-[#FFF9F0] flex flex-col items-center w-full bg-[url('/section-background.png')] bg-repeat">
            <Navbar />
            <div className="container md:min-h-[43rem]  py-24">
                <div className="mx-auto max-w-2xl">
                    <h1 className="mb-8 text-center text-4xl font-bold text-red-800">Tra cứu vé</h1>
                    <Suspense fallback={<div>Loading...</div>}>
                        <BookingLookup />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </main>
    )
}

