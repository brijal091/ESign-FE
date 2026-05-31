'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Loader2, Mail } from 'lucide-react'
import {
  Button,
  Label,
  toast,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@esign/ui'
import {
  RegisterOrganizationRequestSchema,
  type RegisterOrganizationRequest,
} from '@esign/types'
import {
  useConfirmOtp,
  useRegisterOrganization,
  useSendOtp,
} from '../../../lib/api/auth'
import { getErrorMessage } from '../../../lib/api/errors'
import { AuthFormShell } from '../../../components/auth/auth-form-shell'
import { FormField } from '../../../components/auth/form-field'
import { Stepper } from '../../../components/auth/stepper'

const STEPS = ['Email', 'Verify', 'Organization'] as const
const OPERATION = 2 as const
const RESEND_COOLDOWN_SECONDS = 30

type StepIndex = 0 | 1 | 2

const EmailSchema = z.object({ email: z.string().email('Invalid email') })
type EmailValues = z.infer<typeof EmailSchema>

const ORG_SIZES = [
  '1 (just me)',
  '2-10',
  '11-50',
  '51-200',
  '201-1000',
  '1000+',
] as const

const ROLES = [
  'Founder / CEO',
  'Operations',
  'People / HR',
  'Legal',
  'Finance',
  'Sales',
  'IT / Engineering',
  'Other',
] as const

const OrgStepSchema = z.object({
  orgName: z.string().min(1, 'Organization name is required').max(100),
  orgSize: z.enum(ORG_SIZES, {
    errorMap: () => ({ message: 'Select a company size' }),
  }),
  role: z.enum(ROLES, { errorMap: () => ({ message: 'Select your role' }) }),
  userFirstName: z.string().min(1, 'First name is required').max(50),
  userLastName: z.string().min(1, 'Last name is required').max(50),
  userMobileNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, 'Mobile number must be 10–15 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type OrgValues = z.infer<typeof OrgStepSchema>

export default function SignupPage() {
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
        <OrgStep
          email={email}
          verificationToken={verificationToken}
          onBack={() => setStep(1)}
          onDone={() => router.replace('/dashboard')}
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
      toast.success('Verification code sent')
      onSent(email)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send code'))
    }
  })

  return (
    <AuthFormShell
      title="Create your ESign account"
      description="We'll send a 6-digit code to verify your email."
      footer={
        <span>
          Already have an account?{' '}
          <Link
            className="font-medium text-brand-strong hover:underline"
            href="/login"
          >
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
              Send code
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
        // Support paste-like multi-digit input by spilling forward.
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
          // Clear current first; default change handler covers it, but explicit
          // makes the empty-cell + backspace path predictable.
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

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
      if (!text) return
      e.preventDefault()
      const next = Array(6).fill('')
      for (let i = 0; i < text.length; i++) next[i] = text[i]
      setDigits(next)
      setHasError(false)
      const focusIdx = Math.min(text.length, 5)
      inputsRef.current[focusIdx]?.focus()
    },
    [],
  )

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
        toast.error('OTP expired')
      } else if (
        message.includes('match') ||
        message.includes('invalid') ||
        message.includes('incorrect')
      ) {
        toast.error("OTP didn't match")
      } else {
        toast.error("OTP didn't match")
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
      title="Verify your email"
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
            'Verify code'
          )}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-full items-center justify-center gap-1.5 text-[13px] text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={14} aria-hidden /> Change email
        </button>
      </form>
    </AuthFormShell>
  )
}

// ============ STEP 3 — ORGANIZATION ============

function OrgStep({
  email,
  verificationToken,
  onBack,
  onDone,
}: {
  email: string
  verificationToken: string
  onBack: () => void
  onDone: () => void
}) {
  const register = useRegisterOrganization()
  const form = useForm<OrgValues>({
    resolver: zodResolver(OrgStepSchema),
    defaultValues: {
      orgName: '',
      orgSize: undefined,
      role: undefined,
      userFirstName: '',
      userLastName: '',
      userMobileNumber: '',
      password: '',
    } as Partial<OrgValues> as OrgValues,
  })

  const orgSizeError = form.formState.errors.orgSize?.message
  const roleError = form.formState.errors.role?.message

  const submit = form.handleSubmit(async (values) => {
    const payload: RegisterOrganizationRequest = {
      verificationToken,
      orgName: values.orgName,
      userFirstName: values.userFirstName,
      userLastName: values.userLastName,
      userMobileNumber: values.userMobileNumber,
      userEmail: email,
      password: values.password,
    }

    // Validate the upstream payload shape — defensive in case zod schemas drift.
    const parsed = RegisterOrganizationRequestSchema.safeParse(payload)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Invalid signup details')
      return
    }

    try {
      await register.mutateAsync(parsed.data)
      toast.success('Welcome! Your account is ready.')
      onDone()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'))
    }
  })

  const orgSize = form.watch('orgSize')
  const role = form.watch('role')

  return (
    <AuthFormShell
      title="Tell us about your team"
      description="One more step — we'll create your workspace."
    >
      <form className="space-y-4" onSubmit={submit} noValidate>
        <FormField
          label="Organization name"
          autoComplete="organization"
          placeholder="Northbeam Holdings"
          {...form.register('orgName')}
          error={form.formState.errors.orgName?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Company size</Label>
            <FormSelect
              placeholder="Select…"
              value={orgSize}
              options={ORG_SIZES as unknown as string[]}
              error={!!orgSizeError}
              onChange={(v) => form.setValue('orgSize', v as typeof orgSize, { shouldValidate: true })}
            />
            {orgSizeError && <p className="text-xs text-danger-strong">{orgSizeError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Your role</Label>
            <FormSelect
              placeholder="Select…"
              value={role}
              options={ROLES as unknown as string[]}
              error={!!roleError}
              onChange={(v) => form.setValue('role', v as typeof role, { shouldValidate: true })}
            />
            {roleError && <p className="text-xs text-danger-strong">{roleError}</p>}
          </div>
        </div>

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
          autoComplete="tel"
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

        <Button
          type="submit"
          className="h-11 w-full text-[15px]"
          disabled={register.isPending}
        >
          {register.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-full items-center justify-center gap-1.5 text-[13px] text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={14} aria-hidden /> Back
        </button>
      </form>
    </AuthFormShell>
  )
}

// ─── FormSelect ───────────────────────────────────────────────────────────────
// Themed dropdown built on DropdownMenu — replaces native <select> so the
// option list inherits design tokens instead of OS-native chrome.

function FormSelect({
  placeholder,
  value,
  options,
  error,
  onChange,
}: {
  placeholder: string
  value: string | undefined
  options: string[]
  error?: boolean
  onChange: (v: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-md border bg-surface px-3 text-[14px] transition-all',
            'outline-none focus-visible:border-brand focus-visible:shadow-[var(--shadow-focus)]',
            error ? 'border-danger' : 'border-border',
            value ? 'text-ink' : 'text-ink-faint',
          )}
        >
          <span className="truncate">{value ?? placeholder}</span>
          <ChevronDown className="size-4 shrink-0 text-ink-subtle" strokeWidth={1.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-50 max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
        align="start"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center justify-between"
          >
            {opt}
            {value === opt && <Check className="size-3.5 text-brand" strokeWidth={2} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
