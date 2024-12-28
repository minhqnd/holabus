'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface FlightCardProps {
  id: string
  name: string
  departure: string
  arrival: string
  from: string
  to: string
  price: string
  duration?: string
  aircraft?: string
  cabinClass?: string
  handBaggage?: string
  checkInBaggage?: string
}

export function FlightCard({
  id,
  name,
  departure,
  arrival,
  from,
  to,
  price,
  aircraft = "29",
}: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-500 ease-in-out cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
              <Image
                src="/modal-icon.png"
                alt={'hanoi'}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-500">{id}</div>
            </div>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="text-lg font-bold">{departure} · {from}</div>
            <div className="text-sm text-gray-500">Giờ xuất phát</div>
          </div>
          {/* <div className="text-center w-full md:w-auto mt-4 md:mt-0">
            <div className="h-0.5 w-16 bg-gray-300" />
          </div> */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="text-lg font-bold">{aircraft}</div>
            <div className="text-sm text-gray-500">Chỗ ngồi</div>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="text-lg font-bold text-red-600">{price}</div>
            <div className="text-sm text-gray-500">VND</div>
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Button 
              className="rounded-full bg-red-600 text-white hover:bg-red-700 w-full md:w-auto"
            >
              Chọn
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-6 max-h-96 transition-max-height">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="text-gray-600">{`${departure} · ${from}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="text-gray-600">{`${arrival} · ${to}`}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Tên chuyến:</div>
                <div className="font-medium">{name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">ID chuyến:</div>
                <div className="font-medium">{id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Chỗ ngồi:</div>
                <div className="font-medium">{aircraft}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

