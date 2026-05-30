'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react'
import { Button, Label, cn, toast } from '@esign/ui'
import { useConfirmOtp, useResetPassword, useSendOtp } from '../../../lib/api/auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'
import { Stepper } from '../../../components/auth/stepper'

const STEPS = ['Email', 'Verify', 'New password'] as const
const OPERATION = 1 as const
const RESEND_COOLDOWN_SECONDS = 30

type StepIndex = 0 | 1 | 2

const EmailSchema = z.object({ email: z.string().email('Invalid email') })
type EmailValues = z.infer<typeof EmailSchema>

const ResetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: "Passwords don't match.",
  })
type ResetValues = z.infer<typeof ResetSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<StepIndex>(0)
  const [email, setEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState('')

  return (
    <div className="space-y-9">
      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <EmailStep
          initialEmail={email}
          onSent={(value) => {
            setEmail(value)
            setStep(1)
          }}
        />
      )}

      {step === 1 && (
        <OtpStep
          email={email}
          onBack={() => setStep(0)}
          onVerified={(token) => {
            setVerificationToken(token)
            setStep(2)
          }}
        />
      )}

      {step === 2 && (
        <ResetStep
          verificationToken={verificationToken}
          onDone={() => router.replace('/login')}
        />
      )}
    </div>
  )
}

// ============ STEP 1 — EMAIL ============

function EmailStep({
  initialEmail,
  onSent,
}: {
  initialEmail: string
  onSent: (email: string) => void
}) {
  const sendOtp = useSendOtp()
  const form = useForm<EmailValues>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: initialEmail },
  })

  const onSubmit = form.handleSubmit(async ({ email }) => {
    try {
      await sendOtp.mutateAsync({ email, operation: OPERATION })
      toast.success('Reset code sent to your email')
      onSent(email)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send code'))
    }
  })

  return (
    <AuthFormShell
      title="Reset your password"
      description="Enter your email and we'll send a reset code."
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
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          iconLeading={<Mail size={16} aria-hidden />}
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
        <Button
          type="submit"
          className="h-11 w-full text-[15px]"
          disabled={sendOtp.isPending}
        >
          {sendOtp.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Send reset code
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </>
          )}
        </Button>
      </form>
    </AuthFormShell>
  )
}

// ============ STEP 2 — OTP ============

