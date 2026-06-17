import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: 100, marginBottom: 20 }}>🏥</div>
      <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 72, color: '#0F9D8A', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 28, color: '#0B1F3A', margin: '12px 0 16px' }}>Page Not Found</h2>
      <p style={{ color: '#64748B', fontSize: 16, maxWidth: 400, lineHeight: 1.7, marginBottom: 36 }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: 14 }}>
        <Link to="/" className="btn-primary" id="404-home-btn">
          <Home size={16} /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-outline" id="404-back-btn">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  )
}
