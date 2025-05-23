'use client'

import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const element = document.createElement('div')
      setPortalElement(element)
    }
  }, [])

  useEffect(() => {
    if (portalElement && isOpen) {
      document.body.appendChild(portalElement)
    }
    return () => {
      if (portalElement && document.body.contains(portalElement)) {
        document.body.removeChild(portalElement)
      }
    }
  }, [isOpen, portalElement])

  if (!isOpen || !portalElement) return null

  const handleClose = () => {
    //console.log('Closing popup');
    onClose();
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full mx-4 z-50">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>,
    portalElement
  )
}

export default Popup
