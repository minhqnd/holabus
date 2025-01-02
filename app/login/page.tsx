import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className=" bg-[#FFF9F0] min-h-screen justify-center items-center">
      <Navbar />
      <div className="container  m-auto  py-48">
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}

