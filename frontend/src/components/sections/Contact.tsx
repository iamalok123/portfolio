import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  Check,
  Copy,
  Loader2,
  Mail,
  MessagesSquare,
  SendHorizonal,
} from 'lucide-react'
import { Github } from 'react-bootstrap-icons'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { api } from '../../lib/axios'
import { cn } from '../../lib/utils'

// ─── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(['Internship', 'Project', 'Freelance', 'Other'], {
    message: 'Please select a subject',
  }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  honeypot: z.string().max(0).optional(), // anti-spam
})

type FormData = z.infer<typeof schema>

// ─── Social / Contact Info ──────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    label: 'Email',
    value: 'alok@example.com',
    href: 'mailto:alok@example.com',
    Icon: Mail,
    copyable: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/alok',
    href: 'https://github.com',
    Icon: Github,
    copyable: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/alok',
    href: 'https://linkedin.com',
    Icon: BriefcaseBusiness,
    copyable: false,
  },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: BriefcaseBusiness },
  { label: 'Twitter', href: 'https://x.com', Icon: MessagesSquare },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com',
    Icon: () => (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
]

// ─── Floating Label Input ───────────────────────────────────────────────────
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  id: string
}

function FloatingInput({ label, error, id, className, ...props }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = Boolean(props.value) || Boolean(props.defaultValue)
  const isRaised = focused || hasValue

  return (
    <div className="relative">
      <input
        id={id}
        {...props}
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        className={cn(
          'peer w-full rounded-lg border bg-surface-2 px-4 pb-3 pt-7 text-sm text-foreground outline-none transition-all',
          focused
            ? 'border-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]'
            : 'border-border',
          error && 'border-red-500',
          className,
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-4 transition-all duration-200',
          isRaised
            ? 'top-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent'
            : 'top-1/2 -translate-y-1/2 text-sm text-muted',
        )}
      >
        {label}
      </label>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  )
}

interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  id: string
}

function FloatingTextarea({
  label,
  error,
  id,
  className,
  ...props
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = Boolean(props.value) || Boolean(props.defaultValue)
  const isRaised = focused || hasValue

  return (
    <div className="relative">
      <textarea
        id={id}
        rows={5}
        {...props}
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        className={cn(
          'peer w-full resize-none rounded-lg border bg-surface-2 px-4 pb-3 pt-7 text-sm text-foreground outline-none transition-all',
          focused
            ? 'border-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]'
            : 'border-border',
          error && 'border-red-500',
          className,
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-4 transition-all duration-200',
          isRaised
            ? 'top-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent'
            : 'top-5 text-sm text-muted',
        )}
      >
        {label}
      </label>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  )
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${value}`}
      className="ml-2 grid size-7 place-items-center rounded-md border border-border bg-surface text-muted transition hover:border-accent/50 hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Check size={13} className="text-accent" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Copy size={13} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'submitting' | 'success'

const fieldVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const { ref: leftRef, inView: leftInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })
  const { ref: rightRef, inView: rightInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const watchedValues = watch()

  const onSubmit = async (data: FormData) => {
    if (data.honeypot) return // spam bot check

    setStatus('submitting')
    try {
      await api.post('/contact', {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
      setStatus('success')
      toast.success("Message sent! I'll get back to you soon 🚀")
      reset()
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('idle')
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-border" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,color-mix(in_srgb,var(--accent)_8%,transparent),transparent)]" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
        {/* ─── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <motion.div
          ref={leftRef}
          initial={{ opacity: 0, x: -48 }}
          animate={leftInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
            // contact
          </p>
          <h2 className="mt-5 whitespace-pre-line font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
            {"Let's Build\nSomething Together."}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-muted">
            I'm currently open to internship opportunities, freelance
            collaborations, and exciting projects. If you have an idea or
            just want to say hi, my inbox is always open.
          </p>

          {/* Availability status */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#32d583] opacity-70" />
              <span className="relative inline-flex size-3 rounded-full bg-[#32d583]" />
            </span>
            Available for work
          </div>

          {/* Contact info list */}
          <div className="mt-10 space-y-4">
            {CONTACT_INFO.map(({ label, value, href, Icon, copyable }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-surface text-accent">
                  <Icon size={17} />
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-sm font-medium text-foreground transition hover:text-accent"
                  >
                    {value}
                  </a>
                  {copyable && <CopyButton value={value} />}
                </div>
              </div>
            ))}
          </div>

          {/* Social icon buttons */}
          <div className="mt-10 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                className="grid size-11 place-items-center rounded-md border border-border bg-surface text-muted transition hover:border-accent/50 hover:bg-accent hover:text-black"
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ─── RIGHT COLUMN (Form) ─────────────────────────────────────────── */}
        <motion.div
          ref={rightRef}
          initial={{ opacity: 0, x: 48 }}
          animate={rightInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
        >
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-surface p-6 shadow-[0_24px_90px_rgba(0,0,0,0.14)] sm:p-8"
            initial="hidden"
            animate={rightInView ? 'visible' : 'hidden'}
            variants={{
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              hidden: {},
            }}
          >
            {/* Honeypot — hidden anti-spam field */}
            <input
              type="text"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute left-[-9999px] opacity-0"
              {...register('honeypot')}
            />

            <motion.div variants={fieldVariants} transition={{ type: 'spring', stiffness: 150, damping: 22 }}>
              <FloatingInput
                id="contact-name"
                label="Your Name"
                autoComplete="name"
                error={errors.name?.message}
                value={watchedValues.name ?? ''}
                {...register('name')}
              />
            </motion.div>

            <motion.div
              variants={fieldVariants}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              className="mt-4"
            >
              <FloatingInput
                id="contact-email"
                label="Email Address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                value={watchedValues.email ?? ''}
                {...register('email')}
              />
            </motion.div>

            {/* Subject dropdown */}
            <motion.div
              variants={fieldVariants}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              className="relative mt-4"
            >
              <select
                id="contact-subject"
                defaultValue=""
                className={cn(
                  'w-full appearance-none rounded-lg border bg-surface-2 px-4 py-4 text-sm outline-none transition-all',
                  errors.subject
                    ? 'border-red-500 text-foreground'
                    : 'border-border text-foreground focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]',
                )}
                {...register('subject')}
              >
                <option value="" disabled className="text-muted">
                  Subject — Internship, Project, Freelance, Other
                </option>
                {['Internship', 'Project', 'Freelance', 'Other'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.subject ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.subject.message}</p>
              ) : null}
            </motion.div>

            <motion.div
              variants={fieldVariants}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              className="mt-4"
            >
              <FloatingTextarea
                id="contact-message"
                label="Your Message"
                error={errors.message?.message}
                value={watchedValues.message ?? ''}
                {...register('message')}
              />
            </motion.div>

            <motion.div
              variants={fieldVariants}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              className="mt-6"
            >
              <motion.button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                whileHover={status === 'idle' ? { scale: 1.02 } : undefined}
                whileTap={status === 'idle' ? { scale: 0.98 } : undefined}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                className={cn(
                  'relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full py-4 font-display text-sm font-extrabold uppercase tracking-[0.18em] transition-colors',
                  status === 'success'
                    ? 'bg-[#32d583] text-black'
                    : 'bg-accent text-black hover:opacity-90',
                  status === 'submitting' && 'cursor-not-allowed opacity-70',
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'submitting' ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={17} className="animate-spin" />
                      Sending…
                    </motion.span>
                  ) : status === 'success' ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={17} />
                      Message Sent!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Send Message
                      <SendHorizonal size={17} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
