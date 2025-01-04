import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface PaymentDetailsProps {
  amount: number;
  referenceId: string;
  accountName: string;
  accountNumber: string;
}

export function PaymentDetails({ 
  amount = 189000,
  referenceId = "RU8BF",
  accountName = "NGUYEN DUC QUANG MINH",
  accountNumber = "MINHQND"
}: PaymentDetailsProps) {
  // Tạo URL QR động
  const qrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-qr_only.png?amount=${amount.toString().replace('.', '')}&addInfo=${referenceId}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl bg-white p-6">
        <h2 className="  text-center text-2xl font-bold">Đặt vé thành công!</h2>
        <h3 className='mb-6 text-center text-gray-700'>Hệ thống sẽ gửi thông tin thanh toán về mail của bạn</h3>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-64 w-64">
            <Image
              src={qrUrl}
              alt="QR Code"
              className="h-full w-full rounded-xl"
              width={256}
              height={256}
            />
          </div>
          <p className="text-lg font-medium">Quét mã QR để thanh toán</p>
          <p className="text-sm text-gray-500">Sử dụng ứng dụng ngân hàng để quét</p>
        </div>
        <div className="space-y-4 rounded-xl bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Tài khoản:</span>
            <span className="font-medium">{accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tên chủ tài khoản:</span>
            <span className="font-medium">{accountName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-bold text-red-600">
              {amount.toLocaleString()} VND
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nội dung:</span>
            <span className="font-bold text-red-600">{referenceId}</span>
          </div>
        </div>
        <div className="mx-12 mt-4 text-center">
          <p className="text-base font-medium">Vui lòng thanh toán sớm để nhận vé, HolaBus sẽ hoàn tiền cho trường hợp hết vé do thanh toán muộn.</p>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6">
        <h3 className="mb-4 font-medium">Hướng dẫn thanh toán</h3>
        <ol className="list-decimal space-y-2 pl-4 text-base text-gray-600">
          <li>Mở ứng dụng ngân hàng trên điện thoại của bạn</li>
          <li>Quét mã QR hiển thị trên màn hình hoặc nhập thủ công</li>
          <li>Kiểm tra thông tin và xác nhận thanh toán <b>chính xác số tiền và nội dung</b></li>
          <li>Bạn sẽ nhận được mail vé điện tử khi hệ thống xác nhận thành công (30p-6h)</li>
          <li> <b>Chỉ sau khi thanh toán bạn mới nhận được vé online</b></li>
        </ol>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="rounded-full h-10"
          onClick={() => window.location.href = '/search'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Đặt vé mới
        </Button>
      </div>
    </div>
  );
}

