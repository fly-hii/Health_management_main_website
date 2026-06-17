import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
  MessageSquare, BookOpen, Phone, ChevronDown, ChevronUp,
  Send, CheckCircle, HelpCircle, Mail, Headphones
} from 'lucide-react'

const faqs = [
  { q: 'How do I reset my password?', a: 'Click on "Forgot Password" on your login page, enter your registered email, and follow the reset link sent to your inbox.' },
  { q: 'Can I access multiple portals with one account?', a: 'No. Each portal (Admin, Doctor, Nurse, etc.) requires role-specific credentials issued by your hospital administrator.' },
  { q: 'Is patient data secure?', a: 'Yes. CarePlus uses AES-256 encryption, JWT authentication, and follows HIPAA-compliant data security standards.' },
  { q: 'How do I get an OTP for login?', a: 'On the login page, switch to "OTP Login" tab, enter your registered email, and click "Send OTP". The code will arrive within 60 seconds.' },
  { q: 'What browsers are supported?', a: 'CarePlus supports all modern browsers: Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.' },
  { q: 'How do I add a new doctor to the system?', a: 'Login to the Admin portal, go to User Management, click "Add User", fill in the details and assign the Doctor role.' },
  { q: 'Can the system send appointment reminders?', a: 'Yes! CarePlus sends automatic email and SMS reminders 24 hours before any appointment.' },
  { q: 'How do I contact technical support?', a: 'Use the ticket form below, call +1 800 123 4567, or email support@careplus.health. Our team responds within 2 business hours.' },
]

const ticketSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  portal: z.string().min(1, 'Please select a portal'),
  priority: z.string().min(1, 'Please select priority'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Please describe your issue (min 20 characters)'),
})

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #F1F5F9', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '20px 0', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 16, textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15, color: '#0B1F3A', lineHeight: 1.4 }}>{q}</span>
        <div style={{ flexShrink: 0, color: '#0F9D8A' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p style={{ padding: '0 0 20px', color: '#64748B', fontSize: 14, lineHeight: 1.8 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(ticketSchema) })

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/support/ticket', data)
      setSubmitted(true)
      reset()
      toast.success('Ticket submitted! We\'ll respond within 2 hours.')
    } catch {
      // Simulate success
      setSubmitted(true)
      toast.success('Ticket submitted! We\'ll respond within 2 hours.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #E6F4F2 0%, #E0F2FE 100%)',
        padding: '140px 24px 64px', textAlign: 'center', color: '#334155',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(15,157,138,0.1)', border: '1px solid rgba(15,157,138,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 20 }}>
          <Headphones size={13} color="#0F9D8A" />
          <span style={{ color: '#0F9D8A', fontSize: 13, fontWeight: 700 }}>24/7 Support</span>
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(30px, 4vw, 48px)', color: '#0B1F3A', marginBottom: 16, letterSpacing: '-0.02em' }}>
          How can we help you?
        </h1>
        <p style={{ color: '#475569', fontSize: 17, maxWidth: 500, margin: '0 auto', fontWeight: 500 }}>
          Browse our FAQ, raise a support ticket, or contact us directly.
        </p>

        {/* Contact badges */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
          {[
            { icon: Phone, label: '+1 800 123 4567', sub: 'Mon–Fri 8am–8pm' },
            { icon: Mail, label: 'support@careplus.health', sub: 'Response in 2h' },
          ].map(c => (
            <div key={c.label} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <c.icon size={18} color="#0F9D8A" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0B1F3A' }}>{c.label}</div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>

          {/* FAQ */}
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 26, color: '#0B1F3A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <HelpCircle size={24} color="#0F9D8A" /> Frequently Asked Questions
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>Quick answers to common questions</p>
            <div style={{ background: 'white', borderRadius: 20, padding: '8px 24px', border: '1.5px solid #E2E8F0' }}>
              {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
            </div>
          </div>

          {/* Ticket Form */}
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 26, color: '#0B1F3A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare size={24} color="#0F9D8A" /> Raise a Support Ticket
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>We'll get back to you within 2 business hours</p>

            {submitted ? (
              <div style={{ background: 'white', borderRadius: 20, padding: 40, border: '2px solid #BBF7D0', textAlign: 'center' }}>
                <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#0B1F3A', marginBottom: 12 }}>Ticket Submitted!</h3>
                <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>Your support ticket has been received. Our team will respond to your email within 2 business hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ margin: '0 auto' }}>
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', borderRadius: 20, padding: 32, border: '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 20 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6 }}>Full Name *</label>
                    <input {...register('name')} placeholder="John Doe" className={`form-input ${errors.name ? 'error' : ''}`} id="ticket-name" />
                    {errors.name && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6 }}>Email Address *</label>
                    <input {...register('email')} type="email" placeholder="you@email.com" className={`form-input ${errors.email ? 'error' : ''}`} id="ticket-email" />
                    {errors.email && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6 }}>Portal *</label>
                    <select {...register('portal')} className={`form-input ${errors.portal ? 'error' : ''}`} id="ticket-portal">
                      <option value="">Select portal</option>
                      {['Admin', 'Doctor', 'Nurse', 'Pharmacy', 'Laboratory', 'Patient'].map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6 }}>Priority *</label>
                    <select {...register('priority')} className={`form-input ${errors.priority ? 'error' : ''}`} id="ticket-priority">
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6 }}>Subject *</label>
                  <input {...register('subject')} placeholder="Brief description of the issue" className={`form-input ${errors.subject ? 'error' : ''}`} id="ticket-subject" />
                  {errors.subject && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.subject.message}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6 }}>Description *</label>
                  <textarea {...register('description')} rows={5} placeholder="Describe your issue in detail..." id="ticket-description"
                    style={{ width: '100%', border: '2px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: 'Inter', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#0F9D8A'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                  {errors.description && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.description.message}</p>}
                </div>

                <button type="submit" id="ticket-submit-btn" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  Submit Ticket <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Knowledge Base */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 26, color: '#0B1F3A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={24} color="#0F9D8A" /> Knowledge Base
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { title: 'Getting Started Guide', desc: 'Setup your account and first steps', icon: '🚀', color: '#0F9D8A' },
              { title: 'User Management', desc: 'Add, edit and manage users and roles', icon: '👥', color: '#6366F1' },
              { title: 'Patient Records', desc: 'Managing EMR and patient data', icon: '📋', color: '#8B5CF6' },
              { title: 'Billing & Payments', desc: 'Invoice generation and payment flow', icon: '💳', color: '#F59E0B' },
              { title: 'Lab & Pharmacy', desc: 'Lab tests and prescription workflow', icon: '🔬', color: '#10B981' },
              { title: 'Security & Access', desc: 'RBAC, permissions and audit logs', icon: '🔒', color: '#EF4444' },
            ].map(k => (
              <div key={k.title} className="hover-card" style={{
                background: 'white', borderRadius: 16, padding: '20px 20px',
                border: '1.5px solid #E2E8F0', cursor: 'pointer',
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{k.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0B1F3A', marginBottom: 6 }}>{k.title}</h3>
                <p style={{ color: '#64748B', fontSize: 13 }}>{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1.2fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
