import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  return (
    <nav className={cn('flex items-center gap-1', className)}>
      <PaginationButton onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={i} className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <PaginationButton key={i} onClick={() => onPageChange(p as number)} active={p === page}>
            {p}
          </PaginationButton>
        )
      )}
      <PaginationButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  )
}

function PaginationButton({ children, onClick, active, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors',
        active ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-accent text-foreground',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {children}
    </button>
  )
}

export function PaginationContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center gap-1', className)}>{children}</div>
}
export function PaginationItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>
}
export function PaginationLink({ children, href, isActive, className }: { children: React.ReactNode; href?: string; isActive?: boolean; className?: string }) {
  return <a href={href ?? '#'} className={cn('flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors', isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent', className)}>{children}</a>
}
export function PaginationPrevious({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="flex h-9 items-center gap-1 rounded-md px-3 text-sm hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>
}
export function PaginationNext({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="flex h-9 items-center gap-1 rounded-md px-3 text-sm hover:bg-accent disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button>
}
export function PaginationEllipsis() {
  return <span className="flex h-9 w-9 items-center justify-center"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></span>
}
