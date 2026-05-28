'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, toast } from '@esign/ui'
import { Loader2 } from 'lucide-react'
import {
  RegisterOrganizationRequestSchema,
  type RegisterOrganizationRequest,
} from '@esign/types'
import { useRegisterOrganization, useSendOtp } from '../../../lib/api/auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'
import { OtpForm } from '../../../components/auth/otp-form'

const EmailFormSchema = z.object({ email: z.string().email('Invalid email') })
type EmailFormValues = z.infer<typeof EmailFormSchema>

type Step = 'email' | 'otp' | 'details'

const OPERATION = 2 as const

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState('')

  if (step === 'email') {
    return (
      <SignupEmailStep
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
        title="Verify email"
        description="Enter the 6-digit code we just emailed you."
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
            setStep('details')
          }}
        />
      </AuthFormShell>
    )
  }

  return (
    <SignupDetailsStep
      email={email}
      verificationToken={verificationToken}
      onDone={() => router.replace('/login')}
    />
  )
}

function SignupEmailStep({ onSent }: { onSent: (email: string) => void }) {
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
      title="Create account"
      description="Start with your work email — we'll send a verification code."
      footer={
        <span>
          Already have an account?{' '}
          <Link className="font-medium text-brand-strong hover:underline" href="/login">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          label="Work email"
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

function SignupDetailsStep({
  email,
  verificationToken,
  onDone,
}: {
  email: string
  verificationToken: string
  onDone: () => void
}) {
  const register = useRegisterOrganization()
  const form = useForm<RegisterOrganizationRequest>({
    resolver: zodResolver(RegisterOrganizationRequestSchema),
    defaultValues: {
      verificationToken,
      orgName: '',
      userFirstName: '',
      userMiddleName: '',
      userLastName: '',
      userMobileNumber: '',
      userEmail: email,
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await register.mutateAsync(values)
      toast.success('Account created — sign in to continue')
      onDone()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'))
    }
  })

  return (
    <AuthFormShell
      title="Tell us about your team"
      description="One more step — we'll create your workspace."
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          label="Organization name"
          {...form.register('orgName')}
          error={form.formState.errors.orgName?.message}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="First name"
            autoComplete="given-name"
            {...form.register('userFirstName')}
            error={form.formState.errors.userFirstName?.message}
          />
          <FormField
            label="Last name"
            autoComplete="family-name"
            {...form.register('userLastName')}
            error={form.formState.errors.userLastName?.message}
          />
        </div>
        <FormField
          label="Mobile number"
          inputMode="numeric"
          hint="10–15 digits"
          {...form.register('userMobileNumber')}
          error={form.formState.errors.userMobileNumber?.message}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
        </Button>
      </form>
    </AuthFormShell>
  )
}
