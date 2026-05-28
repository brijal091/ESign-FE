// =============================================================
// 03 — Auth · 9 frames + annotation cards
// All frames render at 1440×900 (Auth Split layout).
// Annotation cards render small (toast / inline error snapshots).
// =============================================================

// ============ 1. LOGIN ============
function LoginFrame({ error = false } = {}) {
  return (
    <AuthSplit brand="welcome">
      <FormHeading
        title="Welcome back"
        body="Sign in to continue to ESign."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field
          label="Email"
          error={error ? "Enter a valid email address." : null}
        >
          <Input
            icon="mail"
            placeholder="you@company.com"
            value={error ? "brijal@example" : "brijal@northbeam.io"}
            state={error ? "error" : "filled"}
          />
        </Field>

        <Field
          label="Password"
          action={<a href="#" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--color-brand)", textDecoration: "none" }}>Forgot password?</a>}
        >
          <Input
            icon="lock"
            type="password"
            value="••••••••••••"
            trailing={I("eye", 16, "var(--color-ink-subtle)", { cursor: "pointer" })}
            state="filled"
          />
        </Field>

        <Button block size="lg" style={{ marginTop: 4 }}>Sign In</Button>

        <Separator>or</Separator>

        <Button block variant="secondary" size="lg" icon={null}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <GoogleG size={18} />Continue with Google
          </span>
        </Button>
        <Button block variant="secondary" size="lg">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <MicrosoftMark size={16} />Continue with Microsoft
          </span>
        </Button>
      </div>

      <div style={{
        marginTop: 28,
        textAlign: "center",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--color-ink-muted)",
      }}>
        Don't have an account?{" "}
        <a href="#" style={{ color: "var(--color-brand)", fontWeight: 500, textDecoration: "none" }}>Sign up</a>
      </div>
    </AuthSplit>
  );
}

// ============ 2. SIGNUP STEP 1 — EMAIL ============
function SignupEmailFrame() {
  return (
    <AuthSplit brand="default">
      <div style={{ marginBottom: 36 }}>
        <Stepper steps={["Email", "Verify", "Organization"]} current={0} />
      </div>

      <FormHeading
        title="Create your ESign account"
        body="We'll send a 6-digit code to verify your email."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Work email">
          <Input
            icon="mail"
            placeholder="you@company.com"
            value="brijal@northbeam.io"
            state="filled"
          />
        </Field>

        <Button block size="lg" iconRight="arrow-right" style={{ marginTop: 4 }}>Send Code</Button>
      </div>

      <div style={{
        marginTop: 28,
        textAlign: "center",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--color-ink-muted)",
      }}>
        Already have an account?{" "}
        <a href="#" style={{ color: "var(--color-brand)", fontWeight: 500, textDecoration: "none" }}>Sign in</a>
      </div>
    </AuthSplit>
  );
}

// ============ 3. SIGNUP STEP 2 — OTP ============
function SignupOtpFrame({ otp = "428193" } = {}) {
  return (
    <AuthSplit brand="verify">
      <div style={{ marginBottom: 36 }}>
        <Stepper steps={["Email", "Verify", "Organization"]} current={1} />
      </div>

      <FormHeading
        title="Verify your email"
        body={<>We sent a code to <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>brijal@example.com</strong>. Enter it below.</>}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <OTPInput value={otp} />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
        }}>
          {I("clock", 14, "var(--color-ink-subtle)")}
          Didn't get it? <span style={{ color: "var(--color-ink-faint)" }}>Resend in 0:42</span>
        </div>

        <Button block size="lg" disabled={otp.length < 6} style={{ marginTop: 4 }}>Verify</Button>
        <Button block variant="ghost" icon="arrow-left">Change email</Button>
      </div>
    </AuthSplit>
  );
}

