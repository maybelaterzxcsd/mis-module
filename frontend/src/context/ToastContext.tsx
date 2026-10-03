import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || 3000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={24} color="#10b981" />;
      case 'error': return <XCircle size={24} color="#ef4444" />;
      case 'warning': return <AlertCircle size={24} color="#f59e0b" />;
      case 'info': return <Info size={24} color="#3b82f6" />;
    }
  };

  const getBackground = (type: ToastType) => {
    switch (type) {
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'error': return 'rgba(239, 68, 68, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
    }
  };

  const getBorder = (type: ToastType) => {
    switch (type) {
      case 'success': return 'rgba(16, 185, 129, 0.3)';
      case 'error': return 'rgba(239, 68, 68, 0.3)';
      case 'warning': return 'rgba(245, 158, 11, 0.3)';
      case 'info': return 'rgba(59, 130, 246, 0.3)';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      <div style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: 'white',
              border: `1px solid ${getBorder(toast.type)}`,
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              animation: 'slideInRight 0.3s ease-out',
              minWidth: '300px'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: getBackground(toast.type),
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {getIcon(toast.type)}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '0.95rem',
                margin: '0 0 0.25rem 0'
              }}>
                {toast.title}
              </p>
              {toast.message && (
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {toast.message}
                </p>
              )}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                color: 'var(--text-muted)',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              }}
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};