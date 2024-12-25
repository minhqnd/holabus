import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-red-800 text-white w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Về HolaBus</h3>
            <ul className="space-y-2">
              <li><Link href="/about">Giới thiệu</Link></li>
              <li><Link href="/careers">Tuyển dụng</Link></li>
              <li><Link href="/press">Báo chí</Link></li>
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
            <h3 className="mb-4 text-lg font-semibold">Chính sách</h3>
            <ul className="space-y-2">
              <li><Link href="/terms">Điều khoản sử dụng</Link></li>
              <li><Link href="/privacy">Chính sách bảo mật</Link></li>
              <li><Link href="/refund">Chính sách hoàn tiền</Link></li>
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
        <div className="mt-8 border-t border-red-700 pt-8 text-center">
          <p>&copy; 2024 HolaBus. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

