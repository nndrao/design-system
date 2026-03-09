import { type ReactNode, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  items: ReactNode[]
  className?: string
}

export function Carousel({ items, className }: CarouselProps) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex(i => (i - 1 + items.length) % items.length)
  const next = () => setIndex(i => (i + 1) % items.length)

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="min-w-full">{item}</div>
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/40')}
          />
        ))}
      </div>
    </div>
  )
}

export function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('min-w-full', className)}>{children}</div>
}
