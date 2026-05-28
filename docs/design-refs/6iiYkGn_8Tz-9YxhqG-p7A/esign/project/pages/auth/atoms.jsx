// =============================================================
// Paraph DS — atomic components used by every Auth frame.
// Every token resolves via var(--*) from /assets/paraph.css.
// =============================================================

const I = (name, size = 16, color = "currentColor", style = {}) => (
  <i
    data-lucide={name}
    style={{
      width: size,
      height: size,
      color,
      strokeWidth: 1.5,
      display: "inline-flex",
      flexShrink: 0,
      ...style,
    }}
  />
);

// ============ Wordmark / Logomark ============
function Wordmark({ size = 22, dark = false }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: size + 4,
        height: size + 4,
        borderRadius: 7,
        background: "var(--color-brand)",
        color: "var(--color-ink-inverse)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: size - 2,
        lineHeight: 1,
        boxShadow: "0 1px 2px oklch(0.4 0.1 38 / 0.25)",
      }}>E</div>
      <span style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        fontSize: size + 4,
        letterSpacing: "-0.02em",
        color: dark ? "var(--color-ink-inverse)" : "var(--color-ink)",
        lineHeight: 1,
      }}>ESign</span>
    </div>
  );
}

// ============ Button ============
function Button({
  variant = "primary",
  size = "md",
  block = false,
  icon = null,
  iconRight = null,
  disabled = false,
  children,
  style = {},
}) {
  const heights = { sm: 32, md: 40, lg: 44 };
  const padX = { sm: 12, md: 16, lg: 18 };
  const fontSize = { sm: 13, md: 14, lg: 15 };
  const variants = {
    primary: { background: "var(--color-brand)", color: "var(--color-ink-inverse)", border: "1px solid transparent" },
    secondary: { background: "var(--color-surface)", color: "var(--color-ink)", border: "1px solid var(--color-border)" },
    ghost: { background: "transparent", color: "var(--color-ink-muted)", border: "1px solid transparent" },
    destructive: { background: "var(--color-danger)", color: "var(--color-ink-inverse)", border: "1px solid transparent" },
  };
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: heights[size],
        padding: `0 ${padX[size]}px`,
        fontFamily: "var(--font-sans)",
        fontSize: fontSize[size],
        fontWeight: 500,
        borderRadius: "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        width: block ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        ...variants[variant],
        ...style,
      }}
    >
      {icon && I(icon, fontSize[size] + 2)}
      <span>{children}</span>
      {iconRight && I(iconRight, fontSize[size] + 2)}
    </button>
  );
}

// ============ Label ============
function Label({ children, htmlFor, required = false, action = null }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      marginBottom: 6,
    }}>
      <label htmlFor={htmlFor} style={{
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--color-ink)",
      }}>
        {children}{required && <span style={{ color: "var(--color-danger)", marginLeft: 2 }}>*</span>}
      </label>
      {action}
    </div>
  );
}

// ============ Input ============
function Input({
  icon,
  trailing,
  state = "default", // default | focus | filled | error | disabled
  placeholder,
  value,
  type = "text",
  size = "md",
}) {
  const height = size === "lg" ? 44 : 40;
  const borderColor = state === "error"
    ? "var(--color-danger)"
    : state === "focus"
    ? "var(--color-brand)"
    : "var(--color-border)";
  const boxShadow = state === "focus" ? "var(--shadow-focus)" : "none";
  const bg = state === "disabled" ? "var(--color-surface-sunken)" : "var(--color-surface)";
  const textColor = state === "filled" || (value && state !== "disabled")
    ? "var(--color-ink)"
    : state === "disabled"
    ? "var(--color-ink-faint)"
    : "var(--color-ink)";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 9,
      height,
      padding: "0 13px",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      background: bg,
      boxShadow,
      transition: "all var(--dur-1) var(--ease-out)",
    }}>
      {icon && I(icon, 16, "var(--color-ink-subtle)")}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        disabled={state === "disabled"}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: textColor,
          padding: 0,
        }}
      />
      {trailing}
    </div>
  );
}

