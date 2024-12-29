import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0]">
      <Navbar />
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}

