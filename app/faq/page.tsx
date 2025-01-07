import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FaqAccordion } from '@/components/faq-accordion'

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] flex flex-col items-center w-full bg-[url('/section-background.png')] bg-repeat">
      <Navbar />
      <div className="container py-12">
        <div className="mx-auto px-4 max-w-3xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-red-800">Câu hỏi thường gặp</h1>
          <FaqAccordion />
        </div>
      </div>
      <Footer />
    </main>
  )
}

