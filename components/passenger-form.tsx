import { useState, useEffect } from 'react'
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
import Image from 'next/image'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { app } from '@/firebase'

interface PassengerFormProps {
  onSubmit: () => void
  onBack: () => void
}

export function PassengerForm({ onSubmit, onBack }: PassengerFormProps) {
  const [formData, setFormData] = useState({
    sex: '1',
    name: '',
    mail: '',
    phone: '',
  })

  const [errors, setErrors] = useState({
    sex: '',
    name: '',
    mail: '',
    phone: '',
  })

  const [user, setUser] = useState<any>(null)
  const [shake, setShake] = useState(false)

  // Khôi phục thông tin người dùng từ localStorage khi render lại
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setFormData((prev) => ({ ...prev, mail: parsedUser.email || '' }))
    }
  }, [])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      sex: '',
      name: '',
      mail: '',
      phone: '',
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

    setErrors(newErrors)
    return isValid
  }

  const handleGoogleSignIn = async (auth: any, provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider)
      const loggedInUser = result.user
      setUser(loggedInUser)
      setFormData((prev) => ({ ...prev, mail: loggedInUser.email || '' }))

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('user', JSON.stringify(loggedInUser))
    } catch (error) {
      console.error('Error during Google Sign-In:', error)
    }
  }

  const handleGoogleSignInClick = () => {
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Vui lòng nhập họ và tên' }))
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    if (!formData.phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: 'Vui lòng nhập số điện thoại' }))
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    handleGoogleSignIn(auth, provider)
  }

  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      const auth = getAuth(app)
      await signOut(auth)
      setUser(null)
      setFormData((prev) => ({ ...prev, mail: '' }))

      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Error during Sign-Out:', error)
    }
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
            <Label>Email</Label>
            {!user ? (
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full mt-1 rounded-full border-2 border-red-600 bg-white text-red-600 hover:bg-red-50 h-12 flex items-center justify-center ${shake ? 'animate-shake' : ''}`}
                  onClick={handleGoogleSignInClick}
                >
                  <Image src="/img/gmail.png" alt="gmail" width={20} height={20} />
                  Xác thực bằng Gmail
                </Button>
                {errors.mail && <span className="text-sm text-red-500 mt-1">{errors.mail}</span>}
              </div>


            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Email đã xác thực"
                  className="mt-1"
                  height='3rem'
                  borderRadius='9999px'
                  value={user.email}
                  readOnly
                />
                <Button
                  variant="outline"
                  className="rounded-full text-red-600 border-red-600 hover:bg-red-50 h-12"
                  onClick={(e) => handleSignOut(e)}
                >
                  Đăng xuất
                </Button>
              </div>
            )}
          </div>
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
