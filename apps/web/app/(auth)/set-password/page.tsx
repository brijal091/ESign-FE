'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react'
import { Button, cn, toast } from '@esign/ui'
import { useSetPasswordForNewUser } from '../../../lib/api/auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'

const SetPasswordFormSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: "Passwords don't match.",
  })
type SetPasswordFormValues = z.infer<typeof SetPasswordFormSchema>

interface PasswordRule {
  label: string
  test: (s: string) => boolean
}

const PASSWORD_RULES: readonly PasswordRule[] = [
  { label: 'At least 8 characters', test: (s) => s.length >= 8 },
  { label: 'Contains a number', test: (s) => /\d/.test(s) },
  { label: 'Contains a symbol', test: (s) => /[^A-Za-z0-9]/.test(s) },
] as const

function RuleCheck({ password }: { password: string }) {
  return (
    <ul className="space-y-1.5" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password)
        return (
          <li
            key={rule.label}
            className="flex items-center gap-2 text-[12.5px] leading-snug"
          >
            <span
              aria-hidden
              className={cn(
                'grid h-[18px] w-[18px] place-items-center rounded-full transition-colors duration-200',
                passed
                  ? 'bg-success-soft text-success-strong'
                  : 'bg-surface-sunken text-ink-subtle',
              )}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span
              className={cn(
                'transition-colors duration-200',
                passed ? 'text-ink-muted' : 'text-ink-subtle',
              )}
            >
              {rule.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordForm />
    </Suspense>
  )
}

function SetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const inviter = params.get('inviter') ?? params.get('org') ?? ''
  const setPassword = useSetPasswordForNewUser()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(SetPasswordFormSchema),
    defaultValues: { password: '', confirm: '' },
    mode: 'onChange',
  })

  const password = form.watch('password')

  useEffect(() => {
    if (!token) {
      toast.error('This activation link is invalid')
    }
  }, [token])

  const onSubmit = form.handleSubmit(async ({ password: pw }) => {
    try {
      await setPassword.mutateAsync({ token, password: pw })
      toast.success('Account activated — sign in to continue')
      router.replace('/login')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not set password'))
    }
  })

  if (!token) {
    return (
      <AuthFormShell
        title="Invalid activation link"
        description="This link is missing or malformed. Please request a new invitation."
        footer={
          <Link
            className="inline-flex items-center gap-1.5 font-medium text-brand-strong hover:underline"
            href="/login"
          >
            <ArrowLeft size={14} aria-hidden />
            Back to sign in
          </Link>
        }
      >
        <span />
      </AuthFormShell>
    )
  }

  return (
    <div className="space-y-6">
      {inviter ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft py-1 pl-1.5 pr-3 font-sans text-[12px] font-medium text-brand-strong">
          <span
            aria-hidden
            className="grid h-5 w-5 place-items-center rounded-full bg-brand text-ink-inverse"
          >
            <Sparkles size={11} strokeWidth={2.25} />
          </span>
          Invited by {inviter}
        </div>
      ) : null}

      <AuthFormShell
        title="Welcome to ESign"
        description={
          inviter
            ? `You've been invited by ${inviter}. Set a password to get started.`
            : "Set a password to activate your account."
        }
      >
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            iconLeading={<Lock size={16} aria-hidden />}
            iconTrailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="grid h-6 w-6 place-items-center rounded text-ink-subtle transition-colors hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <FormField
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            iconLeading={<Lock size={16} aria-hidden />}
            {...form.register('confirm')}
            error={form.formState.errors.confirm?.message}
          />

          <div className="rounded-md border border-border bg-surface-sunken/60 px-3.5 py-3">
            <RuleCheck password={password ?? ''} />
          </div>

          <Button
            type="submit"
            className="h-11 w-full text-[15px]"
            disabled={setPassword.isPending}
          >
            {setPassword.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Activate account'
            )}
          </Button>
        </form>
      </AuthFormShell>
    </div>
  )
}
