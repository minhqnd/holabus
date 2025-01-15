'use client'

// import { Navbar } from '@/components/navbar'
// import { Footer } from '@/components/footer'
import dynamic from 'next/dynamic'
// import { spinnerwheel } from '@/components/spinnerwheel'
const LuckyWheel = dynamic(() => import('@/components/spinnerwheel'), { ssr: false })
import { Suspense } from 'react'

export default function BookingLookupPage() {
    return (
        <main className=" bg-[#FFF9F0] flex flex-col mx-auto items-center w-full bg-[url('/section-background.png')] bg-repeat">
            {/* <Navbar /> */}
            <div className="container">
                <div className="mx-auto">
                    <Suspense fallback={<div>Loading...</div>}>
                        <LuckyWheel />
                    </Suspense>
                </div>
            </div>
            {/* <Footer /> */}
        </main>
    )
}

