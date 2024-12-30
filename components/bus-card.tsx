'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface FlightCardProps {
  id: string;
  name: string;
  time: string;
  date: string;
  price: string;
  slot: number;
  location: string[];
  isSelected?: boolean;
  onSelect: () => void;
}

export function BusCard({
  id,
  name,
  time,
  date,
  price,
  slot,
  location,
  isSelected,
  onSelect,
}: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      className={`overflow-hidden rounded-3xl border 
        ${isSelected 
          ? `border-red-600 ${isExpanded ? 'bg-white' : 'bg-red-50/50'}`
          : 'border-gray-200 bg-white'
        } 
        transition-all duration-500 ease-in-out cursor-pointer`} 
      onClick={() => setIsExpanded(!isExpanded)}
    >
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
            <div className="text-lg font-bold">{time} · {date}</div>
            <div className="text-sm text-gray-500">Giờ xuất phát</div>
          </div>
          {/* <div className="text-center w-full md:w-auto mt-4 md:mt-0">
            <div className="h-0.5 w-16 bg-gray-300" />
          </div> */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="text-lg font-bold">{slot}</div>
            <div className="text-sm text-gray-500">Chỗ ngồi</div>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="text-lg font-bold text-red-600">{price}</div>
            <div className="text-sm text-gray-500">VND</div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0 justify-center items-center">
            <Button 
                className={`rounded-full ${isSelected ? 'border-[1px] border-red-600 hover:bg-gray-100 bg-white text-red-600' : 'hover:bg-red-700 bg-red-600 text-white'}  w-full md:w-32`}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            >
                {isSelected ? 'Chọn lại' : 'Chọn'}
            </Button>
            <Button
              variant="outline"
              size="default"
              className="rounded-full "
              onClick={() => setIsExpanded(!isExpanded)}
            >
            <div className="text-sm text-gray-500 block md:hidden">Chi tiết</div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-6 max-h-96 transition-max-height">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-0">
              {location.map((place, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <div className="flex h-full flex-col items-center">
                    {index !== 0 ? (
                      <div className="relative z-0 h-3 w-0.5 border-l border-dashed border-gray-300"></div>
                    ) : <div className="relative z-0 h-3 w-0.5"></div>
                    }
                    <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-green-500' : index === location.length - 1 ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                    {index !== location.length - 1 ? (
                      <div className="relative z-0 h-3 w-0.5 border-l border-dashed border-gray-300"></div>
                    ) : <div className="relative z-0 h-3 w-0.5"></div>}
                  </div>
                  <span className="">{place}</span>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
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
                <div className="font-medium">{slot}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

