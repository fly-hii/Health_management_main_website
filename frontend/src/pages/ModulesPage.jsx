import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

const modules = [
  { name: 'Authentication', desc: 'JWT-based auth with OTP, 2FA, role sessions and refresh tokens.', color: '#0F9D8A', icon: '🔐' },
  { name: 'Patient Management', desc: 'Full patient lifecycle from registration to discharge and follow-up.', color: '#6366F1', icon: '👤' },
  { name: 'Doctor Management', desc: 'Doctor profiles, schedules, specializations, and availability management.', color: '#8B5CF6', icon: '👨‍⚕️' },
  { name: 'Nurse Management', desc: 'Nursing shifts, patient assignments, vitals and care plan management.', color: '#F97316', icon: '👩‍⚕️' },
  { name: 'Pharmacy Module', desc: 'Prescription workflow, drug inventory, expiry tracking and dispensing.', color: '#F59E0B', icon: '💊' },
  { name: 'Laboratory Module', desc: 'Lab test ordering, sample management, results and report generation.', color: '#10B981', icon: '🔬' },
  { name: 'Billing & Finance', desc: 'Invoice generation, payment processing, insurance and refunds.', color: '#EF4444', icon: '💳' },
  { name: 'Reports & Analytics', desc: 'Customizable dashboards, KPIs, trends and export capabilities.', color: '#06B6D4', icon: '📊' },
  { name: 'Notifications', desc: 'Real-time push, email, SMS alerts for all critical events.', color: '#EC4899', icon: '🔔' },
  { name: 'Analytics Engine', desc: 'Hospital performance metrics, occupancy rates and financial health.', color: '#0B1F3A', icon: '📈' },
  { name: 'Audit Logs', desc: 'Complete, tamper-proof activity logs for regulatory compliance.', color: '#64748B', icon: '📋' },
  { name: 'Inventory Control', desc: 'Stock tracking, automatic reorder alerts and vendor management.', color: '#84CC16', icon: '📦' },
  { name: 'Appointments & Queue', desc: 'Smart scheduling, token system and real-time queue display.', color: '#6366F1', icon: '📅' },
  { name: 'Role & Permissions', desc: 'Fine-grained RBAC with custom roles and module-level access.', color: '#0F9D8A', icon: '🛡️' },
]

export default function ModulesPage() {
  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 80px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)', margin: '0 auto 20px' }}>
          <Package size={13} /> Platform Modules
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#0B1F3A', marginBottom: 20, letterSpacing: '-0.02em' }}>
          25+ Integrated Modules
        </h1>
        <p style={{ color: '#475569', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.8, fontWeight: 500 }}>
          Every module is purpose-built for healthcare workflows and seamlessly integrated with the rest of the system.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {modules.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              className="hover-card"
              style={{ background: 'white', borderRadius: 18, padding: '24px 24px', border: `2px solid ${m.color}15` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 28 }}>{m.icon}</div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: '#0B1F3A' }}>{m.name}</h3>
              </div>
              <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{m.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} color={m.color} />
                <span style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>Included in all plans</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #CBE7E5)', borderRadius: 24, padding: '48px', textAlign: 'center', marginTop: 60, color: '#0B1F3A', border: '1.5px solid #E2E8F0' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 32, marginBottom: 12, letterSpacing: '-0.02em' }}>All Modules. Zero Extra Cost.</h2>
          <p style={{ fontSize: 16, color: '#475569', marginBottom: 28, fontWeight: 500 }}>Every module is included in your CarePlus subscription. No tiered features, no surprise charges.</p>
          <Link to="/pricing" className="btn-primary" style={{ background: '#0F9D8A', color: 'white', boxShadow: '0 8px 24px rgba(15,157,138,0.25)' }} id="modules-pricing-btn">
            View Pricing <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
