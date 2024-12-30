'use client'

import { useState, useEffect, useRef } from 'react'
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
    title: 'Anh',
    lastName: '',
    firstName: '',
    phone: '',
  })

  const [errors, setErrors] = useState({
    title: '',
    lastName: '',
    firstName: '',
    phone: '',
  })

  const lastNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    lastNameInputRef.current?.focus()
  }, [])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      title: '',
      lastName: '',
      firstName: '',
      phone: '',
    }

    if (!formData.title) {
      newErrors.title = 'Vui lòng chọn danh xưng'
      isValid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập họ và tên đệm'
      isValid = false
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập tên'
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
      isValid = false
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit()
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 mb-16">
      <h2 className="mb-6 text-2xl font-bold">Thông tin liên hệ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Danh xưng</Label>
            <Select
              defaultValue="mr"
              value={formData.title}
              onValueChange={(value) => setFormData({ ...formData, title: value })}
            >
              <SelectTrigger className="mt-1 rounded-full h-12">
                <SelectValue placeholder="Anh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mr">Anh</SelectItem>
                <SelectItem value="mrs">Chị</SelectItem>
              </SelectContent>
            </Select>
            {errors.title && <span className="text-sm text-red-500 mt-1">{errors.title}</span>}
          </div>
          <div>
            <Label>Tên</Label>
            <Input
              type="text"
              placeholder="Nhập tên"
              className="mt-1"
              height='3rem'
              borderRadius='9999px'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && <span className="text-sm text-red-500 mt-1">{errors.firstName}</span>}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Họ và tên đệm</Label>
            <Input
              ref={lastNameInputRef}
              type="text"
              placeholder="Nhập họ và tên đệm"
              className="mt-1"
              height='3rem'
              borderRadius='9999px'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <span className="text-sm text-red-500 mt-1">{errors.lastName}</span>}
          </div>
          <div>
            <Label>Điện thoại</Label>
            <Input
              type="tel"
              placeholder="Nhập điện thoại"
              className="mt-1"
              height='3rem'
              borderRadius='9999px'
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({ ...formData, phone: value })
              }}
              maxLength={10}
            />
            {errors.phone && <span className="text-sm text-red-500 mt-1">{errors.phone}</span>}
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

