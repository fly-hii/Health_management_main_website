import { motion } from 'framer-motion'
import { HeartPulse, Target, Eye, Users, Award, Clock } from 'lucide-react'

const values = [
  { icon: HeartPulse, title: 'Patient First', desc: 'Every feature we build centers around improving patient outcomes and experience.', color: '#EF4444' },
  { icon: Target, title: 'Precision', desc: 'We deliver accurate, reliable tools that hospitals can trust for critical operations.', color: '#0F9D8A' },
  { icon: Eye, title: 'Transparency', desc: 'Open audit trails, full system visibility, and honest communication at all times.', color: '#6366F1' },
  { icon: Users, title: 'Collaboration', desc: 'Connecting doctors, nurses, pharmacists, and lab teams in one unified platform.', color: '#F59E0B' },
  { icon: Award, title: 'Excellence', desc: 'We constantly improve our platform to meet the highest standards in healthcare IT.', color: '#8B5CF6' },
  { icon: Clock, title: 'Reliability', desc: '99.9% uptime guaranteed with real-time monitoring and automated failover systems.', color: '#10B981' },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#F8FAFC' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 80px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)', margin: '0 auto 20px' }}>
          <HeartPulse size={13} /> About CarePlus
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#0B1F3A', marginBottom: 20, maxWidth: 700, margin: '0 auto 20px', letterSpacing: '-0.02em' }}>
          Transforming Healthcare Through Technology
        </h1>
        <p style={{ color: '#475569', fontSize: 17, maxWidth: 580, margin: '0 auto', lineHeight: 1.8, fontWeight: 500 }}>
          CarePlus was founded with one mission: to make hospital management simpler, smarter, and more patient-centered through cutting-edge digital solutions.
        </p>
      </div>

      {/* Mission / Vision */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 80 }}>
          {[
            { title: 'Our Mission', text: 'To digitize hospital operations globally, reducing administrative burden and improving patient care quality through intelligent, integrated technology.', color: '#0F9D8A' },
            { title: 'Our Vision', text: 'A world where every hospital, regardless of size or location, has access to enterprise-grade management tools that enable better health outcomes.', color: '#6366F1' },
          ].map(v => (
            <div key={v.title} style={{ background: 'white', borderRadius: 20, padding: 36, border: `2px solid ${v.color}20` }}>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 24, color: v.color, marginBottom: 16 }}>{v.title}</h2>
              <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.8 }}>{v.text}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 80 }}>
          {[
            { value: '2019', label: 'Founded' },
            { value: '50+', label: 'Hospitals' },
            { value: '5000+', label: 'Users' },
            { value: '25+', label: 'Modules' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: 28, textAlign: 'center', border: '1.5px solid #E2E8F0' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 36, color: '#0F9D8A' }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Our Core Values</h2>
          <p className="section-subtitle">The principles that guide everything we build and every decision we make</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="hover-card"
              style={{ background: 'white', borderRadius: 16, padding: 28, border: '1.5px solid #E2E8F0' }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 12, background: `${v.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <v.icon size={24} color={v.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: '#0B1F3A', marginBottom: 10 }}>{v.title}</h3>
              <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}div[style*="repeat(4, 1fr)"]{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}
