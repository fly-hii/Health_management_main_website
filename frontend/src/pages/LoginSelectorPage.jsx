import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Stethoscope, UserCheck, Pill, FlaskConical, User,
  ArrowRight, LayoutDashboard
} from 'lucide-react'

const portals = [
  {
    id: 'patient',
    icon: User,
    label: 'Patient Portal',
    subtitle: 'Access Your Health Suite',
    desc: 'Book appointments, view medical reports, and check prescriptions.',
    color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.08)',
    to: 'https://health-dashboards-patient-frontend.vercel.app',
    badge: 'PATIENT ACCESS',
    stats: {
      title: 'Patient Portal Stats',
      metrics: [
        { label: 'Registered Patients', value: '15,420+' },
        { label: 'Average Appt Wait Time', value: '< 10 mins' },
        { label: 'Patient Satisfaction', value: '99.2%' }
      ],
      tip: 'Verify your insurance status inside for faster check-ins.'
    }
  },
  {
    id: 'doctor',
    icon: Stethoscope,
    label: 'Doctor Portal',
    subtitle: 'Clinical Workspace',
    desc: 'Manage appointment queues, update patient charts, and issue prescriptions.',
    color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.08)',
    to: 'https://health-dashboards-doctor-frontend.vercel.app',
    badge: 'CLINICAL DEPT',
    stats: {
      title: 'Clinical Operations',
      metrics: [
        { label: 'Active Specialists', value: '48 On-Duty' },
        { label: 'Today\'s Consultations', value: '382 Completed' },
        { label: 'E-Prescriptions Sent', value: '1,290+' }
      ],
      tip: 'Check your schedule updates in real-time.'
    }
  },
  {
    id: 'nurse',
    icon: UserCheck,
    label: 'Nurse Portal',
    subtitle: 'Ward Coordination',
    desc: 'Record clinical vitals, manage ward status, and coordinate care schedules.',
    color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.08)',
    to: 'https://health-dashboards-nurse-frontend.vercel.app',
    badge: 'NURSING & WARD',
    stats: {
      title: 'Nursing Stations',
      metrics: [
        { label: 'Active Vitals Logged', value: '298 Today' },
        { label: 'Patient Transfers Pending', value: '2 Queue' },
        { label: 'ICU Bed Occupancy', value: '78%' }
      ],
      tip: 'Handover logs must be submitted before shift end.'
    }
  },
  {
    id: 'pharmacy',
    icon: Pill,
    label: 'Pharmacy Portal',
    subtitle: 'Inventory & Dispensing',
    desc: 'Fulfill prescriptions, track stock levels, and coordinate drug batches.',
    color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.08)',
    to: 'https://health-dashboards-pharma-frontend.vercel.app',
    badge: 'DISPENSARY',
    stats: {
      title: 'Pharmacy Inventory',
      metrics: [
        { label: 'Prescriptions Processed', value: '1,429 Today' },
        { label: 'Critical Inventory Alerts', value: '0 Warnings' },
        { label: 'Active Suppliers Online', value: '12 Connected' }
      ],
      tip: 'Verify lot numbers for all incoming cold-storage supplies.'
    }
  },
  {
    id: 'laboratory',
    icon: FlaskConical,
    label: 'Laboratory Portal',
    subtitle: 'Diagnostics & Reports',
    desc: 'Pathology samples tracking, testing logs, and diagnostic reports.',
    color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.08)',
    to: '/laboratory/login',
    badge: 'DIAGNOSTICS',
    stats: {
      title: 'Laboratory Operations',
      metrics: [
        { label: 'Samples Processed', value: '210 Today' },
        { label: 'Average Pathology Cycle', value: '1.5 hrs' },
        { label: 'Critical Alerts Dispatched', value: '3 Confirmed' }
      ],
      tip: 'Calibrate chemistry analyzers every morning before 08:00.'
    }
  },
  {
    id: 'admin',
    icon: Shield,
    label: 'Admin Control Center',
    subtitle: 'System Administration',
    desc: 'Audit system logs, configure user roles, and manage hospital settings.',
    color: '#0F9D8A',
    bg: 'rgba(15, 157, 138, 0.08)',
    to: 'https://health-dashboards-hospital-admin-fr.vercel.app',
    badge: 'SYS ADMIN',
    stats: {
      title: 'System Health & Security',
      metrics: [
        { label: 'Security Firewall', value: 'SSL Active' },
        { label: 'System Uptime Rate', value: '99.998%' },
        { label: 'Active Admin Sessions', value: '4 Secured' }
      ],
      tip: 'All administration actions are cryptographically logged.'
    }
  }
]

