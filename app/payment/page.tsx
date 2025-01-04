'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProgressSteps } from '@/components/progress-steps'
import { PaymentDetails } from '@/components/payment-details'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getBookingById } from '@/lib/api/bookings'
import { getTripsById } from '@/lib/api/trips'

const currentPage = 'Thanh toán'

const PaymentContent = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')
  const [amount, setAmount] = useState<number | null>(null)
  const [tripId, setTripId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) {
        console.error('Không tìm thấy bookingId trong URL.')
        setLoading(false)
        return
      }

      try {
        // Lấy thông tin booking
        const bookingData = await getBookingById(bookingId)
        if (!bookingData || !bookingData.tripId) {
          console.error('Không tìm thấy dữ liệu booking hoặc tripId.')
          setLoading(false)
          return
        }

        setTripId(bookingData.tripId)

        // Lấy thông tin trip để lấy giá tiền
        const tripData = await getTripsById(bookingData.tripId)
        if (tripData && tripData.price) {
          setAmount(tripData.price)
        } else {
          console.error('Không tìm thấy giá tiền trong trip data.')
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bookingId])

  return (
    <>
      {loading ? (
        <div className="text-center">Đang tải...</div>
      ) : amount !== null && tripId !== null ? (
        <PaymentDetails
          amount={amount}
          referenceId={`HOLABUS ${bookingId}`}
          accountName="DO BA TRUNG"
          accountNumber="0944355789"
        />
      ) : (
        <div className="text-center text-red-500">
          Không tìm thấy thông tin thanh toán. Vui lòng kiểm tra lại.
        </div>
      )}
    </>
  )
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen h-full bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 min-h-screen">
        <Breadcrumbs currentPage={currentPage} />
        <div className="mb-8 mx-auto md:w-4/5">
          <ProgressSteps currentStep={3} />
        </div>
        <Suspense fallback={<div className="text-center">Đang tải...</div>}>
          <PaymentContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
