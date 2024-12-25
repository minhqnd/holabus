'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function HeroSearch() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/25" />
      <div className="container relative flex min-h-[600px] flex-col items-center justify-center text-center mx-auto px-4">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Về nhà ăn tết thôi!
          <br />
          Quê bạn ở đâu vậy nhỉ?
        </h1>
        <p className="mb-8 text-lg text-white/90">
          Hơn 20 tuyến xe và các bến đang chờ đợi chở bạn về nhà
        </p>
        <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-lg">
          <div className="grid gap-4 md:grid-cols-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hanoi">Hà Nội</SelectItem>
                <SelectItem value="hochiminh">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="danang">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả mức giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-500">0 - 500.000đ</SelectItem>
                <SelectItem value="500-1000">500.000đ - 1.000.000đ</SelectItem>
                <SelectItem value="1000+">Trên 1.000.000đ</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-red-600 hover:bg-red-700">Tìm kiếm</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