export default function LoginSelectorPage() {
  const [hoveredId, setHoveredId] = useState('patient')
  const activePortal = portals.find(p => p.id === hoveredId) || portals[0]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}
    className="login-selector-container"
    >
      {/* Header Container */}
      <div style={{
        maxWidth: 1100,
        width: '100%',
        margin: '0 auto 40px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0F9D8A"/>
            <path d="M11 7h2v3h3v2h-3v3h-2v-3H8v-2h3V7z" fill="white"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 24, color: '#0B1F3A', lineHeight: 1.1 }}>CarePlus</div>
            <div style={{ fontSize: 11, color: '#0B1F3A', fontWeight: 700, letterSpacing: '0.12em', marginTop: 2 }}>HOSPITAL SYSTEM</div>
          </div>
        </Link>

        {/* Back Link */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: '#0F9D8A',
          fontSize: 14,
          fontWeight: 700,
        }}>
          Back to Homepage <ArrowRight size={14} />
        </Link>
      </div>

      {/* Intro Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px auto' }} className="header-intro">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(15,157,138,0.08)', border: '1px solid rgba(15,157,138,0.15)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 16,
        }}>
          <LayoutDashboard size={13} color="#0F9D8A" />
          <span style={{ color: '#0F9D8A', fontSize: 13, fontWeight: 700 }}>Hospital Administration Hub</span>
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(28px, 3.5vw, 36px)', color: '#0B1F3A', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Select Portal Logins
        </h1>
        <p style={{ color: '#64748B', fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>
          Access your designated hospital workspace using cryptographically secured credentials
        </p>
      </div>

      {/* Main Splitscreen / Interactive Panel */}
      <div className="portal-layout">
        
        {/* Left Side: Live Preview Panel */}
        <div className="preview-panel">
          {/* Glowing Radial Circle */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '140%',
            height: '60%',
            background: `radial-gradient(circle, ${activePortal.color}18 0%, transparent 70%)`,
            pointerEvents: 'none',
            transition: 'background 0.5s ease',
          }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activePortal.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Badge */}
              <div style={{
                alignSelf: 'flex-start',
                padding: '6px 12px',
                borderRadius: 100,
                background: `${activePortal.color}20`,
                border: `1px solid ${activePortal.color}40`,
                fontSize: 10,
                fontWeight: 800,
                color: activePortal.color,
                letterSpacing: '0.1em',
                marginBottom: 24,
              }}>
                {activePortal.badge}
              </div>

              {/* Big Icon Container */}
              <div style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activePortal.color,
                marginBottom: 20,
                boxShadow: `0 10px 25px ${activePortal.color}15`
              }}>
                <activePortal.icon size={34} />
              </div>

              {/* Info */}
              <h3 style={{
                fontSize: 22,
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 6,
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
                {activePortal.label}
              </h3>
              <p style={{
                fontSize: 13.5,
                color: '#94A3B8',
                fontWeight: 500,
                lineHeight: 1.6,
                marginBottom: 32,
              }}>
                {activePortal.desc}
              </p>

              {/* Metrics */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 'auto',
                marginBottom: 'auto',
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Live Portal Metrics
                </div>
                {activePortal.stats.metrics.map((m, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    borderRadius: 12,
                  }}>
                    <span style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500 }}>{m.label}</span>
                    <span style={{ fontSize: 13.5, color: '#FFFFFF', fontWeight: 700 }}>{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Operational Tip */}
              <div style={{
                marginTop: 'auto',
                background: 'rgba(255, 255, 255, 0.02)',
                borderLeft: `3px solid ${activePortal.color}`,
                padding: '12px 14px',
                borderRadius: '0 12px 12px 0',
              }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: activePortal.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                  System Notice
                </div>
                <div style={{ fontSize: 11.5, color: '#E2E8F0', fontWeight: 500, lineHeight: 1.4 }}>
                  {activePortal.stats.tip}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: List of Rows */}
        <div className="portal-card-list">
          {portals.map(p => {
            const isHovered = hoveredId === p.id;
            const isExternal = p.to.startsWith('http');
            const LinkComponent = isExternal ? 'a' : Link;
            const linkProps = isExternal ? { href: p.to } : { to: p.to };
            return (
              <LinkComponent
                key={p.id}
                id={`select-${p.id}-portal`}
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredId(p.id)}
                {...linkProps}
              >
                <div
                  className="portal-row-card"
                  style={{
                    borderLeft: `5px solid ${isHovered ? p.color : '#E2E8F0'}`,
                    borderColor: isHovered ? p.color : '#E2E8F0',
                    background: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                    boxShadow: isHovered ? `0 12px 30px ${p.color}08` : '0 4px 12px rgba(0, 0, 0, 0.01)',
                    transform: isHovered ? 'translateX(4px)' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: isHovered ? p.bg : 'rgba(241, 245, 249, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isHovered ? p.color : '#64748B',
                    transition: 'all 0.25s ease',
                  }}>
                    <p.icon size={19} />
                  </div>

                  {/* Info */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: '#0B1F3A',
                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                      }}>
                        {p.label}
                      </h4>
                      <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: p.color,
                        background: `${p.color}12`,
                        padding: '2px 8px',
                        borderRadius: 6,
                        letterSpacing: '0.02em',
                      }}
                      className="mobile-badge-inline"
                      >
                        {p.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
                      {p.subtitle}
                    </div>
                  </div>

                  {/* Arrow / Action */}
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: isHovered ? p.color : 'transparent',
                    color: isHovered ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    border: isHovered ? `1px solid ${p.color}` : '1px solid #E2E8F0',
                  }}>
                    <ArrowRight size={15} />
                  </div>

                  {/* Mobile Only Stats Preview */}
                  <div className="mobile-stats-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {p.stats.metrics.map((m, mIdx) => (
                        <div key={mIdx} style={{
                          background: '#F8FAFC',
                          padding: '6px 8px',
                          borderRadius: 8,
                          textAlign: 'center',
                          border: '1px solid #F1F5F9',
                        }}>
                          <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</div>
                          <div style={{ fontSize: 11, color: p.color, fontWeight: 700, marginTop: 2 }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </LinkComponent>
            )
          })}
        </div>
      </div>

      <p style={{ color: '#64748B', fontSize: 13.5, marginTop: 48, fontWeight: 500, textAlign: 'center' }}>
        System Administration Assistance? <Link to="/support" style={{ color: '#0F9D8A', textDecoration: 'none', fontWeight: 700 }}>Contact Technical Support</Link>
      </p>

      {/* Styled Responsive Classes */}
      <style>{`
        .portal-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 32px;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
        }
        .preview-panel {
          position: sticky;
          top: 110px;
          height: calc(100vh - 220px);
          max-height: 560px;
          background: linear-gradient(135deg, #0B1F3A 0%, #05101E 100%);
          border-radius: 24px;
          padding: 28px;
          color: white;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(11, 31, 58, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }
        .portal-card-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .portal-row-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 16px 20px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
        }
        .mobile-stats-container {
          display: none;
        }
        @media (max-width: 900px) {
          .portal-layout {
            grid-template-columns: 1fr;
          }
          .preview-panel {
            display: none;
          }
          .portal-row-card {
            grid-template-columns: auto 1fr auto;
          }
          .mobile-stats-container {
            display: block;
            grid-column: span 3;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid rgba(226, 232, 240, 0.5);
          }
        }
      `}</style>
    </div>
  )
}
