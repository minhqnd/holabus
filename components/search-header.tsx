'use client'

import { Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function SearchHeader() {
  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button variant="ghost" className="rounded-full hover:bg-gray-100">
          Một chiều
        </Button>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span>1</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="monthly" />
          <Label htmlFor="monthly" className="text-gray-600">Vé rẻ nhất tháng</Label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label className="font-medium">Điểm đi</Label>
          <Input
            type="text"
            placeholder="Sân bay Nội Bài (HAN)"
            className="rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-medium">Điểm đến</Label>
          <Input
            type="text"
            placeholder="Sân bay Tân Sơn Nhất (SGN)"
            className="rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-medium">Ngày đi</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="27/12/2024"
              className="rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <Button className="mt-8 h-11 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
          Tìm kiếm
        </Button>
      </div>
    </div>
  )
}

