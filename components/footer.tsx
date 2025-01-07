import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bottom-0 bg-red-900 text-gray-100 w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:gap-20 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/white-logo.png" width={0} height={0} sizes="100vw" className="w-full h-auto mb-4" alt="Logo" />
            <ul className="space-y-2">
              <li className="text-base font-bold">HolaBus - đơn vị cung cấp chuyến xe về quê trong dịp Tết Nguyên đán Ất Tỵ 2025</li>
              <li className="text-sm">Một dự án thuộc FPTU Business Club - FBC</li>
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center !mt-6">
                <Image 
                  src="/img/fpt_logo.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-auto"
                  alt="FPT Logo"
                />
                <Image
                  src="/img/fbc_logo.png" 
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-12"
                  alt="FBC Logo"
                />
                <Image
                  src="/modal-icon.png" 
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-auto h-12"
                  alt="HolaBus Logo"
                />
              </div>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Về HolaBus</h3>
            <ul className="space-y-2">
              <li><Link href="/">Trang chủ</Link></li>
              <li><Link href="/search">Tìm xe bus</Link></li>
              <li><Link href="/tra-cuu">Tra cứu vé</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="https://www.facebook.com/HolaBusFPTU.CSKH/">Liên hệ</Link></li>
              <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-base font-bold">Đỗ Bá Trung - Quản lý dự án</li>
              <li className="text-base">SDT: <a href="tel:0944355789" className="hover:underline">0944355789</a></li>
              <li className="text-base">Email: <a href="mailto:Trungdbhs186524@fpt.edu.vn" className="hover:underline">Trungdbhs186524@fpt.edu.vn</a></li>
              <li className="mt-8 text-base font-bold">Vũ Kim Kỳ - Điều phối viên</li>
              <li className="text-base">SDT: <a href="tel:0929343780" className="hover:underline">0929343780</a></li>
              <li className="text-base">Email: <a href="mailto:kyvkhe182094@fpt.edu.vn" className="hover:underline">kyvkhe182094@fpt.edu.vn</a></li>
              <li className="mt-8 text-base font-bold">Nguyễn Đức Quang Minh - Web Developer</li>
              <li className="text-base">SDT: <a href="tel:0366884844" className="hover:underline">0366884844</a></li>
              <li className="text-base">Email: <a href="mailto:moimoi@duck.com" className="hover:underline">moimoi@duck.com</a></li>
            </ul>
          </div>
        </div>

      </div>
      <div className="w-full bg-red-800 text-gray-200">
        <div className="mx-auto py-4 text-center">
          <p>&copy; 2025 HolaBus. Made with ❤️ by <a href="https://fb.com/minhqnd" className="hover:underline">MINHQND</a>.</p>
        </div>
      </div>
    </footer>
  )
}

