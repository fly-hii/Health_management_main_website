import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Lock,
  KeyRound, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

const otpEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

// ── Tab: Password Login ──────────────────────────────────────────────
function PasswordTab({ role, portalConfig }) {
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data) => login({ ...data, role })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Email */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0B1F3A', marginBottom: 8 }}>
          Email Address
        </label>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            {...register('email')}
            type="email"
            id="login-email"
            placeholder="you@hospital.com"
            className={`form-input ${errors.email ? 'error' : ''}`}
            style={{ paddingLeft: 42 }}
          />
        </div>
        {errors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0B1F3A', marginBottom: 8 }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="••••••••"
            className={`form-input ${errors.password ? 'error' : ''}`}
            style={{ paddingLeft: 42, paddingRight: 42 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.password.message}</p>}
      </div>

      {/* Remember Me + Forgot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#64748B' }}>
          <input type="checkbox" {...register('rememberMe')} id="remember-me" style={{ accentColor: portalConfig.color }} />
          Remember me
        </label>
        <ForgotPasswordLink color={portalConfig.color} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="login-submit-btn"
        disabled={loading}
        style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: loading ? '#94A3B8' : `linear-gradient(135deg, ${portalConfig.color}, ${portalConfig.colorLight})`,
          color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 700, fontSize: 16,
          boxShadow: loading ? 'none' : `0 6px 20px ${portalConfig.color}40`,
          transition: 'all 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
        {loading ? 'Signing In...' : 'Sign In'}
        {!loading && <ArrowRight size={16} />}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}

// ── Tab: OTP Login ───────────────────────────────────────────────────
function OTPTab({ role, portalConfig }) {
  const { sendOTP, verifyOTP, loading, otpSent } = useAuth()
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')

  const emailForm = useForm({ resolver: zodResolver(otpEmailSchema) })
  const otpForm = useForm({ resolver: zodResolver(otpSchema) })

  const onSendOTP = async (data) => {
    const res = await sendOTP(data.email)
    if (res.success) { setEmail(data.email); setStep('otp') }
  }

  const onVerifyOTP = (data) => verifyOTP({ email, otp: data.otp, role })

  return (
    <div>
      {step === 'email' ? (
        <form onSubmit={emailForm.handleSubmit(onSendOTP)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0B1F3A', marginBottom: 8 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input {...emailForm.register('email')} type="email" id="otp-email" placeholder="you@hospital.com" className="form-input" style={{ paddingLeft: 42 }} />
            </div>
            {emailForm.formState.errors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{emailForm.formState.errors.email.message}</p>}
          </div>
          <button type="submit" id="send-otp-btn" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: `linear-gradient(135deg, ${portalConfig.color}, ${portalConfig.colorLight})`,
            color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading ? 'Sending...' : 'Send OTP'} <KeyRound size={16} />
          </button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={16} color="#10B981" />
            <span style={{ fontSize: 13, color: '#166534' }}>OTP sent to <b>{email}</b></span>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#0B1F3A', marginBottom: 8 }}>Enter 6-Digit OTP</label>
            <input {...otpForm.register('otp')} type="text" id="otp-input" maxLength={6} placeholder="000000" className="form-input" style={{ textAlign: 'center', fontSize: 24, letterSpacing: '0.4em', fontWeight: 700 }} />
            {otpForm.formState.errors.otp && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{otpForm.formState.errors.otp.message}</p>}
          </div>
          <button type="submit" id="verify-otp-btn" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: `linear-gradient(135deg, ${portalConfig.color}, ${portalConfig.colorLight})`,
            color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16,
          }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" onClick={() => setStep('email')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 13 }}>
            ← Back to email
          </button>
        </form>
      )}
    </div>
  )
}

// ── Forgot Password Modal Inline ─────────────────────────────────────
function ForgotPasswordLink({ color }) {
  const [open, setOpen] = useState(false)
  const { forgotPassword, loading } = useAuth()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(forgotSchema) })
  const [sent, setSent] = useState(false)

  const onSubmit = async (data) => {
    const res = await forgotPassword(data.email)
    if (res.success) { setSent(true); reset() }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
        Forgot Password?
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 30px 80px rgba(0,0,0,0.2)' }}
            >
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#0B1F3A', marginBottom: 8 }}>Reset Password</h2>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>Enter your email and we'll send a reset link.</p>

              {sent ? (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                  <CheckCircle size={32} color="#10B981" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#166534', fontWeight: 600 }}>Reset link sent! Check your email.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input {...register('email')} type="email" placeholder="your@email.com" className="form-input" id="forgot-password-email" />
                  {errors.email && <p style={{ color: '#EF4444', fontSize: 12 }}>{errors.email.message}</p>}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={() => setOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '2px solid #E2E8F0', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    <button type="submit" disabled={loading} id="forgot-password-submit" style={{ flex: 1, padding: '12px', borderRadius: 10, background: color, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                      {loading ? 'Sending...' : 'Send Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Main Login Form Component ────────────────────────────────────────
export default function LoginForm({ role, portalConfig }) {
  const [activeTab, setActiveTab] = useState('password')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left Panel – Branding */}
      <div style={{
        background: `linear-gradient(135deg, ${portalConfig.color} 0%, ${portalConfig.colorLight} 100%)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 50px', color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        {/* BG decoration */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 60 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11 8H13V11H16V13H13V16H11V13H8V11H11V8Z" fill="white" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>CarePlus</div>
            <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 600, letterSpacing: '0.08em' }}>HOSPITAL SYSTEM</div>
          </div>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <portalConfig.icon size={36} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 36, lineHeight: 1.1, marginBottom: 16 }}>
            {portalConfig.label}
          </h1>
          <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7, marginBottom: 36, maxWidth: 320 }}>
            {portalConfig.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {portalConfig.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: 0.9 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={12} color="white" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Login Form */}
      <div style={{ background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', overflowY: 'auto' }}>

        {/* Back link */}
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748B', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 40 }}>
          <ArrowLeft size={15} /> Back to Portals
        </Link>

        <div style={{ maxWidth: 400, width: '100%' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 28, color: '#0B1F3A', marginBottom: 8 }}>
            Sign In
          </h2>
          <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32 }}>
            Access your {portalConfig.label.toLowerCase()} portal securely.
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'white', borderRadius: 12, padding: 4, border: '1.5px solid #E2E8F0', marginBottom: 28 }}>
            {['password', 'otp'].map(tab => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 9,
                  border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 14,
                  background: activeTab === tab ? portalConfig.color : 'transparent',
                  color: activeTab === tab ? 'white' : '#64748B',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'password' ? '🔐 Password' : '📱 OTP Login'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'password'
                ? <PasswordTab role={role} portalConfig={portalConfig} />
                : <OTPTab role={role} portalConfig={portalConfig} />
              }
            </motion.div>
          </AnimatePresence>

          <p style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 28, lineHeight: 1.6 }}>
            By signing in, you agree to our{' '}
            <Link to="/terms" style={{ color: portalConfig.color }}>Terms</Link> and{' '}
            <Link to="/privacy" style={{ color: portalConfig.color }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="linear-gradient"][style*="60px 50px"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
