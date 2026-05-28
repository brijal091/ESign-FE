'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, toast } from '@esign/ui'
import { Loader2 } from 'lucide-react'
import { useSetPasswordForNewUser } from '../../../lib/api/auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'

const SetPasswordFormSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })
type SetPasswordFormValues = z.infer<typeof SetPasswordFormSchema>

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
  const setPassword = useSetPasswordForNewUser()

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(SetPasswordFormSchema),
    defaultValues: { password: '', confirm: '' },
  })

  useEffect(() => {
    if (!token) {
      toast.error('This activation link is invalid')
    }
  }, [token])

  const onSubmit = form.handleSubmit(async ({ password }) => {
    try {
      await setPassword.mutateAsync({ token, password })
      toast.success('Password set — sign in to continue')
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
          <Link className="font-medium text-brand-strong hover:underline" href="/login">
            ← Back to sign in
          </Link>
        }
      >
        <span />
      </AuthFormShell>
    )
  }

  return (
    <AuthFormShell title="Set your password" description="Activate your invited account.">
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          label="New password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...form.register('confirm')}
          error={form.formState.errors.confirm?.message}
        />
        <Button type="submit" className="w-full" disabled={setPassword.isPending}>
          {setPassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Activate'}
        </Button>
      </form>
    </AuthFormShell>
  )
}
