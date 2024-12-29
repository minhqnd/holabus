'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProgressSteps } from '@/components/progress-steps'
import { PaymentDetails } from '@/components/payment-details'

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0]">
      <Navbar />
      <div className="container py-6">
        <div className="mb-8">
          <ProgressSteps currentStep={3} />
        </div>
        <PaymentDetails />
      </div>
      <Footer />
    </main>
  )
}

