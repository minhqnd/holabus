'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FlightCard } from '@/components/flight-card'
import Image from 'next/image'

const airlines = [
  { id: 'vietjet', name: 'Vietjet Air' },
  { id: 'vietravel', name: 'Vietravel Airlines' },
  { id: 'bamboo', name: 'Bamboo Airways' },
  { id: 'vietnam', name: 'Vietnam Airlines' },
]

const flights = [
  {
    id: 'VJ171',
    airline: 'Vietjet Air',
    departure: '21:35',
    arrival: '23:45',
    from: 'HAN',
    to: 'SGN',
    price: '1,754,200',
  },
  {
    id: 'VU787',
    airline: 'Vietravel Airlines',
    departure: '22:05',
    arrival: '00:20',
    from: 'HAN',
    to: 'SGN',
    price: '1,806,040',
  },
  {
    id: 'VJ159',
    airline: 'Vietjet Air',
    departure: '18:55',
    arrival: '21:05',
    from: 'HAN',
    to: 'SGN',
    price: '1,883,800',
  },
  {
    id: 'VJ161',
    airline: 'Vietjet Air',
    departure: '20:45',
    arrival: '22:55',
    from: 'HAN',
    to: 'SGN',
    price: '1,883,800',
  },
  {
    id: 'VJ181',
    airline: 'Vietjet Air',
    departure: '21:05',
    arrival: '23:15',
    from: 'HAN',
    to: 'SGN',
    price: '1,883,800',
  },
]

export function FlightResults() {
  const [selectedDate] = useState(28)
  const dates = [
    { day: 'Thứ 5', date: 26 },
    { day: 'Thứ 6', date: 27 },
    { day: 'Thứ 7', date: 28 },
    { day: 'Chủ nhật', date: 29 },
    { day: 'Thứ 2', date: 30 },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
      <div className="rounded-3xl bg-white p-6">
        <h3 className="mb-4 font-medium">Hiển thị theo</h3>
        <div className="space-y-4">
          {airlines.map((airline) => (
            <div key={airline.id} className="flex items-center space-x-2">
              <Checkbox id={airline.id} />
              <Label htmlFor={airline.id}>{airline.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Plane icon"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Sân bay Nội Bài (HAN) → Sân bay Tân Sơn Nhất (SGN)
                </h2>
                <p className="text-sm text-gray-500">Thứ 7, 28/12/2024</p>
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2">
            {dates.map((date) => (
              <Button
                key={date.date}
                variant={selectedDate === date.date ? "default" : "outline"}
                className={`flex-1 rounded-xl ${
                  selectedDate === date.date ? 'bg-red-600 text-white hover:bg-red-700' : ''
                }`}
              >
                <div>
                  <div className="text-sm">{date.day}</div>
                  <div className="text-lg font-bold">{date.date}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} {...flight} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Đang xem: 5 của 211
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <Button variant="outline" className="rounded-xl">1</Button>
              <Button variant="outline" className="rounded-xl">2</Button>
              <Button variant="outline" className="rounded-xl">3</Button>
              <span>...</span>
              <Button variant="outline" className="rounded-xl">41</Button>
              <Button variant="outline" className="rounded-xl">42</Button>
              <Button variant="outline" className="rounded-xl">43</Button>
              <Button variant="outline" className="rounded-xl">
                Tiếp
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