// ============ 4. SIGNUP STEP 3 — ORGANIZATION ============
function SignupOrgFrame() {
  return (
    <AuthSplit brand="organization" formWidth={420}>
      <div style={{ marginBottom: 36 }}>
        <Stepper steps={["Email", "Verify", "Organization"]} current={2} />
      </div>

      <FormHeading title="Tell us about you" />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Organization name">
          <Input icon="building-2" value="Northbeam Holdings" state="filled" />
        </Field>
        <Field label="Your full name">
          <Input icon="user" value="Brijal Patel" state="filled" />
        </Field>
        <Field
          label="Password"
          hint="At least 8 characters with a number and symbol."
        >
          <Input
            icon="lock"
            type="password"
            value="••••••••••••"
            trailing={I("eye", 16, "var(--color-ink-subtle)", { cursor: "pointer" })}
            state="filled"
          />
        </Field>
        <Field label="Confirm password">
          <Input
            icon="lock"
            type="password"
            value="••••••••••••"
            state="filled"
          />
        </Field>

        <div style={{ marginTop: 6 }}>
          <Checkbox checked>
            I agree to the{" "}
            <a href="#" style={{ color: "var(--color-brand)", textDecoration: "none", fontWeight: 500 }}>Terms</a>
            {" "}and{" "}
            <a href="#" style={{ color: "var(--color-brand)", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</a>.
          </Checkbox>
        </div>

        <Button block size="lg" style={{ marginTop: 8 }}>Create Account</Button>
        <Button block variant="ghost" icon="arrow-left">Back</Button>
      </div>
    </AuthSplit>
  );
}

// ============ 5. FORGOT PASSWORD STEP 1 — EMAIL ============
function ForgotEmailFrame() {
  return (
    <AuthSplit brand="reset">
      <FormHeading
        title="Reset your password"
        body="Enter your email and we'll send a reset code."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Email">
          <Input
            icon="mail"
            placeholder="you@company.com"
            value="brijal@northbeam.io"
            state="filled"
          />
        </Field>

        <Button block size="lg" iconRight="arrow-right" style={{ marginTop: 4 }}>Send Reset Code</Button>
      </div>

      <div style={{
        marginTop: 28,
        textAlign: "center",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
      }}>
        <a href="#" style={{
          color: "var(--color-brand)",
          fontWeight: 500,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}>
          {I("arrow-left", 14, "var(--color-brand)")}
          Back to sign in
        </a>
      </div>
    </AuthSplit>
  );
}

// ============ 6. FORGOT PASSWORD STEP 2 — OTP ============
function ForgotOtpFrame({ otp = "319" } = {}) {
  return (
    <AuthSplit brand="reset">
      <FormHeading
        eyebrow="Reset password · Step 2 of 3"
        title="Confirm your identity"
        body={<>We sent a code to <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>brijal@northbeam.io</strong>. Enter it below.</>}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <OTPInput value={otp} />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
        }}>
          {I("clock", 14, "var(--color-ink-subtle)")}
          Didn't get it? <span style={{ color: "var(--color-ink-faint)" }}>Resend in 0:42</span>
        </div>

        <Button block size="lg" disabled={otp.length < 6} style={{ marginTop: 4 }}>Verify</Button>
        <Button block variant="ghost" icon="arrow-left">Change email</Button>
      </div>
    </AuthSplit>
  );
}

// ============ 7. FORGOT PASSWORD STEP 3 — NEW PASSWORD ============
function ForgotNewPwdFrame() {
  return (
    <AuthSplit brand="reset">
      <FormHeading
        eyebrow="Reset password · Step 3 of 3"
        title="Set a new password"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="New password">
          <Input
            icon="lock"
            type="password"
            value="••••••••••"
            trailing={I("eye", 16, "var(--color-ink-subtle)", { cursor: "pointer" })}
            state="filled"
          />
        </Field>
        <Field label="Confirm new password">
          <Input
            icon="lock"
            type="password"
            value="••••••••••"
            state="filled"
          />
        </Field>

        <RuleCheck rules={[
          { label: "At least 8 characters", passed: true },
          { label: "Contains a number", passed: true },
          { label: "Contains a symbol", passed: false },
        ]} />

        <Button block size="lg" style={{ marginTop: 12 }}>Reset Password</Button>
      </div>
    </AuthSplit>
  );
}

// ============ 8. SET PASSWORD (INVITE) ============
function SetPasswordFrame() {
  return (
    <AuthSplit brand="invite">
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "5px 10px 5px 6px",
        background: "var(--color-brand-soft)",
        color: "var(--color-brand-strong)",
        borderRadius: 999,
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
        marginBottom: 18,
      }}>
        <Avatar initials="AC" size={20} color="var(--color-brand)" />
        Invited by Acme Corp.
      </div>

      <FormHeading
        title="Welcome to ESign"
        body="You've been invited by Acme Corp. Set a password to get started."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Email" >
          <Input
            icon="mail"
            value="caleb@acmecorp.com"
            state="disabled"
          />
        </Field>
        <Field label="Password">
          <Input
            icon="lock"
            type="password"
            value="••••••••••••"
            trailing={I("eye", 16, "var(--color-ink-subtle)", { cursor: "pointer" })}
            state="filled"
          />
        </Field>
        <Field label="Confirm password">
          <Input
            icon="lock"
            type="password"
            value="••••••••••••"
            state="filled"
          />
        </Field>

        <RuleCheck rules={[
          { label: "At least 8 characters", passed: true },
          { label: "Contains a number", passed: true },
          { label: "Contains a symbol", passed: true },
        ]} />

        <Button block size="lg" style={{ marginTop: 12 }}>Activate Account</Button>
      </div>
    </AuthSplit>
  );
}

