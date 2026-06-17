import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using CarePlus Hospital Management System, you agree to be bound by these Terms and Conditions. If you do not agree, you may not use the platform.' },
    { title: '2. Use of Service', content: 'CarePlus is licensed to authorized healthcare institutions and personnel. Users must be 18 or older. The platform may only be used for legitimate hospital management purposes. Unauthorized use is prohibited.' },
    { title: '3. User Accounts', content: 'You are responsible for maintaining the security of your account credentials. Notify us immediately of any unauthorized access. CarePlus is not liable for losses arising from unauthorized use of your account.' },
    { title: '4. Healthcare Disclaimer', content: 'CarePlus provides management tools, not medical advice. Clinical decisions are the responsibility of licensed healthcare professionals. The platform does not replace professional medical judgment.' },
    { title: '5. Data Ownership', content: 'All patient and hospital data entered into CarePlus remains the property of the healthcare institution. CarePlus acts as a data processor and does not claim ownership of institutional data.' },
    { title: '6. Subscription & Billing', content: 'Services are billed monthly or annually as per your subscription plan. Cancellation takes effect at the end of the billing cycle. No refunds for partial billing periods unless required by law.' },
    { title: '7. Uptime & SLA', content: 'CarePlus targets 99.9% monthly uptime. Planned maintenance will be communicated 48 hours in advance. Enterprise customers have dedicated SLA agreements.' },
    { title: '8. Intellectual Property', content: 'All software, designs, and content within CarePlus are the intellectual property of CarePlus Hospital Systems. You may not copy, modify, or redistribute any part of the platform.' },
    { title: '9. Termination', content: 'Either party may terminate the agreement with 30 days written notice. CarePlus may terminate immediately for violations of these terms. Upon termination, data export assistance will be provided.' },
    { title: '10. Governing Law', content: 'These terms are governed by the laws of the State of California, USA. Disputes shall be resolved through binding arbitration before courts of competent jurisdiction.' },
  ]

  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 60px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <FileText size={40} color="#0F9D8A" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', color: '#0B1F3A', marginBottom: 16, letterSpacing: '-0.02em' }}>Terms & Conditions</h1>
        <p style={{ color: '#64748B', fontSize: 15, fontWeight: 500 }}>Last updated: January 1, 2025</p>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '48px', border: '1.5px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
            These Terms and Conditions govern your use of the CarePlus Hospital Management System. Please read them carefully before using the platform. By continuing to use CarePlus, you accept these terms in full.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {sections.map(s => (
              <div key={s.title}>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: '#0B1F3A', marginBottom: 10 }}>{s.title}</h2>
                <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.8 }}>{s.content}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 40, paddingTop: 32, textAlign: 'center' }}>
            <Link to="/privacy-policy" style={{ color: '#0F9D8A', fontWeight: 600, marginRight: 24 }}>Privacy Policy</Link>
            <Link to="/contact" style={{ color: '#0F9D8A', fontWeight: 600 }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
