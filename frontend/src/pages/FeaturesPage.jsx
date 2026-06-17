import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users, Calendar, FileText, Pill, Beaker, CreditCard, Bell,
  BarChart3, Package, KeyRound, Shield, Zap, ArrowRight,
  Bed, Video, Droplet, Utensils, Activity
} from 'lucide-react'

const features = [
  { icon: Users, title: 'Patient Management', desc: 'Complete patient lifecycle management from registration to discharge. Maintain comprehensive medical histories, allergy records, vital signs, and treatment plans all in one place.', color: '#0F9D8A', highlights: ['Patient registration & profiles', 'Medical history tracking', 'Allergy & medication alerts', 'Discharge summary generation'] },
  { icon: Calendar, title: 'Appointment Management', desc: 'Smart, conflict-free scheduling system with automated reminders and queue management. Supports walk-in, online, and emergency appointments.', color: '#6366F1', highlights: ['Online appointment booking', 'Queue token system', 'SMS/Email reminders', 'Doctor availability calendar'] },
  { icon: FileText, title: 'Electronic Medical Records', desc: 'Secure, fully digital EMR system with real-time access across departments. Follows HIPAA standards with complete audit trails for all record access.', color: '#8B5CF6', highlights: ['Digital prescriptions', 'Lab results integration', 'Diagnosis & notes', 'Full audit trails'] },
  { icon: Pill, title: 'Pharmacy Management', desc: 'End-to-end pharmacy operations including prescription verification, medicine dispensing, inventory tracking, and drug interaction alerts.', color: '#F59E0B', highlights: ['Prescription processing', 'Drug interaction checks', 'Inventory management', 'Expiry tracking'] },
  { icon: Beaker, title: 'Laboratory Management', desc: 'Complete lab workflow from test ordering to report delivery. Track samples, manage equipment, and deliver results directly to EMR.', color: '#10B981', highlights: ['Test order management', 'Sample tracking', 'Digital report generation', 'Result EMR integration'] },
  { icon: CreditCard, title: 'Billing & Payments', desc: 'Automated billing with insurance claim processing, payment tracking, and financial reporting for complete revenue cycle management.', color: '#EF4444', highlights: ['Auto-invoice generation', 'Insurance claim processing', 'Payment gateway', 'Financial reports'] },
  { icon: Bed, title: 'In-Patient Department (IPD)', desc: 'Comprehensive admission-to-discharge tracking for hospitalized patients. Manage ward allocation, bed availability, nursing care plans, and doctor round logs seamlessly.', color: '#0F9D8A', highlights: ['Bed & ward allocation', 'Nursing charts & vitals tracker', 'Doctor round logging', 'Discharge checklist validation'] },
  { icon: Activity, title: 'Operation Theatre (OT) Management', desc: 'Schedule surgeries, allocate surgical teams, track anesthesia details, and manage recovery ward occupancy with structured safety checklists.', color: '#6366F1', highlights: ['OT scheduling & availability', 'Surgeon & staff allocation', 'Pre-op checklist safety logs', 'Post-op recovery tracking'] },
  { icon: Video, title: 'Telemedicine & Virtual Care', desc: 'Integrated high-definition video consultations enabling doctors to treat patients remotely. Includes digital prescription generation during calls and integrated online payments.', color: '#8B5CF6', highlights: ['HD video consultations', 'Virtual waiting room', 'Integrated chat & file sharing', 'In-call digital prescription'] },
  { icon: Droplet, title: 'Blood Bank Management', desc: 'Monitor blood inventory levels, manage donor databases, handle compatibility cross-matching, and track distribution to operating theatres and wards.', color: '#EF4444', highlights: ['Donor registration & history', 'Stock level alerts by group', 'Compatibility testing (cross-match)', 'Requisition & usage logs'] },
  { icon: Utensils, title: 'Diet & Nutrition Planning', desc: 'Design personalized meal plans based on patients\' clinical needs, allergies, and doctors\' recommendations, coordinating directly with the kitchen for prompt delivery.', color: '#F59E0B', highlights: ['Clinical dietary templates', 'Kitchen order integration', 'Allergy safety alerts', 'Nutritional assessment logs'] },
  { icon: Bell, title: 'Smart Notifications', desc: 'Real-time push notifications, SMS, and email alerts for appointments, lab results, medication schedules, and system events.', color: '#06B6D4', highlights: ['Push notifications', 'SMS & email alerts', 'Emergency broadcasts', 'Scheduled reminders'] },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Comprehensive hospital performance dashboards with customizable reports, trend analysis, and KPI tracking for data-driven decisions.', color: '#0B1F3A', highlights: ['Custom dashboards', 'Performance KPIs', 'Patient trend analysis', 'Revenue analytics'] },
  { icon: Package, title: 'Inventory Management', desc: 'Track medical supplies, equipment, and medicines in real-time with automated reorder alerts and vendor management.', color: '#F97316', highlights: ['Stock tracking', 'Auto-reorder alerts', 'Vendor management', 'Consumption reports'] },
  { icon: KeyRound, title: 'Role-Based Access Control', desc: 'Fine-grained permissions management with custom roles, module-level access control, and comprehensive user activity auditing.', color: '#EC4899', highlights: ['Custom role creation', 'Module permissions', 'User activity audit', 'IP-based access control'] },
]

export default function FeaturesPage() {
  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 80px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <div className="section-tag" style={{ background: 'rgba(15,157,138,0.1)', color: '#0F9D8A', borderColor: 'rgba(15,157,138,0.2)', margin: '0 auto 20px' }}>
          <Zap size={13} /> Feature Overview
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#0B1F3A', marginBottom: 20, letterSpacing: '-0.02em' }}>
          All Features Included
        </h1>
        <p style={{ color: '#475569', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.8, fontWeight: 500 }}>
          Every subscription includes all features – no add-ons, no hidden fees. Hospital management, reimagined.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'white', borderRadius: 24, padding: '36px 40px',
                border: `2px solid ${f.color}15`,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}
            >
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={28} color={f.color} />
                </div>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 24, color: '#0B1F3A', marginBottom: 12 }}>{f.title}</h2>
                <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>{f.desc}</p>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0, background: '#F8FAFC', borderRadius: 16, padding: '24px 28px' }}>
                <h4 style={{ fontWeight: 700, fontSize: 13, color: f.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Key Capabilities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {f.highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: '#0B1F3A', fontWeight: 500 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <Link to="/login" className="btn-primary" id="features-login-btn" style={{ fontSize: 16, padding: '16px 36px' }}>
            Access All Features <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
