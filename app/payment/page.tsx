'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProgressSteps } from '@/components/progress-steps'
import { PaymentDetails } from '@/components/payment-details'
import { Breadcrumbs } from '@/components/breadcrumbs'

const currentPage = 'Thanh toán'
export default function PaymentPage() {
  return (
    <main className="min-h-screen h-full bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 min-h-screen ">
        <Breadcrumbs currentPage={currentPage} />

        <div className="mb-8 mx-auto md:w-4/5">
          <ProgressSteps currentStep={3} />
        </div>
        <PaymentDetails
          amount={189000}
          referenceId="MOIMOI"
          accountName="NGUYEN DUC QUANG MINH"
          accountNumber="MINHQND"
        />
      </div>
      <Footer />
    </main>
  )
}

