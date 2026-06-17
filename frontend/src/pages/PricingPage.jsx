import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    desc: 'Perfect for small clinics and private practices.',
    color: '#06B6D4',
    features: [
      'Up to 5 doctors', 'Up to 500 patients', 'Patient Management',
      'Appointment System', 'Basic Billing', 'Email Support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$699',
    period: '/month',
    desc: 'Ideal for mid-size hospitals with multiple departments.',
    color: '#0F9D8A',
    features: [
      'Up to 50 doctors', 'Unlimited patients', 'All Starter features',
      'Pharmacy Module', 'Laboratory Module', 'Analytics Dashboard',
      'SMS Notifications', 'Priority Support',
    ],
    cta: 'Most Popular',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large hospital networks and multi-branch systems.',
    color: '#6366F1',
    features: [
      'Unlimited doctors & staff', 'Multi-branch support', 'All Professional features',
      'Custom roles & permissions', 'Dedicated server', 'SLA guarantee',
      'White-label option', '24/7 phone support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 80px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)', margin: '0 auto 20px' }}>
          <Zap size={13} /> Pricing Plans
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#0B1F3A', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ color: '#475569', fontSize: 17, fontWeight: 500 }}>
          No hidden fees. All modules included. Cancel anytime.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                background: 'white', borderRadius: 24,
                padding: '36px 32px',
                border: plan.popular ? `3px solid ${plan.color}` : '2px solid #E2E8F0',
                position: 'relative',
                boxShadow: plan.popular ? `0 20px 60px ${plan.color}20` : 'none',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: plan.color, color: 'white', padding: '6px 20px',
                  borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  ⭐ MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#0B1F3A', marginBottom: 8 }}>{plan.name}</h2>
                <p style={{ color: '#64748B', fontSize: 14 }}>{plan.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 42, color: '#0B1F3A' }}>{plan.price}</span>
                <span style={{ color: '#94A3B8', fontSize: 15 }}>{plan.period}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={15} color={plan.color} />
                    <span style={{ fontSize: 14, color: '#475569' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link
                to={plan.name === 'Enterprise' ? '/contact' : '/login'}
                id={`pricing-plan-${plan.name.toLowerCase()}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 24px', borderRadius: 12,
                  background: plan.popular ? `linear-gradient(135deg, ${plan.color}, #06B6D4)` : 'transparent',
                  color: plan.popular ? 'white' : plan.color,
                  border: plan.popular ? 'none' : `2px solid ${plan.color}`,
                  fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: plan.popular ? `0 6px 20px ${plan.color}40` : 'none',
                }}
              >
                {plan.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48, color: '#64748B', fontSize: 14 }}>
          All plans include a <strong>30-day free trial</strong>. No credit card required. Have questions? <Link to="/contact" style={{ color: '#0F9D8A', fontWeight: 600 }}>Contact us</Link> or review our <Link to="/privacy-policy" style={{ color: '#0F9D8A', fontWeight: 600 }}>Privacy Policy</Link>.
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="repeat(3, 1fr)"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
