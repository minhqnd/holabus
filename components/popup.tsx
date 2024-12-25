import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Popup({ isOpen, onClose, title, children }: PopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-full w-full overflow-auto bg-white p-6 md:h-auto md:max-h-[90vh] md:w-[90vw] md:max-w-4xl md:rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}

