import { type ReactNode, useState, useCallback, createContext, useContext, useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function Toaster({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, duration: 4000, ...opts }])
  }, [])

  const dismiss = (id: string) => setToasts(t => t.filter(x => x.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  const iconMap: Record<ToastType, ReactNode> = {
    default: null,
    success: <CheckCircle className="h-4 w-4 text-buy shrink-0" />,
    error: <XCircle className="h-4 w-4 text-sell shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-warning shrink-0" />,
    info: <Info className="h-4 w-4 text-primary shrink-0" />,
  }

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg',
      'animate-in slide-in-from-right-full',
    )}>
      {iconMap[toast.type ?? 'default']}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>}
      </div>
      <button onClick={onDismiss} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export { ToastContext }
