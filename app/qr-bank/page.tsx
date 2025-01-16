'use client'

import { useState, Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PaymentDetails } from '@/components/payment-details'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


function PaymentContent() {
    const [amount, setAmount] = useState<number | null>(null)
    const [bookingId, setBookingId] = useState<string | null>(null)
    const [discount, setDiscount] = useState<number | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (amount && bookingId) {
            setSubmitted(true)
        }
    }

    const calculateDiscountedAmount = () => {
        if (amount && discount) {
            return amount - (amount * discount) / 100
        }
        return amount
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Số tiền
                    </label>
                    <Input
                        type="number"
                        placeholder="Nhập số tiền"
                        className="mt-1"
                        height="3rem"
                        borderRadius="9999px"
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">
                        Mã booking ID
                    </label>
                    <Input
                        type="text"
                        placeholder="Nhập mã booking ID"
                        className="mt-1"
                        height="3rem"
                        borderRadius="9999px"
                        value={bookingId || ''}
                        onChange={(e) => setBookingId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                        Phần trăm giảm giá
                    </label>
                    <Input
                        type="number"
                        placeholder="Nhập phần trăm giảm giá"
                        className="mt-1"
                        height="3rem"
                        borderRadius="9999px"
                        value={discount || ''}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>
                {/* <button
                    type="submit"
                    className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Tạo mã QR
                </button> */}
                <Button
                    type="submit"
                    className="rounded-full bg-red-600 text-white hover:bg-red-700"
                >
                    Tạo mã QR
                </Button>
            </form>
            {submitted && amount && bookingId && (
                <PaymentDetails
                    amount={calculateDiscountedAmount()!}
                    referenceId={`HOLABUS ${bookingId}`}
                    accountName="DO BA TRUNG"
                    accountNumber="0944355789"
                />
            )}
        </div>
    )
}

export default function PaymentPage() {
    return (
        <main className="min-h-screen h-full bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 min-h-screen">
                <Suspense fallback={<div className="text-center">Đang tải...</div>}>
                    <PaymentContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    )
}