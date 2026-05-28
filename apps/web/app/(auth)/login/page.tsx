'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, toast } from '@esign/ui'
import { Loader2 } from 'lucide-react'
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
  const { isAuthenticated } = useAuth()
  const login = useLogin()

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (isAuthenticated) router.replace(next)
  }, [isAuthenticated, next, router])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
      toast.success('Welcome back')
      router.replace(next)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed'))
    }
  })

  return (
    <AuthFormShell
      title="Sign in"
      description="Enter your email and password to access your account."
      footer={
        <div className="flex justify-between">
          <Link className="font-medium text-brand-strong hover:underline" href="/forgot-password">
            Forgot password?
          </Link>
          <span>
            New here?{' '}
            <Link className="font-medium text-brand-strong hover:underline" href="/signup">
              Create account
            </Link>
          </span>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </Button>
      </form>
    </AuthFormShell>
  )
}