// ============ Field (Label + Input + helper/error) ============
function Field({ label, required, action, hint, error, children }) {
  return (
    <div>
      {label && <Label required={required} action={action}>{label}</Label>}
      {children}
      {error && (
        <div style={{
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--color-danger-strong)",
        }}>
          {I("alert-circle", 13, "var(--color-danger-strong)")}
          <span>{error}</span>
        </div>
      )}
      {hint && !error && (
        <div style={{
          marginTop: 6,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--color-ink-subtle)",
        }}>{hint}</div>
      )}
    </div>
  );
}

// ============ Checkbox ============
function Checkbox({ checked = false, children }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 9,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--color-ink-muted)",
      lineHeight: 1.5,
    }}>
      <span style={{
        width: 16, height: 16,
        flexShrink: 0,
        marginTop: 2,
        borderRadius: 4,
        border: checked ? "1px solid var(--color-brand)" : "1px solid var(--color-border-strong)",
        background: checked ? "var(--color-brand)" : "var(--color-surface)",
        display: "grid", placeItems: "center",
        color: "var(--color-ink-inverse)",
      }}>
        {checked && I("check", 11, "var(--color-ink-inverse)", { strokeWidth: 2.5 })}
      </span>
      <span>{children}</span>
    </label>
  );
}

// ============ Progress Stepper ============
function Stepper({ steps, current = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
      {steps.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <div style={{
                width: 24, height: 24,
                borderRadius: 999,
                display: "grid", placeItems: "center",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 600,
                background: isActive
                  ? "var(--color-brand)"
                  : isDone
                  ? "var(--color-success-soft)"
                  : "var(--color-surface-sunken)",
                color: isActive
                  ? "var(--color-ink-inverse)"
                  : isDone
                  ? "var(--color-success-strong)"
                  : "var(--color-ink-subtle)",
                border: isActive ? "none" : isDone ? "none" : "1px solid var(--color-border)",
                transition: "all var(--dur-2) var(--ease-out)",
              }}>
                {isDone ? I("check", 13, "currentColor", { strokeWidth: 2.5 }) : i + 1}
              </div>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? "var(--color-ink)"
                  : isDone
                  ? "var(--color-ink-muted)"
                  : "var(--color-ink-subtle)",
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: 1,
                margin: "0 14px",
                background: isDone ? "var(--color-success)" : "var(--color-border)",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============ OTP Input (6 boxes) ============
function OTPInput({ value = "", error = false }) {
  const digits = (value + "      ").slice(0, 6).split("");
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {digits.map((d, i) => {
        const filled = d.trim().length > 0;
        const isCurrent = !filled && (i === 0 || digits[i - 1].trim().length > 0);
        return (
          <div key={i} style={{
            width: 48,
            height: 56,
            display: "grid",
            placeItems: "center",
            background: "var(--color-surface)",
            border: error
              ? "1px solid var(--color-danger)"
              : isCurrent
              ? "1px solid var(--color-brand)"
              : filled
              ? "1px solid var(--color-border-strong)"
              : "1px solid var(--color-border)",
            boxShadow: isCurrent ? "var(--shadow-focus)" : "none",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--color-ink)",
            transition: "all var(--dur-1) var(--ease-out)",
          }}>{d.trim()}</div>
        );
      })}
    </div>
  );
}

// ============ Live rules checklist (password rules) ============
function RuleCheck({ rules }) {
  // rules: [{label, passed}]
  return (
    <ul style={{
      listStyle: "none",
      padding: 0,
      margin: "10px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 5,
    }}>
      {rules.map(r => (
        <li key={r.label} style={{
          display: "flex", alignItems: "center", gap: 7,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: r.passed ? "var(--color-success-strong)" : "var(--color-ink-subtle)",
          transition: "color var(--dur-2) var(--ease-out)",
        }}>
          <span style={{
            width: 14, height: 14,
            borderRadius: 999,
            display: "grid", placeItems: "center",
            background: r.passed ? "var(--color-success-soft)" : "var(--color-surface-sunken)",
            color: r.passed ? "var(--color-success-strong)" : "var(--color-ink-faint)",
            flexShrink: 0,
          }}>
            {I(r.passed ? "check" : "circle", 10, "currentColor", { strokeWidth: r.passed ? 3 : 2 })}
          </span>
          {r.label}
        </li>
      ))}
    </ul>
  );
}

// ============ Toast ============
function Toast({ variant = "error", title, body, onDismiss = true }) {
  const palette = {
    success: { bg: "var(--color-success-soft)", border: "var(--color-success)", icon: "check-circle-2", iconColor: "var(--color-success-strong)" },
    info: { bg: "var(--color-info-soft)", border: "var(--color-info)", icon: "info", iconColor: "var(--color-info-strong)" },
    warning: { bg: "var(--color-warning-soft)", border: "var(--color-warning)", icon: "triangle-alert", iconColor: "var(--color-warning-strong)" },
    error: { bg: "var(--color-danger-soft)", border: "var(--color-danger)", icon: "alert-circle", iconColor: "var(--color-danger-strong)" },
  }[variant];
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "12px 14px",
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-2)",
      maxWidth: 360,
    }}>
      {I(palette.icon, 18, palette.iconColor, { marginTop: 1 })}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: 600,
          color: "var(--color-ink)",
          marginBottom: body ? 2 : 0,
        }}>{title}</div>}
        {body && <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
          lineHeight: 1.45,
        }}>{body}</div>}
      </div>
      {onDismiss && I("x", 16, "var(--color-ink-subtle)", { cursor: "pointer", marginTop: 2 })}
    </div>
  );
}

