import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Popup from '@/components/popup'

interface RouteCardProps {
  title: string
  locations: string[]
  price: string
  ticketsLeft?: number
}

export function RouteCard({ title, locations, price, ticketsLeft }: RouteCardProps) {
  const [showAllStops, setShowAllStops] = useState(false)

  const displayedLocations = locations.slice(0, 4)
  const hasMoreLocations = locations.length > 4

  return (
    <>
      <Card className="overflow-hidden rounded-[32px] border-red-100 bg-white p-4 transition-transform hover:scale-[1.02] flex flex-col">
        <div className="relative mb-4 h-40 w-full overflow-hidden rounded-[24px]">
          <Image
            src={`/img/tinh/${title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '')}.png`}
            alt={title}
            fill
            className="object-cover"
          />
          {/* {ticketsLeft && (
            <div className="absolute left-4 top-4 rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">
              <span className="flex items-center gap-2 text-sm">
                <span className="text-yellow-500">★</span>
              Còn {ticketsLeft} vé
              </span>
            </div>
          )} */}
        </div>
        <h3 className="text-2xl font-bold text-red-800 md:text-3xl">{title}</h3>
        <ul className="mb-auto space-y-0 min-h-[120px]">
          {displayedLocations.map((location, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-600">
              <div className="flex h-full flex-col items-center">
                {index !== 0 ? (
                  <div className="relative z-0 h-4 w-0.5 border-l border-dashed border-gray-300"></div>
                ) : <div className="relative z-0 h-4 w-0.5"></div>
                }
                <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-green-500' : index === displayedLocations.length - 1 ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                {index !== displayedLocations.length - 1 ? (
                  <div className="relative z-0 h-4 w-0.5 border-l border-dashed border-gray-300"></div>
                ) : <div className="relative z-0 h-4 w-0.5 "></div>}
              </div>
              <span className="text-base">
                {index === 2 && hasMoreLocations ? (
                  <button
                    className="inline-flex text-red-700 hover:text-red-800"
                    onClick={() => setShowAllStops(true)}
                  >
                    Xem thêm
                  </button>
                ) : (index === displayedLocations.length - 1 ? locations[locations.length - 1] : location) }
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-bold text-red-700 md:text-2xl">{price} VND</div>
          <Button className="rounded-full bg-red-600 px-6 py-2 text-base font-medium text-white hover:bg-red-700">
            Đặt ngay
          </Button>
        </div>
      </Card>
      <Popup
        isOpen={showAllStops}
        onClose={() => setShowAllStops(false)}
      >
        <h2 className="mb-4 text-2xl font-bold">{`Tất cả điểm dừng - ${title}`}</h2>
        <ul className="space-y-0">
          {locations.map((location, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-600">
              <div className="flex h-full flex-col items-center">
                {index !== 0 ? (
                  <div className="relative z-0 h-6 w-0.5 border-l border-dashed border-gray-300"></div>
                ) : <div className="relative z-0 h-6 w-0.5"></div>
                }
                <div className={`h-3 w-3 rounded-full ${index === 0 ? 'bg-green-500' : index === locations.length - 1 ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                {index !== locations.length - 1 ? (
                  <div className="relative z-0 h-6 w-0.5 border-l border-dashed border-gray-300"></div>
                ) : <div className="relative z-0 h-6 w-0.5"></div>}
              </div>
              <span className="text-lg">{location}</span>
            </li>
          ))}
        </ul>
      </Popup>
    </>
  )
}

