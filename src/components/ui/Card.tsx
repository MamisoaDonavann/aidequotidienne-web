import { cn } from '@/lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]',
        className
      )}
    >
      {children}
    </div>
  )
}