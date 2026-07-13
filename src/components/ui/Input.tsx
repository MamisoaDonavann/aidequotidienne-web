'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type InputProps = {
  label?: string
  error?: string
  icon?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 transition-all duration-200 outline-none',
              'focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
              icon && 'pl-12',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input