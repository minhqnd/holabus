'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSearch } from '@/components/hero-search'
import { RouteCard } from '@/components/route-card'
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { SakuraEffect } from '@/components/SakuraEffect'

interface Province {
  available: boolean
  id: string
  name: string 
  locations: string[]
  price: string
}

export default function Home() {
  const [showAll, setShowAll] = useState(false)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://holabus-fpt-default-rtdb.asia-southeast1.firebasedatabase.app/routes.json')
        const data = await response.json()
        console.log('Fetched data:', data)
        const transformedData = Object.entries(data).map(([id, route]: [string, unknown]) => {
          const typedRoute = route as {
            name: string
            locations: string[]
            price: string
            available: boolean
          }
          return {
            id,
            name: typedRoute.name,
            locations: typedRoute.locations,
            price: typedRoute.price,
            available: typedRoute.available
          }
        }).sort((a, b) => Number(b.available) - Number(a.available))

        console.log('Transformed data:', transformedData)
        setProvinces(transformedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching provinces:', error)
        setLoading(false)
      }
    }

    fetchProvinces()
  }, [])

  return (
    <main className="min-h-screen bg-[#FFF9F0] flex flex-col items-center w-full bg-[url('/section-background.png')] bg-repeat">
      <SakuraEffect />
      <Navbar />
      {/* Phần hero và search */}
      <div className="w-full relative z-10">
        <div className="relative mx-auto w-full md:px-8 max-w-[90rem] hidden md:block">
          <div className="container mx-auto my-5 h-[55vh] md:rounded-3xl overflow-hidden relative pb-96">
            <Image
              src="/img/fpt.avif"
              alt="Hero Background"
              layout="fill"
              objectFit="cover"
              className="shadow-lg"
            />
          </div>
          <HeroSearch />
        </div>

        <div className="relative h-lvh overflow-hidden w-full block shadow-2xl md:hidden">
          <Image
            src="/img/fpt.png"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
          />
          <HeroSearch />
        </div>
      </div>

      <div className="w-full relative z-0">
        <Image 
          src="/img/maidao.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          alt="maidao" 
        />
        <div className="container pb-12 mx-auto px-4 w-full xl:-mt-[256px]">
          <div className="mb-8 text-center">
            <Image 
              src="/img/lotrinhholabus.png" 
              width={0}
              height={0}
              sizes="100vw"
              style={{ height: 'auto' }}
              alt="Lộ Trình HolaBus" 
              className="h-auto mx-auto w-full md:w-4/5" 
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {provinces.map((province, index) => (
                <div 
                  key={province.id} 
                  className={`
                    grid transition-all duration-300 ease-in-out
                    ${index >= 8 && !showAll ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
                  `}
                >
                  <div className="overflow-hidden">
                    <RouteCard
                      title={province.name}
                      locations={province.locations}
                      price={province.price}
                      id={province.id}
                      available={province.available}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && provinces.length > 8 && (
            <div className={`text-center ${!showAll ? '-mt-20 sm:-mt-0' : 'mt-8'}`}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(!showAll)}
                className="group border-2 rounded-full border-red-600 text-red-600 hover:bg-red-50"
              >
                {showAll ? 'Thu gọn' : 'Xem tất cả các tuyến'}
                <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}