function OtpStep({
  email,
  onBack,
  onVerified,
}: {
  email: string
  onBack: () => void
  onVerified: (verificationToken: string) => void
}) {
  const confirmOtp = useConfirmOtp()
  const sendOtp = useSendOtp()
  const [digits, setDigits] = useState<string[]>(() => Array(6).fill(''))
  const [hasError, setHasError] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [cooldown])

  const otp = digits.join('')
  const isComplete = otp.length === 6 && digits.every((d) => /^[0-9]$/.test(d))

  const handleChange = useCallback(
    (idx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      if (!raw) {
        setDigits((prev) => {
          const next = [...prev]
          next[idx] = ''
          return next
        })
        setHasError(false)
        return
      }
      setDigits((prev) => {
        const next = [...prev]
        for (let i = 0; i < raw.length && idx + i < 6; i++) {
          next[idx + i] = raw[i] ?? ''
        }
        return next
      })
      setHasError(false)
      const nextIdx = Math.min(idx + raw.length, 5)
      inputsRef.current[nextIdx]?.focus()
      inputsRef.current[nextIdx]?.select()
    },
    [],
  )

  const handleKeyDown = useCallback(
    (idx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (digits[idx]) {
          setDigits((prev) => {
            const next = [...prev]
            next[idx] = ''
            return next
          })
          setHasError(false)
          e.preventDefault()
          return
        }
        if (idx > 0) {
          e.preventDefault()
          inputsRef.current[idx - 1]?.focus()
          setDigits((prev) => {
            const next = [...prev]
            next[idx - 1] = ''
            return next
          })
          setHasError(false)
        }
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        inputsRef.current[idx - 1]?.focus()
      } else if (e.key === 'ArrowRight' && idx < 5) {
        e.preventDefault()
        inputsRef.current[idx + 1]?.focus()
      }
    },
    [digits],
  )

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = Array(6).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setDigits(next)
    setHasError(false)
    const focusIdx = Math.min(text.length, 5)
    inputsRef.current[focusIdx]?.focus()
  }, [])

  const verify = useCallback(async () => {
    if (!isComplete) return
    try {
      const result = await confirmOtp.mutateAsync({
        email,
        otp,
        operation: OPERATION,
      })
      if (!result.verificationToken) {
        toast.error('Verification token missing from response')
        setHasError(true)
        return
      }
      onVerified(result.verificationToken)
    } catch (err) {
      setHasError(true)
      const message = getErrorMessage(err, '').toLowerCase()
      if (message.includes('expire')) {
        toast.error('Code expired — request a new one')
      } else {
        toast.error("That code didn't match")
      }
    }
  }, [confirmOtp, email, isComplete, onVerified, otp])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void verify()
  }

  const onResend = async () => {
    if (cooldown > 0) return
    try {
      await sendOtp.mutateAsync({ email, operation: OPERATION })
      toast.success('New code sent')
      setCooldown(RESEND_COOLDOWN_SECONDS)
      setDigits(Array(6).fill(''))
      setHasError(false)
      inputsRef.current[0]?.focus()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not resend code'))
    }
  }

  return (
    <AuthFormShell
      eyebrow="Reset password · Step 2 of 3"
      title="Confirm your identity"
      description={`We sent a code to ${email}. Enter it below.`}
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div>
          <Label className="mb-2 block">6-digit code</Label>
          <div
            role="group"
            aria-label="Six digit verification code"
            className="flex gap-2"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={handleChange(i)}
                onKeyDown={handleKeyDown(i)}
                onPaste={handlePaste}
                onFocus={(e) => e.currentTarget.select()}
                aria-label={`Digit ${i + 1}`}
                aria-invalid={hasError}
                className={cn(
                  'h-14 w-12 rounded-md border bg-surface text-center font-mono text-[22px] font-medium text-ink shadow-none outline-none transition-all duration-150 ease-out',
                  'focus-visible:border-brand focus-visible:shadow-[var(--shadow-focus)]',
                  hasError
                    ? 'border-danger'
                    : digit
                      ? 'border-border-strong'
                      : 'border-border',
                )}
              />
            ))}
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
          <Clock size={14} className="text-ink-subtle" aria-hidden />
          <span aria-hidden>Didn&apos;t get it?</span>{' '}
          {cooldown > 0 ? (
            <span className="text-ink-faint">
              Resend in 0:{cooldown.toString().padStart(2, '0')}
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={sendOtp.isPending}
              className="font-medium text-brand-strong hover:underline disabled:opacity-50"
            >
              {sendOtp.isPending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </p>

        <Button
          type="submit"
          className="h-11 w-full text-[15px]"
          disabled={!isComplete || confirmOtp.isPending}
        >
          {confirmOtp.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Verify'
          )}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} aria-hidden />
          Change email
        </button>
      </form>
    </AuthFormShell>
  )
}

// ============ STEP 3 — NEW PASSWORD ============

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

function ResetStep({
  verificationToken,
  onDone,
}: {
  verificationToken: string
  onDone: () => void
}) {
  const reset = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { password: '', confirm: '' },
    mode: 'onChange',
  })

  const password = form.watch('password')

  const onSubmit = form.handleSubmit(async ({ password: pw }) => {
    try {
      await reset.mutateAsync({ verificationToken, password: pw })
      toast.success('Password updated — sign in with your new password')
      onDone()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not reset password'))
    }
  })

  return (
    <AuthFormShell
      eyebrow="Reset password · Step 3 of 3"
      title="Set a new password"
      description="Choose something memorable. We'll check the basics as you type."
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          label="New password"
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
          label="Confirm new password"
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
          disabled={reset.isPending}
        >
          {reset.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Reset password'
          )}
        </Button>
      </form>
    </AuthFormShell>
  )
}
