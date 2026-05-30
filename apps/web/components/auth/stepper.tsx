'use client'

import { Check } from 'lucide-react'
import { cn } from '@esign/ui'

interface StepperProps {
  steps: readonly string[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol
      aria-label="Signup progress"
      className="flex w-full items-center"
      role="list"
    >
      {steps.map((label, i) => {
        const isDone = i < current
        const isActive = i === current
        const isLast = i === steps.length - 1
        const stepState: 'done' | 'active' | 'future' = isDone
          ? 'done'
          : isActive
            ? 'active'
            : 'future'

        return (
          <li
            key={label}
            className={cn('flex items-center', !isLast && 'flex-1')}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="flex shrink-0 items-center gap-[9px]">
              <span
                aria-hidden
                className={cn(
                  'grid h-6 w-6 place-items-center rounded-full font-sans text-[12px] font-semibold transition-all duration-200 ease-out',
                  stepState === 'active' &&
                    'bg-brand text-ink-inverse shadow-[0_1px_2px_oklch(0.4_0.1_38_/_0.25)]',
                  stepState === 'done' &&
                    'bg-success-soft text-success-strong',
                  stepState === 'future' &&
                    'border border-border bg-surface-sunken text-ink-subtle',
                )}
              >
                {isDone ? (
                  <Check size={13} strokeWidth={2.5} aria-hidden />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap font-sans text-[13px] transition-colors duration-200',
                  stepState === 'active' && 'font-semibold text-ink',
                  stepState === 'done' && 'font-medium text-ink-muted',
                  stepState === 'future' && 'font-medium text-ink-subtle',
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'mx-[14px] h-px flex-1 transition-colors duration-300',
                  isDone ? 'bg-success' : 'bg-border',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
