"use client"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />
      <div className={`relative glass-card w-full ${maxWidth || 'max-w-md'} rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}>

        <button 
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 rounded-full bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-7 pb-7 pt-12 lg:px-9 lg:pb-9 lg:pt-14">
          {children}
        </div>
      </div>
    </div>
  ), document.body);
}