// ============ 9. EMAIL-SENT CONFIRMATION ============
function EmailSentFrame() {
  return (
    <AuthSplit brand="confirm">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {/* Paper-plane illustration */}
        <div style={{
          width: 96, height: 96,
          borderRadius: "var(--radius-full)",
          background: "var(--color-brand-soft)",
          color: "var(--color-brand-strong)",
          display: "grid", placeItems: "center",
          marginBottom: 22,
          position: "relative",
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M40 4L4 18l13 5 5 13L40 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M40 4L17 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {/* little dotted trail */}
          <span style={{
            position: "absolute",
            right: -8, top: -8,
            width: 10, height: 10,
            borderRadius: 999,
            background: "var(--color-brand)",
            opacity: 0.8,
          }} />
        </div>

        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--color-ink)",
          margin: 0,
        }}>Check your inbox</h2>

        <p style={{
          marginTop: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 14.5,
          lineHeight: 1.5,
          color: "var(--color-ink-muted)",
          maxWidth: 320,
        }}>
          We sent a link to <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>brijal@example.com</strong>. It expires in 24 hours.
        </p>

        <div style={{
          marginTop: 24,
          padding: "10px 14px",
          background: "var(--color-surface-sunken)",
          border: "1px dashed var(--color-border-strong)",
          borderRadius: "var(--radius-sm)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-ink-subtle)",
        }}>
          {I("mail-check", 14, "var(--color-ink-subtle)")}
          Tip: check spam if it doesn't arrive in 2 minutes.
        </div>

        <div style={{ marginTop: 32 }}>
          <Button variant="ghost" icon="arrow-left">Back to sign in</Button>
        </div>
      </div>
    </AuthSplit>
  );
}

// =============================================================
// ANNOTATION FRAMES — small cards showing toast + inline errors.
// Hosted at a smaller artboard size (440×260).
// =============================================================
function AnnotationFrame({ title, children, bg = "var(--color-paper)" }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: bg,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      position: "relative",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-ink-subtle)",
      }}>{title}</div>
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

function ToastLoginErrorAnno() {
  return (
    <AnnotationFrame title="Login · error toast">
      <Toast variant="error" title="Sign in failed" body="Invalid email or password." />
    </AnnotationFrame>
  );
}
function ToastOtpWrongAnno() {
  return (
    <AnnotationFrame title="OTP · wrong code">
      <Toast variant="warning" title="That didn't match" body="That code didn't match. Try again." />
    </AnnotationFrame>
  );
}
function ToastOtpExpiredAnno() {
  return (
    <AnnotationFrame title="OTP · expired">
      <Toast variant="warning" title="Code expired" body="Tap 'Resend' to get a new one." />
    </AnnotationFrame>
  );
}
function InlineMismatchAnno() {
  return (
    <AnnotationFrame title="Confirm password · inline mismatch">
      <div style={{ width: "100%", maxWidth: 320 }}>
        <Field label="Confirm new password" error="Passwords don't match.">
          <Input
            icon="lock"
            type="password"
            value="••••••••••"
            state="error"
          />
        </Field>
      </div>
    </AnnotationFrame>
  );
}

Object.assign(window, {
  LoginFrame, SignupEmailFrame, SignupOtpFrame, SignupOrgFrame,
  ForgotEmailFrame, ForgotOtpFrame, ForgotNewPwdFrame,
  SetPasswordFrame, EmailSentFrame,
  ToastLoginErrorAnno, ToastOtpWrongAnno, ToastOtpExpiredAnno, InlineMismatchAnno,
});
