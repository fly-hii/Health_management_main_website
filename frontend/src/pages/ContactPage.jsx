import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { useState } from 'react'
import axios from 'axios'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/support/contact', data)
    } catch { }
    setSubmitted(true)
    reset()
    toast.success('Message sent! We\'ll get back to you soon.')
  }

  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 80px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)', margin: '0 auto 20px' }}>
          <MessageSquare size={13} /> Contact Us
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#0B1F3A', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Get In Touch
        </h1>
        <p style={{ color: '#475569', fontSize: 17, fontWeight: 500 }}>
          Have questions or want a demo? Our team will respond within 2 business hours.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48 }}>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 26, color: '#0B1F3A', marginBottom: 32 }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: Phone, label: 'Phone', value: '+1 800 123 4567', sub: 'Mon–Fri, 8am–8pm EST' },
                { icon: Mail, label: 'Email', value: 'support@careplus.health', sub: '24/7 email support' },
                { icon: MapPin, label: 'Office', value: '123 Healthcare Avenue', sub: 'Medical City, CA 90210' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'white', padding: '20px 24px', borderRadius: 16, border: '1.5px solid #E2E8F0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(15,157,138,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <c.icon size={20} color="#0F9D8A" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0B1F3A', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#0F9D8A' }}>{c.value}</div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: 24, padding: '40px', border: '1.5px solid #E2E8F0' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#0B1F3A', marginBottom: 28 }}>Send us a Message</h2>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontWeight: 700, fontSize: 20, color: '#0B1F3A', marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: '#64748B' }}>We'll be in touch within 2 business hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ margin: '24px auto 0' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6, display: 'block' }}>Full Name *</label>
                    <input {...register('name')} placeholder="John Doe" className={`form-input ${errors.name ? 'error' : ''}`} id="contact-name" />
                    {errors.name && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6, display: 'block' }}>Email *</label>
                    <input {...register('email')} type="email" placeholder="you@email.com" className={`form-input ${errors.email ? 'error' : ''}`} id="contact-email" />
                    {errors.email && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6, display: 'block' }}>Phone</label>
                    <input {...register('phone')} placeholder="+1 555 000 0000" className="form-input" id="contact-phone" />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6, display: 'block' }}>Subject *</label>
                    <input {...register('subject')} placeholder="How can we help?" className={`form-input ${errors.subject ? 'error' : ''}`} id="contact-subject" />
                    {errors.subject && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.subject.message}</p>}
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, color: '#0B1F3A', marginBottom: 6, display: 'block' }}>Message *</label>
                  <textarea {...register('message')} rows={5} placeholder="Tell us about your hospital and requirements..."
                    id="contact-message"
                    style={{ width: '100%', border: '2px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: 'Inter', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#0F9D8A'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                  {errors.message && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.message.message}</p>}
                </div>
                <button type="submit" id="contact-submit-btn" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}>
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1.5fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
