import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0]">
      <Navbar />
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-red-800">Liên hệ với chúng tôi</h1>
          <ContactForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}

