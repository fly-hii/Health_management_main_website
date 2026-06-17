import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. About the Application & Information Source',
      content: 'This privacy policy governs your use of the CarePlus software applications ("Applications") for web and mobile platforms. The Applications provide clinical service delivery and intend to streamline workflows for patients and healthcare providers. The contents and clinical records published on this application are provided by your hospital facility or healthcare provider. While every effort is made to provide accurate and reliable information, the official records maintained by the hospital remain the source of truth.'
    },
    {
      title: '2. User Provided Information',
      content: 'The application obtains information you provide when using its clinical portals. You must be a registered user to access these features. When using the application, you or your healthcare provider will submit patient health details including: (a) personal details for registration (b) vitals, prescriptions, test orders, diagnosis, doctor opinions, recovery notes, and discharge summaries; (c) support queries and feedback; and (d) credentials and system preferences.'
    },
    {
      title: '3. Automatically Collected Information',
      content: 'In addition, the application may automatically collect certain device and network details. This includes your IP address, device type, unique device ID, operating system, browser configuration, and clinical action logs. When authorized, location services (GPS or similar) may be utilized to map access locations for administrative security. You can manage or disable location permissions at any time via your device settings, though some location-restricted clinical portals may require it.'
    },
    {
      title: '4. Information Disclosure & Sharing',
      content: 'We disclose user-provided and automatically collected information: (1) as required by law (e.g. subpoenas or regulatory filings); (2) when we believe in good faith that disclosure is necessary to protect patient safety, safeguard system rights, or investigate security breaches; and (3) with trusted clinical service providers who work under strict confidentiality agreements and do not have independent use of the shared data.'
    },
    {
      title: '5. Data Retention & Policy Control',
      content: 'All clinical and patient data is owned by the respective hospital administration or relevant health department. Data retention, archiving, and deletion policies are set and authorized by hospital management. Information cannot be deleted without administrative approval from the hospital authority.'
    },
    {
      title: '6. Prevention of Misuse',
      content: 'All portals and dashboards are designed exclusively for targeted professional healthcare audiences (Doctors, Nurses, Pharmacists, Lab Operators, Administrators, and verified Patients). Misuse of clinical data or accessing portals with unauthorized credentials is strictly prohibited and subject to legal action under applicable cyber and healthcare laws.'
    },
    {
      title: '7. Security Safeguards',
      content: 'We prioritize the confidentiality and safety of your clinical records. We deploy robust physical, electronic, and procedural safeguards. System access is strictly restricted to authenticated doctors, nurses, pharmacists, laboratory operators, and authorized users under permissions granted by the Nodal Officer of the Hospital.'
    },
    {
      title: '8. Consent & Updates',
      content: 'By using the CarePlus platform, you consent to the processing and storage of your information as outlined in this Privacy Policy. We may update this policy periodically to align with evolving healthcare regulations; updates will be posted here and continued use signifies your agreement.'
    }
  ]

  return (
    <div style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'linear-gradient(135deg, #E6F4F2, #E0F2FE)', padding: '140px 24px 60px', textAlign: 'center', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>
        <Shield size={40} color="#0F9D8A" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', color: '#0B1F3A', marginBottom: 16, letterSpacing: '-0.02em' }}>Privacy Policy for IPD</h1>
        <p style={{ color: '#64748B', fontSize: 15, fontWeight: 500 }}>Last updated: January 1, 2025</p>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '48px', border: '1.5px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
            CarePlus Hospital Systems ("CarePlus", "we", "us") is dedicated to keeping clinical, administrative, and patient records private. This Privacy Policy details the data safety standards and compliance procedures implemented for our In-Patient Department (IPD) portals and system operations.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {sections.map(s => (
              <div key={s.title}>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: '#0B1F3A', marginBottom: 12 }}>{s.title}</h2>
                <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.8 }}>{s.content}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 40, paddingTop: 32, textAlign: 'center' }}>
            <Link to="/terms" style={{ color: '#0F9D8A', fontWeight: 600, marginRight: 24 }}>Terms & Conditions</Link>
            <Link to="/contact" style={{ color: '#0F9D8A', fontWeight: 600 }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
