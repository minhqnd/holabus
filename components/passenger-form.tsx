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
// import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
// import { generateUniqueBookingId } from '@/utils/booking'
import ReCAPTCHA from 'react-google-recaptcha'

interface UserData {
  sex: string
  name: string
  mail: string
  phone: string
  destination: string
  transferPoint: string
}

interface PassengerFormProps {
  onSubmit: (userData: UserData) => void
  onBack: () => void
  price: string
}

export function PassengerForm({ onSubmit, onBack, price }: PassengerFormProps) {
  const [formData, setFormData] = useState({
    sex: '1',
    name: '',
    mail: '',
    phone: '',
    confirmEmail: '',
    destination: '',
    transferPoint: 'Tu_di_den_truong',
  })

  const [errors, setErrors] = useState({
    sex: '',
    name: '',
    mail: '',
    phone: '',
    confirmEmail: '',
    destination: '',
    transferPoint: '',
  })

  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState('')
  
  const validateForm = () => {
    let isValid = true
    const newErrors = {
      sex: '',
      name: '',
      mail: '',
      phone: '',
      confirmEmail: '',
      destination: '',
      transferPoint: '',
    }

    if (!formData.sex) {
      newErrors.sex = 'Vui lòng chọn danh xưng'
      isValid = false
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên'
      isValid = false
    }

    if (!formData.mail.trim()) {
      newErrors.mail = 'Vui lòng xác nhận email'
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
      isValid = false
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
      isValid = false
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = 'Vui lòng xác nhận email'
      isValid = false
    } else if (formData.confirmEmail !== formData.mail) {
      newErrors.confirmEmail = 'Email xác nhận không khớp'
      isValid = false
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Vui lòng nhập điểm đến'
      isValid = false
    }

    if (!formData.transferPoint.trim()) {
      newErrors.transferPoint = 'Vui lòng chọn điểm trung chuyển'
      isValid = false
    }

    if (!captchaValue) {
      setCaptchaError('Vui lòng xác nhận captcha')
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
    setCaptchaError('')
  }

  return (
    <div className="rounded-3xl bg-white p-6 mb-16">
      <h2 className="mb-6 text-2xl font-bold">Thông tin liên hệ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Danh xưng</Label>
            <Select
              defaultValue="1"
              value={formData.sex}
              onValueChange={(value) => setFormData({ ...formData, sex: value })}
            >
              <SelectTrigger className="mt-1 rounded-full h-12">
                <SelectValue placeholder="Anh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Anh</SelectItem>
                <SelectItem value="2">Chị</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && <span className="text-sm text-red-500 mt-1">{errors.sex}</span>}
          </div>
          <div>
            <Label>Họ và tên</Label>
            <Input
              type="text"
              placeholder="Nhập đầy đủ họ và tên"
              height='3rem'
              borderRadius='9999px'
              className="mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name}</span>}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Điện thoại</Label>
            <Input
              type="tel"
              placeholder="Nhập số điện thoại"
              className="mt-1"
              value={formData.phone}
              height='3rem'
              borderRadius='9999px'
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({ ...formData, phone: value })
              }}
              maxLength={10}
            />
            {errors.phone && <span className="text-sm text-red-500 mt-1">{errors.phone}</span>}
          </div>
          <div>
            <Label>Điểm đến (vui lòng lòng xem lộ trình bên trên để tránh không đi qua điểm đến)</Label>
            <Input
              type="text"
              placeholder="Nhập điểm đến của bạn"
              height='3rem'
              borderRadius='9999px'
              className="mt-1"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
            {errors.destination && <span className="text-sm text-red-500 mt-1">{errors.destination}</span>}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Nhập email"
              className="mt-1"
              height='3rem'
              borderRadius='9999px'
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
            />
            {errors.mail && <span className="text-sm text-red-500 mt-1">{errors.mail}</span>}
          </div>
          <div>
            <Label>Xác nhận Email</Label>
            <Input
              type="email"
              placeholder="Nhập lại địa chỉ email"
              className="mt-1"
              height='3rem'
              borderRadius='9999px'
              value={formData.confirmEmail}
              onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
            />
            {errors.confirmEmail && (
              <span className="text-sm text-red-500 mt-1">{errors.confirmEmail}</span>
            )}
          </div>
        </div>
        {parseInt(price.replace(/\./g, ''), 10) >= 100000 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label>Điểm trung chuyển</Label>
              <Select
                value={formData.transferPoint}
                onValueChange={(value) => setFormData({ ...formData, transferPoint: value })}
              >
                <SelectTrigger className="mt-1 rounded-full h-12">
                  <SelectValue placeholder="Chọn điểm trung chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tu_di_den_truong">Tự đi đến trường</SelectItem>
{/*                   <SelectItem value="Den_do_tan_xa">Đèn đỏ Hồ Tân Xã</SelectItem> */}
                  <SelectItem value="Cay_xang_39">Cây xăng 39</SelectItem>
{/*                   <SelectItem value="Cay_xa_cu_phenikaa">Cây xăng xà cừ</SelectItem> */}
                  <SelectItem value="Cho_hoa_lac">Chợ Hòa Lạc</SelectItem>
                </SelectContent>
              </Select>
              {errors.transferPoint && <span className="text-sm text-red-500 mt-1">{errors.transferPoint}</span>}
            </div>
          </div>
        )}
        <div>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={handleCaptchaChange}
          />
          {captchaError && (
            <span className="text-sm text-red-500 mt-1">{captchaError}</span>
          )}
        </div>
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
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
