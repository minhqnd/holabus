import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function PaymentDetails() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl bg-white p-6">
        <h2 className="mb-6 text-center text-2xl font-bold">Thanh toán</h2>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-64 w-64">
            <img
              src="/placeholder.svg?height=256&width=256"
              alt="QR Code"
              className="h-full w-full rounded-xl"
            />
          </div>
          <p className="text-lg font-medium">Quét mã QR để thanh toán</p>
          <p className="text-sm text-gray-500">Sử dụng ứng dụng ngân hàng để quét</p>
        </div>
        <div className="space-y-4 rounded-xl bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-bold text-red-600">1,754,200 VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-medium">HB123456789</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thời gian còn lại:</span>
            <span className="font-medium text-red-600">14:59</span>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6">
        <h3 className="mb-4 font-medium">Hướng dẫn thanh toán</h3>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-gray-600">
          <li>Mở ứng dụng ngân hàng trên điện thoại của bạn</li>
          <li>Chọn tính năng quét mã QR</li>
          <li>Quét mã QR hiển thị trên màn hình</li>
          <li>Kiểm tra thông tin và xác nhận thanh toán</li>
          <li>Chờ xác nhận từ hệ thống</li>
        </ol>
      </div>
      <div className="flex justify-between">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    </div>
  )
}

