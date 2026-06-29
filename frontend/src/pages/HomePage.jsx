import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ChevronRight, Shield, Stethoscope, UserCheck,
  Pill, FlaskConical, User, Users, Building2, Lock, LayoutGrid,
  Calendar, FileText, CreditCard, Bell, BarChart3, Package,
  KeyRound, ClipboardList, Beaker, Activity, Zap,
  HeartPulse, CheckCircle2, Star, TrendingUp
} from 'lucide-react'

// ─── Animated Counter ───────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const startTime = Date.now()
    const endValue = parseInt(target)
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * endValue))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(endValue)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const getMockData = (portalId) => {
  switch (portalId) {
    case 'admin':
      return {
        title: 'System Operations Control Desk',
        stat1: '4 Active Admin Sessions',
        stat2: 'Firewall & SSL Active (0 warnings)',
        tasks: [
          'Manage system settings and configurations',
          'Audit database activity logs',
          'Deploy emergency backup protocol'
        ]
      }
    case 'doctor':
      return {
        title: 'Clinical Consultation Panel',
        stat1: '48 Active Specialists On-Duty',
        stat2: '16 Patients in Queue (Ward B)',
        tasks: [
          'Review electronic health records (EMR)',
          'Fulfill diagnostic lab panels',
          'Issue digitally signed e-prescriptions (e-Rx)'
        ]
      }
    case 'nurse':
      return {
        title: 'Nursing Care Station',
        stat1: '78% ICU Bed Occupancy Rate',
        stat2: '2 Urgent transfers pending authorization',
        tasks: [
          'Log hourly patient vitals tracker',
          'Coordinate medicine shift administration',
          'Complete nurse ward handover checklist'
        ]
      }
    case 'pharmacy':
      return {
        title: 'Pharmacy Dispensary Desk',
        stat1: '1,429 Prescriptions Fulfilled Today',
        stat2: '0 Drug inventory warnings',
        tasks: [
          'Verify and dispense digital prescriptions',
          'Procure cold-chain medical inventory stock',
          'Process batch safety inspection alerts'
        ]
      }
    case 'laboratory':
      return {
        title: 'Laboratory Diagnostics Center',
        stat1: '210 Pathology Samples Logged Today',
        stat2: 'Chemistry Analyzer Calibrated',
        tasks: [
          'Process diagnostic pathology batches',
          'Generate and sign laboratory test results',
          'Distribute critical alerts to specialists'
        ]
      }
    case 'patient':
      return {
        title: 'Patient Personal Health Suite',
        stat1: '15,420 Patients Enrolled',
        stat2: 'Insurance sync active',
        tasks: [
          'Book consultation appointments online',
          'Download pathology reports and prescriptions',
          'Consult billing invoices and payments history'
        ]
      }
    default:
      return {
        title: 'CarePlus Secure Workspace',
        stat1: 'System fully operational',
        stat2: 'Zero active alerts',
        tasks: ['Select a workspace role from the menu']
      }
  }
}

// ─── Dashboard Portal Cards ──────────────────────────────────────────
const portals = [
  {
    id: 'admin', icon: Shield, label: 'Admin Dashboard', color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.1)',
    desc: 'Super admin control panel to manage hospital, users, and all departments.',
    to: import.meta.env.VITE_ADMIN_URL || 'https://health-dashboards-hospital-admin-fr.vercel.app',
  },
  {
    id: 'doctor', icon: Stethoscope, label: 'Doctors Dashboard', color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.1)',
    desc: 'Manage appointments, patients, prescriptions and medical records.',
    to: import.meta.env.VITE_DOCTOR_URL || 'https://health-dashboards-doctor-frontend.vercel.app',
  },
  {
    id: 'nurse', icon: UserCheck, label: 'Nurses Dashboard', color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.1)',
    desc: 'Manage patient care, vitals, treatment and nursing tasks.',
    to: import.meta.env.VITE_NURSE_URL || 'https://health-dashboards-nurse-frontend.vercel.app',
  },
  {
    id: 'pharmacy', icon: Pill, label: 'Pharmacy Dashboard', color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.1)',
    desc: 'Manage prescriptions, medicine inventory, orders and stock.',
    to: import.meta.env.VITE_PHARMACY_URL || 'https://health-dashboards-pharma-frontend.vercel.app',
  },
  {
    id: 'laboratory', icon: FlaskConical, label: 'Laboratory Dashboard', color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.1)',
    desc: 'Manage lab tests, reports, samples and laboratory operations.',
    to: import.meta.env.VITE_LAB_URL || '/laboratory/login',
  },
  {
    id: 'patient', icon: User, label: 'Patient Portal', color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.1)',
    desc: 'View appointments, reports, prescriptions and medical history.',
    to: import.meta.env.VITE_PATIENT_URL || 'https://health-dashboards-patient-frontend.vercel.app',
  },
]

