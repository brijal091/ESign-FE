'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, toast } from '@esign/ui'
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { LoginRequestSchema, type LoginRequest } from '@esign/types'
import { useLogin } from '../../../lib/api/auth'
import { useAuth } from '../../../lib/auth/use-auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/documents'
  const { isAuthenticated, isHydrated } = useAuth()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (!isHydrated) return
    if (isAuthenticated) router.replace(next)
  }, [isAuthenticated, isHydrated, next, router])

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login.mutateAsync(values)
      toast.success('Welcome back', { description: 'Signed in to ESign.' })
      router.replace(next)
    } catch (err) {
      const message = getErrorMessage(err, 'Invalid email or password.')
      setFormError(message)
      toast.error('Sign in failed', { description: message })
    }
  })

  const onSsoNotice = () =>
    toast.info('Single sign-on coming soon', {
      description: 'We are wiring up Google and Microsoft. Sit tight.',
    })

  return (
    <AuthFormShell
      title="Welcome back"
      description="Sign in to continue to ESign."
      footer={
        <p className="text-center">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-brand hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        {formError ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-danger/30 bg-danger-soft/60 px-3.5 py-2.5 text-[13px] leading-snug text-danger-strong"
          >
            <AlertCircle size={16} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Sign in failed.</span>{' '}
              <span className="text-danger-strong/90">{formError}</span>
            </div>
          </div>
        ) : null}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          iconLeading={<Mail size={16} strokeWidth={1.5} />}
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />

        <FormField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••••••"
          iconLeading={<Lock size={16} strokeWidth={1.5} />}
          iconTrailing={
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="text-ink-subtle transition-colors hover:text-ink-muted"
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.5} />
              ) : (
                <Eye size={16} strokeWidth={1.5} />
              )}
            </button>
          }
          action={
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand hover:underline"
            >
              Forgot password?
            </Link>
          }
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={login.isPending}
        >
          {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
        </Button>

        <div className="my-4 flex items-center gap-3">
          <span className="flex-1 border-t border-border" />
          <span className="text-xs text-ink-subtle">or</span>
          <span className="flex-1 border-t border-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-2.5"
          onClick={onSsoNotice}
        >
          <GoogleG size={18} />
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-2.5"
          onClick={onSsoNotice}
        >
          <MicrosoftMark size={16} />
          Continue with Microsoft
        </Button>
      </form>
    </AuthFormShell>
  )
}

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.2-2.1 13.8-5.4l-6.4-5.4c-2 1.5-4.6 2.4-7.4 2.4-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4c-.4.4 7-5.1 7-15.1 0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}

function MicrosoftMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" aria-hidden className="shrink-0">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}
