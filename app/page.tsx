'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSearch } from '@/components/hero-search'
import { RouteCard } from '@/components/route-card'
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { Footer } from '@/components/footer'
import Image from 'next/image'

const provinces = [
  {
    title: "Hà Nội",
    locations: ["Đại học FPT", "TBDS", "BigC Thăng Long", "Mỹ Đình"],
    price: "135.000",
    ticketsLeft: 29
  },
  {
    title: "Hải Phòng", 
    locations: ["Đại học FPT", "QL5", "Bến xe Thượng Lý", "Bến xe Lạc Long"],
    price: "145.000",
    ticketsLeft: 24
  },
  {
    title: "Ninh Bình",
    locations: ["Đại học FPT", "TP. Phủ Lý (Hà Nam)", "TP. Ninh Bình", "BX Kim Sơn"],
    price: "160.000",
    ticketsLeft: 25
  },
  {
    title: "Hải Dương",
    locations: ["Đại học FPT", "QL5", "Gia Lộc", "Hải Tân", "Tứ Kỳ"],
    price: "140.000",
    ticketsLeft: 28
  },
  {
    title: "Bắc Ninh",
    locations: ["Đại học FPT", "KCN VISIP Bắc Ninh", "Cầu Đại Phúc (QL1A)", "Cây xăng Hải An (TT Phố Mới)"],
    price: "135.000",
    ticketsLeft: 30
  },
  {
    title: "Bắc Giang",
    locations: ["Đại học FPT", "KCN VISIP Bắc Ninh", "Cầu Đại Phúc (QL1A)", "KCN Đình Trám (BG)", "BigC Bắc Giang"],
    price: "145.000",
    ticketsLeft: 26
  },
  {
    title: "Hưng Yên",
    locations: ["Đại học FPT", "QL5", "Cầu vượt Tân Tiến (Văn Giang)", "Ân Thi", "Chợ Gạo"],
    price: "135.000",
    ticketsLeft: 32
  },
  {
    title: "Nam Định",
    locations: ["Đại học FPT", "BigC Nam Định", "Nam Trực", "Trực Ninh", "Cổ Lễ", "Hải Hậu"],
    price: "145.000",
    ticketsLeft: 29
  },
  {
    title: "Thanh Hóa",
    locations: ["Đại học FPT", "TP. Ninh Bình", "BigC Thanh Hóa", "BX Thanh Hóa (phía Bắc mới)"],
    price: "160.000",
    ticketsLeft: 22
  },
  {
    title: "Quảng Ninh",
    locations: ["Đại học FPT", "Cầu Đại Phúc (QL18)", "Sao Đỏ (Hải Dương)", "Ngã 6 Đông Triều", "Uông Bí", "Tuần Châu", "BX Bãi Cháy"],
    price: "150.000",
    ticketsLeft: 21
  },
  {
    title: "Thái Bình",
    locations: ["Đại học FPT", "TP. Phủ Lý (Hà Nam)", "BX TP. Thái Bình"],
    price: "140.000",
    ticketsLeft: 27
  },
  {
    title: "Hà Nam",
    locations: ["Đại học FPT", "QL1A", "Bến xe Phủ Lý Hà Nam"],
    price: "130.000",
    ticketsLeft: 33
  }
]

export default function Home() {
  const [showAll, setShowAll] = useState(false)
  const displayedProvinces = showAll ? provinces : provinces.slice(0, 8)

  return (
    <main className="min-h-screen bg-[#FFF9F0] flex flex-col items-center w-full bg-[url('/section-background.png')] bg-repeat">
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
        <Image src="/img/maidao.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          alt="maidao" />
        <div className="container pb-12 mx-auto px-4 w-full xl:-mt-[256px]">
          <div className="mb-8 text-center">
            <Image src="/img/lotrinhholabus.png" width={0}
              height={0}
              sizes="100vw"
              style={{ height: 'auto' }}
              alt="Lộ Trình HolaBus" className="h-auto mx-auto w-full md:w-4/5" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProvinces.map((province, index) => (
              <RouteCard
                key={index}
                title={province.title}
                locations={province.locations}
                price={province.price}
                ticketsLeft={province.ticketsLeft}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="group border-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              {showAll ? 'Thu gọn' : 'Xem tất cả các tuyến'}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

