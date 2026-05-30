"use client"
import { useEffect } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({ isOpen, onClose, children, maxWidth }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />
      <div className={`relative glass-card w-full ${maxWidth || 'max-w-md'} rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}>

        <button 
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 rounded-full bg-white text-slate-400 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7 lg:p-9">
          {children}
        </div>
      </div>
    </div>
  ), document.body);
}