// ─── Features ────────────────────────────────────────────────────────
const features = [
  { icon: Users, label: 'Patient Management', desc: 'Complete patient records with history, allergies and vitals tracking.', color: '#0F9D8A' },
  { icon: Calendar, label: 'Appointment Management', desc: 'Smart scheduling with token system and queue management.', color: '#6366F1' },
  { icon: FileText, label: 'EMR Records', desc: 'Electronic Medical Records with secure access and audit trails.', color: '#8B5CF6' },
  { icon: Pill, label: 'Pharmacy Management', desc: 'Prescription processing, inventory control and drug alerts.', color: '#F59E0B' },
  { icon: Beaker, label: 'Laboratory Management', desc: 'Lab test orders, sample tracking, and report generation.', color: '#10B981' },
  { icon: CreditCard, label: 'Billing & Payments', desc: 'Automated billing, insurance claims and payment tracking.', color: '#EF4444' },
  { icon: Bell, label: 'Notifications', desc: 'Real-time alerts for appointments, lab results and emergencies.', color: '#06B6D4' },
  { icon: BarChart3, label: 'Analytics', desc: 'Hospital performance dashboards and operational insights.', color: '#0B1F3A' },
  { icon: Package, label: 'Inventory Management', desc: 'Medical supplies, equipment tracking and procurement alerts.', color: '#F97316' },
  { icon: KeyRound, label: 'Role Management', desc: 'Granular permissions and role-based access control (RBAC).', color: '#EC4899' },
]

// ─── Workflow Steps ───────────────────────────────────────────────────
const workflow = [
  { icon: User, label: 'Patient Registration', desc: 'Patient visits and is registered in the system', color: '#06B6D4' },
  { icon: Calendar, label: 'Appointment Booking', desc: 'Doctor appointment is scheduled', color: '#6366F1' },
  { icon: ClipboardList, label: 'Token Generated', desc: 'Queue token issued for waiting management', color: '#8B5CF6' },
  { icon: HeartPulse, label: 'Nurse Vitals', desc: 'Nurse records vitals and initial assessment', color: '#F97316' },
  { icon: Stethoscope, label: 'Doctor Consultation', desc: 'Doctor examines and diagnoses the patient', color: '#0F9D8A' },
  { icon: FileText, label: 'Prescription', desc: 'Digital prescription issued to patient', color: '#10B981' },
  { icon: Pill, label: 'Pharmacy', desc: 'Medicines dispensed from pharmacy', color: '#F59E0B' },
  { icon: CreditCard, label: 'Billing', desc: 'Invoice generated and payment processed', color: '#EF4444' },
  { icon: BarChart3, label: 'Reports', desc: 'Visit summary and reports finalized', color: '#0B1F3A' },
]

// ─── Modules ─────────────────────────────────────────────────────────
const modules = [
  'Authentication', 'Patients', 'Doctors', 'Nurses',
  'Pharmacy', 'Laboratory', 'Billing', 'Reports',
  'Notifications', 'Analytics', 'Audit Logs', 'Inventory',
  'Appointments', 'Queue Management',
]

const moduleColors = [
  '#0F9D8A', '#6366F1', '#8B5CF6', '#F59E0B',
  '#10B981', '#06B6D4', '#EF4444', '#0B1F3A',
  '#F97316', '#EC4899', '#14B8A6', '#64748B',
  '#8B5CF6', '#0F9D8A',
]

const stats = [
  { icon: LayoutGrid, value: '25', suffix: '+', label: 'Modules', color: '#0F9D8A' },
  { icon: Users, value: '5000', suffix: '+', label: 'Happy Users', color: '#2563EB' },
  { icon: Building2, value: '50', suffix: '+', label: 'Hospitals', color: '#8B5CF6' },
  { icon: Lock, value: '100', suffix: '%', label: 'Secure', color: '#EA580C' },
]

