'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface FlightCardProps {
  id: string
  airline: string
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
  airline,
  departure,
  arrival,
  from,
  to,
  price,
  duration = "130 phút",
  aircraft = "320",
  cabinClass = "Economy",
  handBaggage = "7kg",
  checkInBaggage = "Vui lòng chọn ở bước tiếp theo",
}: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt={airline}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{airline}</div>
              <div className="text-sm text-gray-500">{id}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{departure}</div>
            <div className="text-sm text-gray-500">{from}</div>
          </div>
          <div className="text-center">
            <div className="h-0.5 w-16 bg-gray-300" />
          </div>
          <div>
            <div className="text-lg font-bold">{arrival}</div>
            <div className="text-sm text-gray-500">{to}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">{price}</div>
            <div className="text-sm text-gray-500">VND</div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
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
        <div className="border-t border-gray-100 bg-gray-50 p-6">
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
                <div className="text-sm text-gray-500">Hãng:</div>
                <div className="font-medium">{airline}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Chuyến bay:</div>
                <div className="font-medium">{id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Thời gian chuyến đi:</div>
                <div className="font-medium">{duration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Máy bay:</div>
                <div className="font-medium">{aircraft}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Hạng chỗ:</div>
                <div className="font-medium">{cabinClass}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Hành lý xách tay:</div>
                <div className="font-medium">{handBaggage}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-500">Hành lý ký gửi:</div>
                <div className="font-medium">{checkInBaggage}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

