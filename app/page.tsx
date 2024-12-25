'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSearch } from '@/components/hero-search'
import { RouteCard } from '@/components/route-card'
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { Footer } from '@/components/footer'

const provinces = [
  {
    title: "Hà Nội",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Đại học FPT", "TDBS", "BigC Thăng Long", "Bến xe Mỹ Đình", "Hồ Hoàn Kiếm", "Văn Miếu Quốc Tử Giám", "Lăng Chủ tịch Hồ Chí Minh", "Chùa Trấn Quốc"],
    price: "135.000",
    ticketsLeft: 29
  },
  {
    title: "TP. Hồ Chí Minh",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Bến xe miền Đông", "Đại học Quốc gia", "Landmark 81", "Phố đi bộ Nguyễn Huệ", "Chợ Bến Thành", "Nhà thờ Đức Bà", "Bảo tàng Chứng tích Chiến tranh", "Dinh Độc Lập"],
    price: "245.000",
    ticketsLeft: 15
  },
  {
    title: "Đà Nẵng",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Cầu Rồng", "Bãi biển Mỹ Khê", "Asia Park", "Chợ Hàn", "Bán đảo Sơn Trà", "Ngũ Hành Sơn", "Bảo tàng Chăm", "Sân bay Đà Nẵng"],
    price: "180.000",
    ticketsLeft: 20
  },
  {
    title: "Huế",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Đại Nội", "Chùa Thiên Mụ", "Cầu Trường Tiền", "Chợ Đông Ba", "Lăng Khải Định", "Lăng Tự Đức", "Vườn Quốc gia Bạch Mã", "Sông Hương"],
    price: "160.000",
    ticketsLeft: 25
  },
  {
    title: "Nha Trang",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Vinpearl Land", "Tháp Bà Ponagar", "Chợ Đầm", "Bãi biển Trần Phú", "Hòn Mun", "Viện Hải dương học", "Nhà thờ Chính tòa", "Tháp Trầm Hương"],
    price: "190.000",
    ticketsLeft: 18
  },
  {
    title: "Đà Lạt",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Hồ Xuân Hương", "Chợ Đà Lạt", "Thung lũng Tình yêu", "Ga Đà Lạt", "Dinh Bảo Đại", "Thiền viện Trúc Lâm", "Hồ Tuyền Lâm", "Cánh đồng hoa"],
    price: "175.000",
    ticketsLeft: 22
  },
  {
    title: "Cần Thơ",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Chợ nổi Cái Răng", "Bến Ninh Kiều", "Thiền viện Trúc Lâm", "Đại học Cần Thơ", "Vườn quốc gia Tràm Chim", "Cù Lao Dung", "Làng du lịch Mỹ Khánh", "Cầu Cần Thơ"],
    price: "165.000",
    ticketsLeft: 30
  },
  {
    title: "Hải Phòng",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Đồ Sơn", "Cát Bà", "Chợ Hàng", "Bến xe Lạc Long", "Cầu Bính", "Nhà hát lớn Hải Phòng", "Bảo tàng Hải Phòng", "Vườn quốc gia Cát Bà"],
    price: "145.000",
    ticketsLeft: 24
  },
  {
    title: "Vũng Tàu",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Bãi Trước", "Tượng Chúa", "Bạch Dinh", "Hồ Mây", "Bãi Sau", "Khu du lịch Hồ Cốc", "Mũi Nghinh Phong", "Đảo Long Sơn"],
    price: "155.000",
    ticketsLeft: 27
  },
  {
    title: "Quy Nhơn",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Eo Gió", "Kỳ Co", "Tháp Đôi", "FLC Quy Nhơn", "Bãi Xếp", "Ghềnh Ráng", "Đầm Thị Nại", "Khu du lịch Phương Mai"],
    price: "185.000",
    ticketsLeft: 19
  },
  {
    title: "Hạ Long",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Vịnh Hạ Long", "Bãi Cháy", "Sun World", "Chợ Hạ Long", "Động Thiên Cung", "Động Sửng Sốt", "Hòn Trống Mái", "Cầu Bãi Cháy"],
    price: "150.000",
    ticketsLeft: 21
  },
  {
    title: "Vinh",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Quảng trường Hồ Chí Minh", "Bến xe Vinh", "Đại học Vinh", "Chợ Vinh", "Cửa Lò", "Vườn quốc gia Pù Mát", "Chùa Thiên Ấn", "Sân bay Vinh"],
    price: "170.000",
    ticketsLeft: 23
  },
  {
    title: "Buôn Ma Thuột",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Bảo tàng Thế giới Cà phê", "Thác Dray Nur", "Buôn Akô Dhông", "Nhà thờ Chính tòa", "Chư Yang Sin", "Vườn quốc gia Yok Đôn", "Thác Gia Long", "Sân bay Buôn Ma Thuột"],
    price: "195.000",
    ticketsLeft: 16
  },
  {
    title: "Pleiku",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Biển Hồ", "Chư Đăng Ya", "Công viên Đồng Xanh", "Quảng trường Đại Đoàn Kết", "Thác Phú Cường", "Nhà thờ Pleiku", "Bảo tàng tỉnh Gia Lai", "Sân bay Pleiku"],
    price: "180.000",
    ticketsLeft: 28
  },
  {
    title: "Phan Thiết",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Mũi Né", "Bàu Trắng", "Tháp Chàm", "Đồi cát bay", "Hồ Cát", "Suối Tiên", "Làng chài Mũi Né", "Sân bay Phan Thiết"],
    price: "165.000",
    ticketsLeft: 26
  },
  {
    title: "Long Xuyên",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Núi Sam", "Chợ Long Xuyên", "Đại học An Giang", "Công viên Mỹ Thới", "Chùa Tây An", "Lăng Thoại Ngọc Hầu", "Rừng tràm Trà Sư", "Sân bay Long Xuyên"],
    price: "155.000",
    ticketsLeft: 31
  },
  {
    title: "Rạch Giá",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Bến tàu Phú Quốc", "Chợ Rạch Sỏi", "Dinh Cậu", "Quảng trường Trần Quang Khải", "Núi Sập", "Vườn quốc gia Mũi Cà Mau", "Đảo Hòn Khoai", "Sân bay Rạch Giá"],
    price: "175.000",
    ticketsLeft: 17
  },
  {
    title: "Thái Nguyên",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Đại học Thái Nguyên", "Hồ Núi Cốc", "Bảo tàng Văn hóa", "Chợ Trung tâm", "Đền Sóc Sơn", "Chùa Phật Tích", "Vườn quốc gia Chư Mom Ray", "Sân bay Thái Nguyên"],
    price: "140.000",
    ticketsLeft: 24
  },
  {
    title: "Nam Định",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Nhà thờ Lớn", "Chợ Rồng", "Đền Trần", "Khu du lịch Quất Lâm", "Chùa Keo", "Lăng Trương Định", "Vườn quốc gia Xuân Thủy", "Sân bay Nam Định"],
    price: "145.000",
    ticketsLeft: 29
  },
  {
    title: "Thanh Hóa",
    image: "/placeholder.svg?height=200&width=300",
    locations: ["Sầm Sơn", "Thành Nhà Hồ", "Suối cá Cẩm Lương", "Phố đi bộ Lê Lợi", "Bãi biển Hải Tiến", "Đền Bà Triệu", "Vườn quốc gia Bến En", "Sân bay Thọ Xuân"],
    price: "160.000",
    ticketsLeft: 22
  }
]

export default function Home() {
  const [showAll, setShowAll] = useState(false)
  const displayedProvinces = showAll ? provinces : provinces.slice(0, 12)

  return (
    <main className="min-h-screen bg-[#FFF9F0] flex flex-col items-center w-full">
      <Navbar />
      <div className="relative h-[600px] overflow-hidden w-full">
        <img
          src="/placeholder.svg?height=600&width=1200"
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <HeroSearch />
      </div>
      <div className="container py-12 mx-auto px-4 w-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-red-800">Lộ Trình HolaBus</h2>
          <p className="mt-2 text-gray-600">
            Chúng mình hy vọng rằng sẽ mang đến những trải nghiệm tuyệt vời nhất cho mọi người. 
            Chúc mọi người có hành trình về nhà ăn Tết thật hạnh phúc và bình an
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProvinces.map((province, index) => (
            <RouteCard
              key={index}
              image={province.image}
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
      <Footer />
    </main>
  )
}

