import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Zap, Sparkles, Building, Mail, Phone, Lock,
  CreditCard, CheckCircle2, AlertCircle, ArrowRight, Loader2,
  Calendar, Check, User, Eye, EyeOff
} from 'lucide-react'

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(3, 'Hospital name must be at least 3 characters'),
  code: z.string().min(3, 'Hospital code must be at least 3 characters').regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers allowed'),
  email: z.string().email('Please enter a valid email address'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('India'),
  // Card fields are validated manually per-step and are not re-processed on final submit
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  database_type: z.string().optional(),
  db_host: z.string().optional(),
  db_port: z.any().optional(),
  db_name: z.string().optional(),
  db_user: z.string().optional(),
  db_password: z.string().optional(),
  db_ssl: z.any().optional(),
})


const formatPrice = (price, currency) => {
  const n = Number(price) || 0
  const amount = Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2)
  return !currency || currency === 'USD' ? `$${amount}` : `${currency} ${amount}`
}

// Fallback catalogue — used until live prices are fetched from the Super Admin backend.
const DEFAULT_PLANS = [
  {
    id: 'basic',
    name: '',
    price: "",
    priceLabel: '',
    desc: 'Perfect for small clinics and private practices.',
    color: '#06B6D4',
    features: ['Up to 5 doctors', 'Up to 500 patients', 'Patient Management', 'Appointment System', 'Basic Billing', 'Email Support']
  },
  {
    id: 'standard',
    name: '',
    price: '',
    priceLabel: '',
    desc: 'Ideal for mid-size hospitals and multiple clinics.',
    color: '#0F9D8A',
    features: ['Up to 50 doctors', 'Up to 5,000 patients', 'Pharmacy Module', 'Laboratory Module', 'Analytics Dashboard', 'SMS Notifications', 'Priority Support']
  },
  {
    id: 'enterprise',
    name: '',
    price: "",
    priceLabel: '',
    desc: 'For large hospital networks and medical groups.',
    color: '#6366F1',
    features: ['Unlimited doctors & staff', 'Unlimited patients', 'Custom roles & permissions', 'Dedicated Server Config', 'SLA Uptime Guarantee', '24/7 Phone Support']
  }
]

