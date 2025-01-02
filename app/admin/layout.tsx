import { Sidebar } from '@/components/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-[#FFF9F0] bg-[url('/section-background.png')] bg-repeat">
        <main className="container mx-auto p-4 md:p-8 min-h-full">
          {children}
        </main>
      </div>
    </div>
  )
}

