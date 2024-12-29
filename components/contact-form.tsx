'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="grid gap-6">
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" className="mt-2 rounded-full" placeholder="Nhập họ và tên của bạn" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-2 rounded-full" placeholder="Nhập địa chỉ email" />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" type="tel" className="mt-2 rounded-full" placeholder="Nhập số điện thoại" />
          </div>
          <div>
            <Label htmlFor="subject">Chủ đề</Label>
            <Input id="subject" className="mt-2 rounded-full" placeholder="Nhập chủ đề" />
          </div>
          <div>
            <Label htmlFor="message">Nội dung</Label>
            <Textarea
              id="message"
              className="mt-2 min-h-[150px] rounded-3xl"
              placeholder="Nhập nội dung tin nhắn"
            />
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full rounded-full bg-red-600 hover:bg-red-700">
          Gửi tin nhắn
        </Button>
      </div>
    </form>
  )
}

