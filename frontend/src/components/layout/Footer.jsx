import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Share2, Hash, Video, Mail, Phone, MapPin, Heart } from 'lucide-react'

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Modules',
    links: [
      { label: 'Patient Management', to: '/modules' },
      { label: 'Appointments', to: '/modules' },
      { label: 'Pharmacy', to: '/modules' },
      { label: 'Laboratory', to: '/modules' },
      { label: 'Billing & Payments', to: '/modules' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'System Status', to: '/system-status' },
      { label: 'Knowledge Base', to: '/support' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/support' },
      { label: 'Raise a Ticket', to: '/support' },
      { label: 'FAQ', to: '/support' },
      { label: 'Contact Support', to: '/contact' },
    ],
  },
]

const socials = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Chat' },
  { icon: Share2, href: '#', label: 'Network' },
  { icon: Hash, href: '#', label: 'Social' },
  { icon: Video, href: '#', label: 'Video' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#F8FAFC', color: '#334155', borderTop: '1.5px solid #E2E8F0', paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 40, paddingBottom: 48 }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0F9D8A"/>
                <path d="M11 7h2v3h3v2h-3v3h-2v-3H8v-2h3V7z" fill="white"/>
              </svg>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 20, color: '#0B1F3A', lineHeight: 1.1 }}>CarePlus</div>
                <div style={{ fontSize: 10, color: '#0B1F3A', fontWeight: 700, letterSpacing: '0.12em', marginTop: 2 }}>HOSPITAL SYSTEM</div>
              </div>
            </div>

            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.8, marginBottom: 24, maxWidth: 260 }}>
              A comprehensive, secure and efficient solution to manage hospital operations digitally.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:support@careplus.health" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                <Mail size={14} color="#0F9D8A" />support@careplus.health
              </a>
              <a href="tel:+18001234567" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                <Phone size={14} color="#0F9D8A" />+1 800 123 4567
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 13, fontWeight: 500 }}>
                <MapPin size={14} color="#0F9D8A" />123 Healthcare Ave, Medical City
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 style={{ fontWeight: 800, fontSize: 14, marginBottom: 20, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={{ color: '#64748B', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s', fontWeight: 500 }}
                      onMouseEnter={e => e.target.style.color = '#0F9D8A'}
                      onMouseLeave={e => e.target.style.color = '#64748B'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1.5px solid #E2E8F0',
          padding: '24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ color: '#64748B', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
            © 2025 CarePlus Hospital Systems. Made with <Heart size={13} color="#EF4444" fill="#EF4444" /> for better healthcare.
          </p>

          {/* Socials */}
          <div style={{ display: 'flex', gap: 10 }}>
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748B', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0F9D8A'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#0F9D8A' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#E2E8F0' }}
              >
                <s.icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