// ============ Tag Chip ============
function TagChip({ icon, children, variant = "default" }) {
  const palette = variant === "brand"
    ? { bg: "var(--color-brand-soft)", color: "var(--color-brand-strong)", border: "transparent" }
    : { bg: "var(--color-surface-raised)", color: "var(--color-ink-muted)", border: "var(--color-border)" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 9px",
      borderRadius: 999,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      background: palette.bg,
      color: palette.color,
      border: `1px solid ${palette.border}`,
    }}>
      {icon && I(icon, 12, "currentColor")}
      {children}
    </span>
  );
}

// ============ Avatar ============
function Avatar({ initials = "AB", size = 36, color = "oklch(0.78 0.06 38)" }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: color,
      color: "var(--color-ink-inverse)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: size * 0.4,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ============ Google G mark (brand) ============
function GoogleG({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.4 0 10.2-2.1 13.8-5.4l-6.4-5.4c-2 1.5-4.6 2.4-7.4 2.4-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4c-.4.4 7-5.1 7-15.1 0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

// ============ Microsoft squares (brand) ============
function MicrosoftMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" style={{ flexShrink: 0 }}>
      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}

// ============ Separator with caption ============
function Separator({ children = "or" }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "16px 0",
    }}>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--color-ink-subtle)",
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
    </div>
  );
}

// ============ Form heading block ============
function FormHeading({ eyebrow, title, body }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-brand-strong)",
        marginBottom: 10,
      }}>{eyebrow}</div>}
      <h2 style={{
        fontFamily: "var(--font-sans)",
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: "-0.015em",
        color: "var(--color-ink)",
        lineHeight: 1.2,
        margin: 0,
      }}>{title}</h2>
      {body && <p style={{
        marginTop: 8,
        marginBottom: 0,
        fontFamily: "var(--font-sans)",
        fontSize: 14.5,
        lineHeight: 1.5,
        color: "var(--color-ink-muted)",
      }}>{body}</p>}
    </div>
  );
}

