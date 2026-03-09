import { type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: ReactNode
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            {i === items.length - 1 ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">{item.label}</span>
            ) : (
              <a href={item.href ?? '#'} className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function BreadcrumbList({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={cn('flex items-center gap-1.5 text-sm', className)}>{children}</ol>
}
export function BreadcrumbItem({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={cn('flex items-center gap-1.5', className)}>{children}</li>
}
export function BreadcrumbLink({ href, children, className }: { href?: string; children: ReactNode; className?: string }) {
  return <a href={href ?? '#'} className={cn('text-muted-foreground hover:text-foreground transition-colors', className)}>{children}</a>
}
export function BreadcrumbPage({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-medium text-foreground', className)}>{children}</span>
}
export function BreadcrumbSeparator({ className }: { className?: string }) {
  return <ChevronRight className={cn('h-3.5 w-3.5 text-muted-foreground', className)} />
}