export default function SubscriptionPage() {
  const location = useLocation()
  const [plans, setPlans] = useState(DEFAULT_PLANS)
  const [selectedPlan, setSelectedPlan] = useState(DEFAULT_PLANS[0])
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [step, setStep] = useState(1) // 1: Details & Plan, 2: Payment, 3: DB Config, 4: Admin Account, 5: Success
  const [loading, setLoading] = useState(false)
  const [registeredData, setRegisteredData] = useState(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('idle') // 'idle' | 'success' | 'error'
  const [connectionMessage, setConnectionMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showDbPassword, setShowDbPassword] = useState(false)
  const [dbTypeSelected, setDbTypeSelected] = useState(false) // tracks if user explicitly picked a DB type
  const [loadingPrices, setLoadingPrices] = useState(true)

  // Fetch live plan prices managed by Super Admin (falls back to defaults on any error)
  useEffect(() => {
    const base = import.meta.env.VITE_SUPER_BACKEND_URL
    if (!base) {
      setLoadingPrices(false)
      return
    }
    axios.get(`${base}/api/public/plans`)
      .then(({ data }) => {
        if (data?.success && Array.isArray(data.data) && data.data.length) {
          const mapped = data.data.map(p => ({
            id: p.plan_key,
            name: p.name,
            price: Number(p.price),
            priceLabel: formatPrice(p.price, p.currency),
            desc: p.description,
            color: p.color,
            features: Array.isArray(p.features) ? p.features : [],
          }))
          setPlans(mapped)
          setSelectedPlan(prev => mapped.find(m => m.id === prev.id) || mapped[0])
        }
      })
      .catch(() => { /* keep default plans */ })
      .finally(() => {
        setLoadingPrices(false)
      })
  }, [])

  // Pre-select plan from location state if coming from Pricing page
  useEffect(() => {
    if (location.state?.planId) {
      const found = plans.find(p => p.id === location.state.planId)
      if (found) setSelectedPlan(found)
    }
  }, [location.state, plans])

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: 'India',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
      database_type: '',
      db_host: '',
      db_port: 3306,
      db_name: '',
      db_user: '',
      db_password: '',
      db_ssl: false,
    }
  })

  const formValues = watch()

  // Determine if the Save & Configure Credentials button should be active
  const dbType = formValues.database_type
  const byodFieldsFilled = !!(formValues.db_host && formValues.db_name && formValues.db_user && formValues.db_password)
  const canProceedDb = dbTypeSelected && (dbType === 'shared' || (dbType === 'external' && byodFieldsFilled))

  // Reset connection status if DB connection credentials change
  useEffect(() => {
    setConnectionStatus('idle')
    setConnectionMessage('')
  }, [formValues.db_host, formValues.db_port, formValues.db_name, formValues.db_user, formValues.db_password, formValues.db_ssl])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors)
      const firstField = Object.keys(errors)[0]
      const msg = errors[firstField]?.message
      if (msg) {
        toast.error(`Validation error in ${firstField}: ${msg}`)
      }
    }
  }, [errors])

  const calculateTotal = () => {
    const rate = selectedPlan.price
    return billingCycle === 'yearly' ? rate * 12 * 0.85 : rate // 15% discount for yearly
  }

  const handleTestConnection = async () => {
    const host = watch('db_host')
    const port = watch('db_port')
    const database_name = watch('db_name')
    const username = watch('db_user')
    const password = watch('db_password')
    const ssl_enabled = watch('db_ssl')

    if (!host || !database_name || !username || !password) {
      setConnectionStatus('error')
      setConnectionMessage('Please fill in all database credential fields to test the connection')
      return
    }

    setTestingConnection(true)
    setConnectionStatus('idle')
    setConnectionMessage('')
    try {
      const res = await axios.post('/api/auth/test-db-connection', {
        host,
        port: parseInt(port) || 3306,
        database_name,
        username,
        password,
        ssl_enabled: !!ssl_enabled
      })

      if (res.data.success) {
        setConnectionStatus('success')
        setConnectionMessage(res.data.message || 'Connection test successful — database credentials are valid')
      } else {
        setConnectionStatus('error')
        setConnectionMessage(res.data.message || 'Database connection failed')
      }
    } catch (err) {
      console.error(err)
      const errMsg = err.response?.data?.message || 'Failed to establish connection to database.'
      setConnectionStatus('error')
      setConnectionMessage(errMsg)
    } finally {
      setTestingConnection(false)
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    const name = watch('name')
    const code = watch('code')
    const email = watch('email')
    const phone = watch('phone')
    const address = watch('address')
    const city = watch('city')
    const state = watch('state')

    if (!name || name.length < 3) return toast.warning('Please enter a valid hospital name')
    if (!code || code.length < 3) return toast.warning('Please enter a valid unique code')
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast.warning('Please enter a valid email address')
    if (!phone || phone.length < 10) return toast.warning('Please enter a valid phone number')
    if (!address || !city || !state) return toast.warning('Please enter hospital address details')

    setStep(2)
  }

  const handlePaymentNext = (e) => {
    e.preventDefault()
    const cardName = watch('cardName')
    const cardNumber = watch('cardNumber')
    const cardExpiry = watch('cardExpiry')
    const cardCvv = watch('cardCvv')

    if (!cardName) return toast.warning('Please enter the cardholder name')
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) return toast.warning('Please enter a valid 16-digit card number')
    if (!cardExpiry || !cardExpiry.includes('/')) return toast.warning('Please enter expiration date (MM/YY)')
    if (!cardCvv || cardCvv.length < 3) return toast.warning('Please enter CVV')

    setStep(3)
  }

  const handleDbNext = (e) => {
    e.preventDefault()
    const dbType = watch('database_type')
    if (dbType === 'external') {
      const host = watch('db_host')
      const name = watch('db_name')
      const user = watch('db_user')
      const password = watch('db_password')
      if (!host) return toast.warning('Please enter the database host IP or address')
      if (!name) return toast.warning('Please enter the database name')
      if (!user) return toast.warning('Please enter the database username')
      if (!password) return toast.warning('Please enter the database password')
    }
    setStep(4)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        name: data.name,
        code: data.code.toUpperCase(),
        email: data.email,
        adminPassword: data.adminPassword,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        plan: selectedPlan.id,
        billingCycle,
        amount: calculateTotal(),
        paymentMethod: 'card',
        database_type: data.database_type,
        db_host: data.db_host,
        db_port: data.db_port,
        db_name: data.db_name,
        db_user: data.db_user,
        db_password: data.db_password,
        db_ssl: data.db_ssl
      }

      const res = await axios.post('/api/auth/subscribe', payload)
      if (res.data.success) {
        setRegisteredData(res.data.data)
        setStep(5)
        toast.success('Hospital database configured and admin account created successfully!')
      }
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Failed to complete registration.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Progress Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)', margin: '0 auto 16px' }}>
            <Sparkles size={13} /> Complete Signup
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 42px)', color: '#0B1F3A', marginBottom: 12 }}>
            Hospital Subscription Checkout
          </h1>
          <p style={{ color: '#64748B', fontSize: 16, fontWeight: 500 }}>
            Configure your tenant, enter payment details, and activate your dashboard.
          </p>

          {/* Steps visualizer */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }} className="steps-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 1 ? '#0F9D8A' : '#E2E8F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= 1 ? '#0B1F3A' : '#64748B' }}>Details</span>
            </div>
            <div style={{ width: 24, height: 2, background: step >= 2 ? '#0F9D8A' : '#E2E8F0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 2 ? '#0F9D8A' : '#E2E8F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {step > 2 ? <Check size={16} /> : '2'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= 2 ? '#0B1F3A' : '#64748B' }}>Payment</span>
            </div>
            <div style={{ width: 24, height: 2, background: step >= 3 ? '#0F9D8A' : '#E2E8F0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 3 ? '#0F9D8A' : '#E2E8F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {step > 3 ? <Check size={16} /> : '3'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= 3 ? '#0B1F3A' : '#64748B' }}>Database</span>
            </div>
            <div style={{ width: 24, height: 2, background: step >= 4 ? '#0F9D8A' : '#E2E8F0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 4 ? '#0F9D8A' : '#E2E8F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {step > 4 ? <Check size={16} /> : '4'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= 4 ? '#0B1F3A' : '#64748B' }}>Credentials</span>
            </div>
            <div style={{ width: 24, height: 2, background: step >= 5 ? '#0F9D8A' : '#E2E8F0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 5 ? '#0F9D8A' : '#E2E8F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                5
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= 5 ? '#0B1F3A' : '#64748B' }}>Activation</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 40 }}
            >
              {/* Plans selection row */}
              <div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18, color: '#0B1F3A', marginBottom: 18 }}>1. Select Your Subscription Plan</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="plans-grid">
                  {plans.map(p => {
                    const isSelected = selectedPlan.id === p.id
                    return (
                      <div
                        key={p.id}
                        onClick={() => !loadingPrices && setSelectedPlan(p)}
                        style={{
                          background: 'white',
                          borderRadius: 24,
                          padding: 28,
                          border: isSelected ? `3px solid ${p.color}` : '2.5px solid #E2E8F0',
                          cursor: loadingPrices ? 'not-allowed' : 'pointer',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? `0 12px 30px ${p.color}15` : '0 4px 12px rgba(0, 0, 0, 0.01)',
                          opacity: loadingPrices ? 0.7 : 1,
                        }}
                        className="plan-card-vertical"
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 16, right: 16,
                            background: p.color, color: 'white', width: 24, height: 24,
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                        <div>
                          <h4 style={{ fontWeight: 800, fontSize: 18, color: '#0B1F3A', marginBottom: 6 }}>
                            {loadingPrices ? 'Loading plan...' : p.name}
                          </h4>
                          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4, marginBottom: 16 }}>{p.desc}</p>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                            <span style={{ fontWeight: 950, fontSize: 32, color: '#0B1F3A' }}>
                              {loadingPrices ? (
                                <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <Loader2 className="animate-spin" size={16} /> Loading...
                                </span>
                              ) : (
                                p.priceLabel
                              )}
                            </span>
                            {!loadingPrices && <span style={{ fontSize: 13, color: '#94A3B8' }}>/ month</span>}
                          </div>

                          {/* Divider */}
                          <div style={{ height: 1.5, background: '#F1F5F9', marginBottom: 20 }} />

                          {/* Features list */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                            {p.features.map(f => (
                              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle2 size={15} color={p.color} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#475569' }}>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={loadingPrices}
                          style={{
                            width: '100%', padding: '11px', borderRadius: 12,
                            border: isSelected ? 'none' : `2px solid ${p.color}`,
                            background: isSelected ? p.color : 'transparent',
                            color: isSelected ? 'white' : p.color,
                            fontWeight: 700, fontSize: 13,
                            cursor: loadingPrices ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {loadingPrices ? 'Please wait...' : (isSelected ? 'Plan Selected' : 'Select Plan')}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Configuration Form & Order Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 32 }} className="split-checkout">
                {/* Form Side */}
                <div style={{ background: 'white', borderRadius: 24, padding: 36, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#0B1F3A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Building color="#0F9D8A" size={22} /> 2. Hospital Configuration
                  </h3>

                  <form className="space-y-4">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Hospital Name *</label>
                        <input {...register('name')} placeholder="St. Marys Hospital" className="form-input" />
                        {errors.name && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Unique Hospital Code *</label>
                        <input {...register('code')} placeholder="SMH001" className="form-input" style={{ textTransform: 'uppercase' }} />
                        <p style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Must be unique letters/numbers used to log into your dashboard portal.</p>
                        {errors.code && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.code.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Email Address *</label>
                      <input {...register('email')} type="email" placeholder="contact@stmarys.com" className="form-input" />
                      {errors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Contact Phone *</label>
                      <input {...register('phone')} placeholder="+91 99999 88888" className="form-input" />
                      {errors.phone && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Hospital Street Address *</label>
                      <input {...register('address')} placeholder="123 Hospital Road, Near City Center" className="form-input" />
                      {errors.address && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.address.message}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>City *</label>
                        <input {...register('city')} placeholder="Mumbai" className="form-input" />
                        {errors.city && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.city.message}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>State *</label>
                        <input {...register('state')} placeholder="Maharashtra" className="form-input" />
                        {errors.state && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.state.message}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Country</label>
                        <input {...register('country')} placeholder="India" className="form-input" readOnly />
                      </div>
                    </div>

                    <div style={{ paddingTop: 20 }}>
                      <button
                        onClick={handleNextStep}
                        disabled={loadingPrices}
                        style={{
                          width: '100%', padding: '14px 28px',
                          background: loadingPrices ? '#94A3B8' : '#0F9D8A',
                          color: 'white', border: 'none', borderRadius: 12,
                          fontWeight: 700, fontSize: 16,
                          cursor: loadingPrices ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          boxShadow: loadingPrices ? 'none' : '0 4px 14px rgba(15,157,138,0.3)'
                        }}
                      >
                        {loadingPrices ? (
                          <>
                            <Loader2 className="animate-spin" size={18} /> Loading Plans & Prices...
                          </>
                        ) : (
                          <>
                            Proceed to Secure Payment <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Billing cycle & Order Summary */}
                <div style={{ background: '#0B1F3A', borderRadius: 24, padding: 28, color: 'white', alignSelf: 'start', position: 'sticky', top: 100 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Order Summary</h4>

                  {/* Cycle Selector */}
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 3, marginBottom: 20 }}>
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, background: billingCycle === 'monthly' ? '#0F9D8A' : 'transparent', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, background: billingCycle === 'yearly' ? '#0F9D8A' : 'transparent', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      Yearly <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 4 }}>Save 15%</span>
                    </button>
                  </div>

                  {/* Calculations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ opacity: 0.8 }}>{loadingPrices ? 'Plan' : selectedPlan.name} ({billingCycle === 'yearly' ? 'Yearly Billing' : 'Monthly Billing'})</span>
                      <span>{loadingPrices ? '...' : `$${selectedPlan.price}.00`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ opacity: 0.8 }}>Setup Fee</span>
                      <span style={{ color: '#10B981', fontWeight: 700 }}>FREE</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                        <span>Yearly Discount (15%)</span>
                        <span>{loadingPrices ? '...' : `-$${(selectedPlan.price * 12 * 0.15).toFixed(0)}.00`}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Total to Pay:</span>
                    <span style={{ fontWeight: 900, fontSize: 24, color: '#10B981' }}>
                      {loadingPrices ? '...' : `$${billingCycle === 'yearly' ? (selectedPlan.price * 12 * 0.85).toFixed(0) : selectedPlan.price}.00`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxWidth: 680, margin: '0 auto', background: 'white', borderRadius: 24, padding: 36, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#0B1F3A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CreditCard color="#0F9D8A" size={22} /> Secure Card Payment
              </h3>
              <p style={{ color: '#64748B', fontSize: 13, marginBottom: 28 }}>Your connection is cryptographically secured. Total price: <b>${calculateTotal()}.00</b></p>

              <form onSubmit={handlePaymentNext} className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Name on Card *</label>
                  <input {...register('cardName')} placeholder="John Doe" className="form-input" />
                  {errors.cardName && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.cardName.message}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Card Number *</label>
                  <input {...register('cardNumber')} placeholder="4111222233334444" maxLength={16} className="form-input" />
                  {errors.cardNumber && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.cardNumber.message}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Expiration Date *</label>
                    <input {...register('cardExpiry')} placeholder="MM/YY" maxLength={5} className="form-input" />
                    {errors.cardExpiry && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.cardExpiry.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>CVV / Security Code *</label>
                    <input {...register('cardCvv')} type="password" placeholder="123" maxLength={3} className="form-input" />
                    {errors.cardCvv && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.cardCvv.message}</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, paddingTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, padding: '14px', border: '2px solid #E2E8F0', background: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Back to Details
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 2, padding: '14px', background: '#0F9D8A', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(15,157,138,0.3)' }}
                  >
                    Verify Payment & Continue <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxWidth: 740, margin: '0 auto', background: 'white', borderRadius: 24, padding: 36, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#0B1F3A', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building color="#0F9D8A" size={22} /> 3. Choose Database Architecture
              </h3>
              <p style={{ color: '#64748B', fontSize: 13, marginBottom: 28 }}>Select how you would like to deploy and run your multi-tenant medical records database.</p>

              <form onSubmit={handleDbNext} className="space-y-6">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="split-checkout">
                  {/* Option 1: Shared DB */}
                  <div
                    onClick={() => { setValue('database_type', 'shared'); setDbTypeSelected(true) }}
                    style={{
                      border: `2px solid ${watch('database_type') === 'shared' ? '#0F9D8A' : '#E2E8F0'}`,
                      background: watch('database_type') === 'shared' ? 'rgba(15,157,138,0.02)' : 'none',
                      borderRadius: 16,
                      padding: 24,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <input
                        type="radio"
                        checked={watch('database_type') === 'shared'}
                        readOnly
                        style={{ accentColor: '#0F9D8A', width: 16, height: 16 }}
                      />
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#0B1F3A' }}>Shared Cloud DB</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                      Recommended for Starter & Standard clinics. Deploy instantly on the secure, fully-managed CarePlus shared MySQL database server. Auto-backups included.
                    </p>
                  </div>

                  {/* Option 2: BYOD */}
                  <div
                    onClick={() => { setValue('database_type', 'external'); setDbTypeSelected(true) }}
                    style={{
                      border: `2px solid ${watch('database_type') === 'external' ? '#0F9D8A' : '#E2E8F0'}`,
                      background: watch('database_type') === 'external' ? 'rgba(15,157,138,0.02)' : 'none',
                      borderRadius: 16,
                      padding: 24,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <input
                        type="radio"
                        checked={watch('database_type') === 'external'}
                        readOnly
                        style={{ accentColor: '#0F9D8A', width: 16, height: 16 }}
                      />
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#0B1F3A' }}>Bring Your Own DB (BYOD)</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                      For Enterprise compliance. Point to your own AWS RDS, Azure SQL, or private MySQL server. Keep your medical charts and patient data completely isolated on your network.
                    </p>
                  </div>
                </div>

                {watch('database_type') === 'external' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: 16,
                      padding: 24,
                      border: '1.5px dashed #E2E8F0',
                      marginTop: 16,
                    }}
                    className="space-y-4"
                  >
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0B1F3A', marginBottom: 10 }}>Configure External DB Credentials</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Database Host / IP *</label>
                        <input {...register('db_host')} placeholder="rds-instance.mysql.amazonaws.com" className="form-input" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Port *</label>
                        <input {...register('db_port')} type="number" placeholder="3306" className="form-input" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Database Name *</label>
                        <input {...register('db_name')} placeholder="careplus_tenant_db" className="form-input" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Database Username *</label>
                        <input {...register('db_user')} placeholder="careplus_admin" className="form-input" />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Database Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input {...register('db_password')} type={showDbPassword ? 'text' : 'password'} placeholder="••••••••••••" className="form-input" style={{ paddingRight: 40 }} />
                        <button
                          type="button"
                          onClick={() => setShowDbPassword(!showDbPassword)}
                          style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4
                          }}
                        >
                          {showDbPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" id="db_ssl" {...register('db_ssl')} style={{ width: 15, height: 15, accentColor: '#0F9D8A' }} />
                      <label htmlFor="db_ssl" style={{ fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Require Secure SSL Connection</label>
                    </div>

                    <div style={{ paddingTop: 16 }}>
                      <button
                        type="button"
                        disabled={testingConnection}
                        onClick={handleTestConnection}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(99, 102, 241, 0.08)',
                          border: '1.5px solid rgba(99, 102, 241, 0.3)',
                          color: '#6366F1',
                          borderRadius: 12,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: testingConnection ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          transition: 'all 0.2s',
                        }}
                      >
                        {testingConnection ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                        {testingConnection ? 'Testing DB Connection...' : 'Test Connection Settings'}
                      </button>
                    </div>

                    {connectionStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          marginTop: 12,
                          padding: '12px 16px',
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          fontSize: 13,
                          lineHeight: 1.4,
                          fontWeight: 500,
                          background: connectionStatus === 'success' ? '#ECFDF5' : '#FEF2F2',
                          border: `1px solid ${connectionStatus === 'success' ? '#A7F3D0' : '#FECACA'}`,
                          color: connectionStatus === 'success' ? '#065F46' : '#991B1B',
                        }}
                      >
                        {connectionStatus === 'success' ? (
                          <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
                        ) : (
                          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
                        )}
                        <span>{connectionMessage}</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 20 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{ flex: 1, padding: '14px', border: '2px solid #E2E8F0', background: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Back to Payment
                    </button>
                    <button
                      type="submit"
                      disabled={!canProceedDb}
                      title={
                        !dbTypeSelected
                          ? 'Please select a database type to continue'
                          : dbType === 'external' && !byodFieldsFilled
                            ? 'Please fill in all database credential fields'
                            : ''
                      }
                      style={{
                        flex: 2,
                        padding: '14px',
                        background: canProceedDb ? '#0F9D8A' : '#CBD5E1',
                        color: canProceedDb ? 'white' : '#94A3B8',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: canProceedDb ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: canProceedDb ? '0 4px 14px rgba(15,157,138,0.3)' : 'none',
                        transition: 'all 0.25s ease',
                        opacity: canProceedDb ? 1 : 0.7,
                      }}
                    >
                      Save & Configure Credentials <ArrowRight size={18} />
                    </button>
                  </div>
                  {/* Inline hint when button is disabled */}
                  {!canProceedDb && (
                    <p style={{ textAlign: 'right', fontSize: 12, color: '#94A3B8', fontWeight: 500, margin: 0 }}>
                      {!dbTypeSelected
                        ? '⬆ Please select a database type above to continue'
                        : dbType === 'external' && !byodFieldsFilled
                          ? '⬆ Fill in all BYOD credential fields (Host, DB Name, Username, Password) to continue'
                          : ''}
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxWidth: 580, margin: '0 auto', background: 'white', borderRadius: 24, padding: 36, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#0B1F3A', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail color="#0F9D8A" size={22} /> 4. Create Owner Admin Credentials
              </h3>
              <p style={{ color: '#64748B', fontSize: 13, marginBottom: 28 }}>Configure your primary login email and secure administrator credentials for accessing the CarePlus Hospital portals.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Admin Email Address *</label>
                  <input {...register('email')} type="email" placeholder="admin@stmarys.com" className="form-input" />
                  {errors.email && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Admin Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input {...register('adminPassword')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="form-input" style={{ paddingRight: 40 }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.adminPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.adminPassword.message}</p>}
                </div>

                <div style={{ display: 'flex', gap: 16, paddingTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{ flex: 1, padding: '14px', border: '2px solid #E2E8F0', background: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Back to DB Setup
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ flex: 2, padding: '14px', background: '#0F9D8A', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(15,157,138,0.3)' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {loading ? 'Initializing Hospital Tables...' : `Create Account & Deploy Dashboard`}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 5 && registeredData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ maxWidth: 640, margin: '0 auto', background: 'white', borderRadius: 28, padding: 40, border: '1px solid #BBF7D0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', textAlign: 'center' }}
            >
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#F0FDF4', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 26, color: '#0B1F3A', marginBottom: 8 }}>Hospital Activated Successfully!</h2>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 32 }}>Your multi-tenant database tables and admin configuration have been deployed.</p>

              {/* Credential summary box */}
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: 24, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>HOSPITAL CODE:</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#0F9D8A', fontFamily: 'monospace' }}>{registeredData.code}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>ADMIN LOGIN EMAIL:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A' }}>{formValues.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>PLAN CHOSEN:</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#6366F1', textTransform: 'uppercase' }}>{selectedPlan.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>TRANSACTION ID:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0B1F3A', fontFamily: 'monospace' }}>{registeredData.transactionId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a
                  href={`${import.meta.env.VITE_ADMIN_URL || 'https://health-dashboards-hospital-admin-fr.vercel.app'}/login`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: '#0F9D8A', color: 'white', fontWeight: 700, borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(15,157,138,0.3)' }}
                >
                  Go to Hospital Admin Portal <ArrowRight size={18} />
                </a>
                <Link to="/" style={{ color: '#64748B', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Back to Homepage</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
        @media (max-width: 900px) {
          .split-checkout {
            grid-template-columns: 1fr !important;
          }
          .plans-grid {
            grid-template-columns: 1fr !important;
          }
          .steps-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .steps-container > div[style*="width: 24"] {
            display: none !important;
          }
        }
      `}</style>
      </div>
    </div>
  )
}