// ============ Brand Panel (left side of auth split) ============
function BrandPanel({ variant = "default", footer = "© 2026 ESign · Terms · Privacy" }) {
  const variants = {
    default: {
      headline: <>Send.<br/>Sign.<br/>Done.<br/><em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>— in minutes.</em></>,
      quote: "We went from chasing PDFs in email to closing onboarding in a single afternoon. The signers don't even need an account.",
      author: "Mira Okonkwo",
      role: "Head of People, Northbeam",
      tags: ["NDA", "Offer letter", "Vendor MSA"],
    },
    welcome: {
      headline: <>Welcome<br/>back to <em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>ESign.</em></>,
      quote: "It is the only tool our finance, legal, and people teams all log into voluntarily. That is a first.",
      author: "Daniel Park",
      role: "COO, Riverline Holdings",
      tags: ["Finance", "Legal", "People"],
    },
    verify: {
      headline: <>One code.<br/>One <em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>signature.</em><br/>Zero printers.</>,
      quote: "Verification used to take three emails and a phone call. Now it is six digits and a tap.",
      author: "Priya Shastri",
      role: "Sales Operations, Lumen Studio",
      tags: ["OTP", "Email verify"],
    },
    organization: {
      headline: <>Built for the<br/>way <em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>teams</em><br/>actually work.</>,
      quote: "I onboarded twenty-three contractors in the time it used to take to onboard three.",
      author: "Yusuf Demir",
      role: "Founder, Tessera Studio",
      tags: ["Templates", "Roles", "Audit log"],
    },
    reset: {
      headline: <>Locked out?<br/>Back in <em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>thirty seconds.</em></>,
      quote: "Most password resets feel like an interrogation. This one feels like a doorman waving you through.",
      author: "Aisha Bello",
      role: "IT Lead, Margate Co.",
      tags: ["Account recovery"],
    },
    invite: {
      headline: <>You've been<br/>invited to<br/><em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>ESign.</em></>,
      quote: "I joined Tuesday, sent my first contract Wednesday. The onboarding is honestly embarrassing how short it is.",
      author: "Caleb Mwangi",
      role: "New hire, Acme Corp.",
      tags: ["Workspace invite"],
    },
    confirm: {
      headline: <>Check your<br/>inbox.<br/><em style={{ fontStyle: "italic", color: "var(--color-brand)" }}>We sent a link.</em></>,
      quote: "The email arrives before you switch tabs. I tested it three times because I didn't believe it.",
      author: "Sana Ortiz",
      role: "Brand Manager, Folio",
      tags: ["Magic link"],
    },
  };
  const v = variants[variant] || variants.default;
  return (
    <aside style={{
      position: "relative",
      overflow: "hidden",
      background: "var(--color-paper)",
      padding: "48px 56px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "100%",
    }}>
      {/* Gradient mesh */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(56% 50% at 8% 0%, oklch(0.86 0.10 60 / 0.55), transparent 70%),
          radial-gradient(40% 55% at 95% 28%, oklch(0.94 0.05 70 / 0.85), transparent 75%),
          radial-gradient(70% 60% at 75% 100%, oklch(0.70 0.155 38 / 0.18), transparent 65%)
        `,
      }} />
      {/* Light grain via dotted SVG overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
        backgroundImage: "radial-gradient(oklch(0.55 0.05 38 / 0.06) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Wordmark size={24} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: 64,
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          fontWeight: 400,
          color: "var(--color-ink)",
          margin: 0,
        }}>
          {v.headline}
        </h1>

        {/* Testimonial card */}
        <div style={{
          marginTop: 36,
          padding: "18px 20px",
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-1)",
          maxWidth: 420,
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}>
            <Avatar initials={v.author.split(" ").map(s => s[0]).slice(0, 2).join("")} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--color-ink)",
              }}>
                <span style={{ color: "var(--color-brand)", fontFamily: "var(--font-display)", fontSize: 18, verticalAlign: -2, marginRight: 2 }}>"</span>
                {v.quote}
              </p>
              <div style={{
                marginTop: 8,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-ink-subtle)",
              }}>
                <strong style={{ color: "var(--color-ink-muted)", fontWeight: 600 }}>{v.author}</strong>
                <span> · {v.role}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {v.tags.map(t => <TagChip key={t}>{t}</TagChip>)}
        </div>
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--color-ink-subtle)",
      }}>{footer}</div>
    </aside>
  );
}

// ============ FormPanel — the right side wrapper ============
function FormPanel({ children, width = 400 }) {
  return (
    <main style={{
      background: "var(--color-surface)",
      borderLeft: "1px solid var(--color-border)",
      padding: "48px 64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
    }}>
      <div style={{ width: "100%", maxWidth: width }}>
        {children}
      </div>
    </main>
  );
}

// ============ AuthSplit — the layout ============
function AuthSplit({ brand, formWidth, children }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--color-paper)",
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      overflow: "hidden",
    }}>
      <BrandPanel variant={brand} />
      <FormPanel width={formWidth}>{children}</FormPanel>
    </div>
  );
}

// Export to window
Object.assign(window, {
  I, Wordmark, Button, Label, Input, Field, Checkbox, Stepper, OTPInput,
  RuleCheck, Toast, TagChip, Avatar, GoogleG, MicrosoftMark, Separator,
  FormHeading, BrandPanel, FormPanel, AuthSplit,
});
