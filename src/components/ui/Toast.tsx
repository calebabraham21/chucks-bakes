import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { ToastType } from '../../lib/state';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const EXIT_ANIMATION_MS = 240;

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const bgColors = {
  success: '#16a34a',
  error: '#dc2626',
  info: '#2563eb',
};

export function Toast({ message, type = 'success', isVisible, onClose, duration = 4000 }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);
  const [prevVisible, setPrevVisible] = useState(isVisible);

  // Sync mount/exit state with the prop during render rather than in an effect
  if (isVisible !== prevVisible) {
    setPrevVisible(isVisible);
    if (isVisible) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
    }
  }

  useEffect(() => {
    if (!isExiting) return;
    const timer = setTimeout(() => {
      setShouldRender(false);
      setIsExiting(false);
    }, EXIT_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isExiting]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-24 left-4 right-4 z-[100] pointer-events-none ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <div
        className="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl max-w-md mx-auto"
        style={{
          backgroundColor: bgColors[type],
          color: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <Icon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
        <p className="flex-1 text-base font-semibold">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close notification"
          style={{ color: 'white' }}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
