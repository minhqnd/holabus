'use client'

import { Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function SearchHeader() {
  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" className="rounded-full">
          Một chiều
        </Button>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>1</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="monthly" />
          <Label htmlFor="monthly">Vé rẻ nhất tháng</Label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label>Điểm đi</Label>
          <Input 
            type="text" 
            placeholder="Sân bay Nội Bài (HAN)" 
            className="mt-1 rounded-full"
          />
        </div>
        <div>
          <Label>Điểm đến</Label>
          <Input 
            type="text" 
            placeholder="Sân bay Tân Sơn Nhất (SGN)" 
            className="mt-1 rounded-full"
          />
        </div>
        <div>
          <Label>Ngày đi</Label>
          <div className="mt-1 flex items-center">
            <Input 
              type="text" 
              placeholder="27/12/2024" 
              className="rounded-full"
            />
            <Calendar className="ml-2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        <Button className="mt-7 rounded-full bg-red-600 text-white hover:bg-red-700">
          Tìm kiếm
        </Button>
      </div>
    </div>
  )
}

