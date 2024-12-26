import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full mx-4 z-50">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;