// ─── Fade-in animation wrapper ────────────────────────────────────────
function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Main Home Page ───────────────────────────────────────────────────
export default function HomePage() {
  const [activePortalId, setActivePortalId] = useState('doctor')

  return (
    <div>
      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="hero-gradient" style={{
        padding: '140px 24px 80px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* BG Circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(15,157,138,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(6,182,212,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 50, alignItems: 'center' }}>

            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#FFFFFF', border: '1.5px solid #CBD5E1',
                  borderRadius: 100, padding: '8px 18px', marginBottom: 24,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                }}>
                  <HeartPulse size={14} color="#0F9D8A" />
                  <span style={{ color: '#0F9D8A', fontSize: 13, fontWeight: 700 }}>Smart Healthcare, Better Life</span>
                </div>

                <h1 style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 'clamp(40px, 4.5vw, 56px)',
                  fontWeight: 800,
                  color: '#0B1F3A',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: 24,
                }}>
                  Smart Hospital{' '}
                  <span style={{
                    color: '#00796B',
                    display: 'block',
                    marginTop: 4
                  }}>
                    Management Automation
                  </span>
                </h1>

                <p style={{ color: '#64748B', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                  A comprehensive, secure and efficient solution to manage all hospital operations seamlessly. Connect all departments, improve patient care and streamline workflows.
                </p>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
                  {stats.map(s => (
                    <div key={s.label} style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: 16,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    }}>
                      <div style={{
                        width: 40, height: 40,
                        borderRadius: '50%',
                        background: `${s.color}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <s.icon size={18} color={s.color} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', color: '#0B1F3A', lineHeight: 1.1 }}>
                          <AnimatedCounter target={s.value} suffix={s.suffix} />
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link
                    to="/login"
                    id="hero-login-btn"
                    style={{
                      background: '#0F9D8A',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '14px 28px',
                      fontWeight: 700,
                      fontSize: '15px',
                      boxShadow: '0 4px 20px rgba(15, 157, 138, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 157, 138, 0.35)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 157, 138, 0.25)'
                    }}
                  >
                    Login to Dashboards <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/features"
                    id="hero-features-btn"
                    style={{
                      background: 'transparent',
                      color: '#0F9D8A',
                      border: '2px solid #0F9D8A',
                      borderRadius: '12px',
                      padding: '14px 28px',
                      fontWeight: 700,
                      fontSize: '15px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#0F9D8A'
                      e.currentTarget.style.color = 'white'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#0F9D8A'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Explore Features <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right – Hospital Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative' }}
            >
              {/* Floating Rating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: -25,
                  background: 'white',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  boxShadow: '0 10px 25px rgba(15, 157, 138, 0.12)',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  zIndex: 10,
                }}
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Star size={18} fill="#10B981" color="#10B981" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0B1F3A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>4.9/5</span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Hospital Rating</span>
                </div>
              </motion.div>

              {/* Outer organic cyan shape container */}
              <div style={{
                background: 'linear-gradient(135deg, #E6F4F2 0%, #CBE7E5 100%)',
                borderRadius: '36px',
                padding: '20px',
                boxShadow: '0 20px 50px rgba(15,157,138,0.05)',
              }}>
                <div style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}>
                  <img
                    src="/hospital-hero.png"
                    alt="CarePlus Hospital Building"
                    style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 420 }}
                  />

                  {/* Dark Glassmorphism Overlay Feature Banner inside Image */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(15, 32, 54, 0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    zIndex: 2,
                  }}>
                    {[
                      { icon: Zap, label: 'All-in-One', sub: 'Solution' },
                      { icon: Activity, label: 'Real-time', sub: 'Updates' },
                      { icon: Lock, label: 'Data', sub: 'Security' },
                      { icon: TrendingUp, label: 'Better', sub: 'Analytics' },
                    ].map((b) => (
                      <div key={b.label} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flex: 1,
                        justifyContent: 'center',
                      }}>
                        <b.icon size={16} color="#FFFFFF" style={{ opacity: 0.95 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 500, lineHeight: 1.1 }}>{b.label}</span>
                          <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700, lineHeight: 1.1 }}>{b.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════ DASHBOARD ACCESS CARDS ══════════════ */}
      <section style={{ padding: '96px 24px', background: '#F8FAFC', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="section-tag"><LayoutGrid size={13} /> Portal Access</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 40, height: 2, background: '#0F9D8A' }} />
                <h2 className="section-title" style={{ margin: 0 }}>Interactive Portals Console</h2>
                <div style={{ width: 40, height: 2, background: '#0F9D8A' }} />
              </div>
              <p className="section-subtitle">Select a department below to explore its live status, metrics, and log in securely.</p>
            </div>
          </FadeInSection>

          {/* Premium Selector Grid */}
          <div className="console-grid">
            
            {/* Left Side: Interactive Portal Options */}
            <div className="console-menu">
              {portals.map((portal) => {
                const isActive = activePortalId === portal.id
                return (
                  <div
                    key={portal.id}
                    onClick={() => setActivePortalId(portal.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: `1.5px solid ${isActive ? portal.color : '#E2E8F0'}`,
                      background: isActive ? `${portal.color}05` : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: isActive ? `0 8px 20px ${portal.color}08` : '0 2px 8px rgba(0,0,0,0.01)',
                      transform: isActive ? 'scale(1.02)' : 'none',
                    }}
                    className="console-menu-item"
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = portal.color
                        e.currentTarget.style.background = `${portal.color}02`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#E2E8F0'
                        e.currentTarget.style.background = '#FFFFFF'
                      }
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: portal.bg,
                      color: portal.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}
                    className="console-icon-box"
                    >
                      <portal.icon size={20} />
                    </div>

                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: '15px',
                        fontWeight: 800,
                        color: '#0B1F3A',
                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                      }}>
                        {portal.label}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                        Click to explore status
                      </span>
                    </div>

                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isActive ? portal.color : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                    }}>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Side: Virtual Interactive Dashboard Mockup */}
            <div className="console-display">
              <AnimatePresence mode="wait">
                {portals.filter(p => p.id === activePortalId).map((activePortal) => {
                  const mockData = getMockData(activePortal.id)

                  return (
                    <motion.div
                      key={activePortal.id}
                      initial={{ opacity: 0, scale: 0.96, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -15 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      {/* Browser Header Bar */}
                      <div style={{
                        background: '#0F172A',
                        borderBottom: '1px solid #1E293B',
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '20px 20px 0 0',
                      }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: '#64748B',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          fontFamily: 'monospace',
                        }}>
                          SECURED WORKSPACE // {activePortal.id.toUpperCase()}_NODE
                        </span>
                        <span style={{ width: 30 }} />
                      </div>

                      {/* Mock Screen Content */}
                      <div style={{
                        background: '#0B132B',
                        flex: 1,
                        padding: '24px 28px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '0 0 20px 20px',
                        border: '1px solid #1E293B',
                        borderTop: 'none',
                        boxShadow: `0 20px 40px ${activePortal.color}05`,
                        textAlign: 'left',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {/* Shifting Gradient Glow */}
                        <div style={{
                          position: 'absolute',
                          top: '-30%',
                          right: '-30%',
                          width: '100%',
                          height: '80%',
                          background: `radial-gradient(circle, ${activePortal.color}15 0%, transparent 70%)`,
                          pointerEvents: 'none',
                        }} />

                        {/* Title Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, zIndex: 2 }}>
                          <div>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: activePortal.color,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                            }}>
                              Live Dashboard Status
                            </span>
                            <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 900, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                              {mockData.title}
                            </h3>
                          </div>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '100px',
                            padding: '4px 12px',
                            color: '#10B981',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}>
                            ● SECURE ONLINE
                          </span>
                        </div>

                        {/* Status Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24, zIndex: 2 }} className="console-stats-grid">
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', padding: '12px 14px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>System Session</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>{mockData.stat1}</div>
                          </div>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', padding: '12px 14px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Operational Alert</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B', marginTop: 4 }}>{mockData.stat2}</div>
                          </div>
                        </div>

                        {/* Actions Panel */}
                        <div style={{ marginBottom: 24, zIndex: 2 }}>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                            Quick Access Modules
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {mockData.tasks.map((task, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                fontSize: '13px',
                                color: '#94A3B8',
                                fontWeight: 500,
                                padding: '8px 12px',
                                background: 'rgba(255, 255, 255, 0.01)',
                                border: '1px solid rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px'
                              }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: activePortal.color }} />
                                {task}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Login CTA */}
                        <div style={{ marginTop: 'auto', zIndex: 2 }}>
                          {(() => {
                            const isExternal = activePortal.to.startsWith('http');
                            const LinkComponent = isExternal ? 'a' : Link;
                            const linkProps = isExternal ? { href: activePortal.to } : { to: activePortal.to };
                            return (
                              <LinkComponent
                                id={`portal-console-login-${activePortal.id}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  width: '100%',
                                  padding: '14px',
                                  borderRadius: '12px',
                                  background: activePortal.color,
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '14px',
                                  textDecoration: 'none',
                                  boxShadow: `0 8px 20px ${activePortal.color}25`,
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.filter = 'brightness(1.1)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.filter = 'none';
                                  e.currentTarget.style.transform = 'none';
                                }}
                                {...linkProps}
                              >
                                Enter {activePortal.label} Securely <ArrowRight size={15} />
                              </LinkComponent>
                            );
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <style>{`
          .console-grid {
            display: grid;
            grid-template-columns: 1fr 1.25fr;
            gap: 32px;
            max-width: 1100px;
            width: 100%;
            margin: 0 auto;
            align-items: stretch;
          }
          .console-menu {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .console-display {
            min-height: 480px;
          }
          @media (max-width: 900px) {
            .console-grid {
              grid-template-columns: 1fr;
            }
            .console-display {
              min-height: 440px;
            }
          }
          @media (max-width: 600px) {
            .console-stats-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ══════════════ FEATURES SECTION ══════════════ */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag"><Zap size={13} /> Core Features</div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>Everything You Need</h2>
              <p className="section-subtitle">Powerful tools built for modern hospital management and care excellence</p>
            </div>
          </FadeInSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <FadeInSection key={f.label} delay={i * 0.05}>
                <div className="hover-card" style={{
                  background: '#F8FAFC', borderRadius: 16, padding: '24px 20px',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${f.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0B1F3A' }}>{f.label}</h3>
                  <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <CheckCircle2 size={13} color={f.color} />
                    <span style={{ fontSize: 12, color: f.color, fontWeight: 600 }}>Available</span>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WORKFLOW SECTION ══════════════ */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(180deg, #FFFFFF 0%, #EBF6FA 50%, #FFFFFF 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)' }}>
                <Activity size={13} /> Patient Journey
              </div>
              <h2 className="section-title" style={{ color: '#0B1F3A', marginBottom: 12 }}>How It Works</h2>
              <p className="section-subtitle" style={{ color: '#64748B' }}>Follow a patient's complete journey through the CarePlus ecosystem</p>
            </div>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {workflow.map((step, i) => (
              <FadeInSection key={step.label} delay={i * 0.07}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24,
                    alignItems: 'center', width: '100%', maxWidth: 640,
                  }}>
                    {/* Left label (odd) */}
                    {i % 2 === 0 ? (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#0B1F3A', marginBottom: 4 }}>{step.label}</div>
                        <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{step.desc}</div>
                      </div>
                    ) : <div />}

                    {/* Icon circle */}
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, position: 'relative',
                      boxShadow: `0 8px 20px ${step.color}25`,
                    }}>
                      <step.icon size={24} color="white" />
                      <div style={{
                        position: 'absolute', top: -8, right: -8,
                        width: 22, height: 22, borderRadius: '50%',
                        background: '#FFFFFF', border: `2px solid ${step.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800, color: step.color,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      }}>
                        {i + 1}
                      </div>
                    </div>

                    {/* Right label (even) */}
                    {i % 2 !== 0 ? (
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#0B1F3A', marginBottom: 4 }}>{step.label}</div>
                        <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{step.desc}</div>
                      </div>
                    ) : <div />}
                  </div>

                  {/* Connector line */}
                  {i < workflow.length - 1 && (
                    <div style={{
                      width: 2, height: 40, margin: '4px 0',
                      background: 'linear-gradient(to bottom, #CBD5E1, #E2E8F0)',
                    }} />
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ MODULES SECTION ══════════════ */}
      <section style={{ padding: '96px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag"><Package size={13} /> Platform Modules</div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>All Modules Included</h2>
              <p className="section-subtitle">25+ integrated modules covering every aspect of hospital management</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              {modules.map((mod, i) => (
                <motion.div
                  key={mod}
                  whileHover={{ scale: 1.06, y: -2 }}
                  style={{
                    padding: '12px 22px', borderRadius: 100,
                    background: 'white', border: `2px solid ${moduleColors[i]}30`,
                    color: moduleColors[i], fontWeight: 600, fontSize: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    cursor: 'default', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <CheckCircle2 size={14} />
                  {mod}
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ══════════════ CTA BANNER ══════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #EBF8F7 0%, #D1F2EE 100%)',
        padding: '80px 24px', textAlign: 'center',
        borderTop: '1px solid #E2E8F0',
      }}>
        <FadeInSection>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 950,
              fontSize: 'clamp(30px, 4.5vw, 44px)', color: '#0B1F3A', marginBottom: 16,
              letterSpacing: '-0.02em',
            }}>
              Ready to Digitize Your Hospital?
            </h2>
            <p style={{ color: '#475569', fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 540, margin: '0 auto 36px', fontWeight: 500 }}>
              Join 50+ hospitals already using CarePlus to streamline operations, improve patient care, and boost efficiency.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" id="cta-login-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 12,
                background: '#0F9D8A', color: 'white',
                fontWeight: 700, fontSize: 16, textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(15,157,138,0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 35px rgba(15,157,138,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(15,157,138,0.25)'
              }}
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/contact" id="cta-contact-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 12,
                background: 'transparent',
                border: '2px solid #0F9D8A',
                color: '#0F9D8A', fontWeight: 700, fontSize: 16, textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#0F9D8A'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#0F9D8A'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  )
}
