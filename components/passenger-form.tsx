'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface PassengerFormProps {
  onSubmit: () => void
  onBack: () => void
}

export function PassengerForm({ onSubmit, onBack }: PassengerFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    lastName: '',
    firstName: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="rounded-3xl bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">Thông tin liên hệ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Danh xưng</Label>
            <Select
              value={formData.title}
              onValueChange={(value) => setFormData({ ...formData, title: value })}
            >
              <SelectTrigger className="mt-1 rounded-full">
                <SelectValue placeholder="Ông" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mr">Ông</SelectItem>
                <SelectItem value="mrs">Bà</SelectItem>
                <SelectItem value="ms">Cô</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Họ</Label>
            <Input
              type="text"
              placeholder="Nhập họ"
              className="mt-1 rounded-full"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Tên đệm và tên</Label>
            <Input
              type="text"
              placeholder="Nhập tên đệm và tên"
              className="mt-1 rounded-full"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <Label>Điện thoại</Label>
            <Input
              type="tel"
              placeholder="Nhập điện thoại"
              className="mt-1 rounded-full"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full rounded-full border-2 border-red-600 bg-white text-red-600 hover:bg-red-50"
        >
          {/* <img
            src="/placeholder.svg?height=24&width=24"
            alt="Google"
            className="mr-2 h-6 w-6"
          /> */}
          Xác thực bằng gmail
        </Button>
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            type="submit"
            className="rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Tiếp
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

