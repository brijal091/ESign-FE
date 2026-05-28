'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, toast } from '@esign/ui'
import { Loader2 } from 'lucide-react'
import { useConfirmOtp, useSendOtp } from '../../lib/api/auth'
import { getErrorMessage } from '../../lib/api/errors'
import type { OtpOperation } from '@esign/types'
import { FormField } from './form-field'

const OtpFormSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be exactly 6 digits'),
})
type OtpFormValues = z.infer<typeof OtpFormSchema>

interface OtpFormProps {
  email: string
  operation: OtpOperation
  onVerified: (verificationToken: string) => void
}

export function OtpForm({ email, operation, onVerified }: OtpFormProps) {
  const confirmOtp = useConfirmOtp()
  const sendOtp = useSendOtp()

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: { otp: '' },
  })

  const onSubmit = form.handleSubmit(async ({ otp }) => {
    try {
      const result = await confirmOtp.mutateAsync({ email, otp, operation })
      if (!result.verificationToken) {
        toast.error('Verification token missing from response')
        return
      }
      onVerified(result.verificationToken)
    } catch (err) {
      toast.error(getErrorMessage(err, 'OTP verification failed'))
    }
  })

  const onResend = async () => {
    try {
      await sendOtp.mutateAsync({ email, operation })
      toast.success('OTP sent again')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not resend OTP'))
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <FormField
        label="6-digit code"
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        hint={`Sent to ${email}`}
        {...form.register('otp')}
        error={form.formState.errors.otp?.message}
      />
      <Button type="submit" className="w-full" disabled={confirmOtp.isPending}>
        {confirmOtp.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
      </Button>
      <button
        type="button"
        onClick={onResend}
        disabled={sendOtp.isPending}
        className="w-full text-xs text-ink-subtle hover:text-ink transition-colors disabled:opacity-50"
      >
        {sendOtp.isPending ? 'Sending…' : 'Resend code'}
      </button>
    </form>
  )
}
