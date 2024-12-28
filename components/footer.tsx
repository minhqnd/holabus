import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter } from 'lucide-react'

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
              <li><Link href="/help">Trung tâm trợ giúp</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
              <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-red-300">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-red-300">
                <Instagram />
              </Link>
              <Link href="#" className="hover:text-red-300">
                <Twitter />
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className="w-full bg-red-800 text-gray-200">
        <div className="mx-auto py-4 text-center">
          <p>&copy; 2025 HolaBus. Made with ❤️ by moi.</p>
        </div>
      </div>
    </footer>
  )
}

