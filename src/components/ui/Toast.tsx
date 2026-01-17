import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { classNames } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  if (!isVisible) return null;
  
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };
  
  
  const Icon = icons[type];
  
  const bgColors = {
    success: '#16a34a',
    error: '#dc2626', 
    info: '#2563eb',
  };
  
  return (
    <div
      className="fixed top-24 left-4 right-4 z-[100]"
      role="alert"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-xl max-w-md mx-auto"
        style={{ 
          backgroundColor: bgColors[type],
          color: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <Icon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
        <p className="flex-1 text-base font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-smooth focus:outline-none"
          aria-label="Close notification"
          style={{ color: 'white' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

