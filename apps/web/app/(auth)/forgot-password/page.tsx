'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, toast } from '@esign/ui'
import { Loader2 } from 'lucide-react'
import { useResetPassword, useSendOtp } from '../../../lib/api/auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'
import { OtpForm } from '../../../components/auth/otp-form'

const EmailFormSchema = z.object({ email: z.string().email('Invalid email') })
type EmailFormValues = z.infer<typeof EmailFormSchema>

const ResetFormSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'Confirm your new password'),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })
type ResetFormValues = z.infer<typeof ResetFormSchema>

type Step = 'email' | 'otp' | 'reset'
const OPERATION = 1 as const

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState('')

  if (step === 'email') {
    return (
      <ForgotEmailStep
        onSent={(value) => {
          setEmail(value)
          setStep('otp')
        }}
      />
    )
  }

  if (step === 'otp') {
    return (
      <AuthFormShell
        title="Verify it's you"
        description="Enter the 6-digit code we emailed."
        footer={
          <button
            type="button"
            className="font-medium text-brand-strong hover:underline"
            onClick={() => setStep('email')}
          >
            ← Use a different email
          </button>
        }
      >
        <OtpForm
          email={email}
          operation={OPERATION}
          onVerified={(token) => {
            setVerificationToken(token)
            setStep('reset')
          }}
        />
      </AuthFormShell>
    )
  }

  return (
    <ResetStep
      verificationToken={verificationToken}
      onDone={() => router.replace('/login')}
    />
  )
}

function ForgotEmailStep({ onSent }: { onSent: (email: string) => void }) {
  const sendOtp = useSendOtp()
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async ({ email }) => {
    try {
      await sendOtp.mutateAsync({ email, operation: OPERATION })
      toast.success('OTP sent to your email')
      onSent(email)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send OTP'))
    }
  })

  return (
    <AuthFormShell
      title="Forgot password"
      description="Enter the email tied to your account and we'll send a code."
      footer={
        <Link className="font-medium text-brand-strong hover:underline" href="/login">
          ← Back to sign in
        </Link>
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
        <Button type="submit" className="w-full" disabled={sendOtp.isPending}>
          {sendOtp.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send code'}
        </Button>
      </form>
    </AuthFormShell>
  )
}

function ResetStep({
  verificationToken,
  onDone,
}: {
  verificationToken: string
  onDone: () => void
}) {
  const reset = useResetPassword()
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: { password: '', confirm: '' },
  })

  const onSubmit = form.handleSubmit(async ({ password }) => {
    try {
      await reset.mutateAsync({ verificationToken, password })
      toast.success('Password updated — sign in with your new password')
      onDone()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not reset password'))
    }
  })

  return (
    <AuthFormShell title="Choose a new password">
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
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          {...form.register('confirm')}
          error={form.formState.errors.confirm?.message}
        />
        <Button type="submit" className="w-full" disabled={reset.isPending}>
          {reset.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset password'}
        </Button>
      </form>
    </AuthFormShell>
  )
}
