import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Activity, Headphones, LogIn, ChevronDown,
  Shield, Stethoscope, UserCheck, FlaskConical, Pill, User, LayoutDashboard, Search
} from 'lucide-react'
import { useSocket } from '../../context/SocketContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Features', to: '/features' },
  { label: 'Modules', to: '/modules' },
  { label: 'Subscribe', to: '/subscribe' },
  { label: 'Contact', to: '/contact' },
]

const portalLinks = [
  { label: 'Admin', to: 'https://health-dashboards-hospital-admin-fr.vercel.app', icon: Shield, color: '#6366F1' },
  { label: 'Doctor', to: 'https://health-dashboards-doctor-frontend.vercel.app', icon: Stethoscope, color: '#0F9D8A' },
  { label: 'Nurse', to: 'https://health-dashboards-nurse-frontend.vercel.app', icon: UserCheck, color: '#8B5CF6' },
  { label: 'Pharmacy', to: 'https://health-dashboards-pharma-frontend.vercel.app', icon: Pill, color: '#F59E0B' },
  { label: 'Laboratory', to: '/laboratory/login', icon: FlaskConical, color: '#10B981' },
  { label: 'Patient', to: 'https://health-dashboards-patient-frontend.vercel.app', icon: User, color: '#06B6D4' },
]

const searchableItems = [
  { title: 'Home', path: '/', category: 'Page' },
  { title: 'About Us', path: '/about', category: 'Page' },
  { title: 'Features Overview', path: '/features', category: 'Page' },
  { title: 'Platform Modules', path: '/modules', category: 'Page' },
  { title: 'Subscribe / Sign Up', path: '/subscribe', category: 'Page' },
  { title: 'Privacy Policy', path: '/privacy-policy', category: 'Page' },
  { title: 'Contact Us', path: '/contact', category: 'Page' },
  { title: 'System Status Monitor', path: '/system-status', category: 'Page' },
  { title: 'Support & FAQs', path: '/support', category: 'Page' },
  { title: 'Admin Portal Login', path: '/admin/login', category: 'Portal' },
  { title: 'Doctor Portal Login', path: '/doctor/login', category: 'Portal' },
  { title: 'Nurse Portal Login', path: '/nurse/login', category: 'Portal' },
  { title: 'Pharmacy Portal Login', path: '/pharmacy/login', category: 'Portal' },
  { title: 'Laboratory Portal Login', path: '/laboratory/login', category: 'Portal' },
  { title: 'Patient Portal Login', path: '/patient/login', category: 'Portal' },
  { title: 'Patient Lifecycle Management', path: '/features', category: 'Feature' },
  { title: 'Appointment Scheduling', path: '/features', category: 'Feature' },
  { title: 'Electronic Medical Records (EMR)', path: '/features', category: 'Feature' },
  { title: 'Pharmacy Inventory', path: '/features', category: 'Feature' },
  { title: 'Laboratory Tests & Reports', path: '/features', category: 'Feature' },
  { title: 'Automated Billing & Insurance', path: '/features', category: 'Feature' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)
  const { connected, liveUserCount } = useSocket()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const loginsDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (loginsDropdownRef.current && !loginsDropdownRef.current.contains(event.target)) {
        setPortalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredItems = searchableItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5)

  const handleItemSelect = (path) => {
    navigate(path)
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.dispatchEvent(new CustomEvent('open-chat-with-query', {
        detail: { query: searchQuery }
      }))
      setSearchQuery('')
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1.5px solid #F1F5F9' : '1.5px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 78 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 48 }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0F9D8A"/>
              <path d="M11 7h2v3h3v2h-3v3h-2v-3H8v-2h3V7z" fill="white"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 21, color: '#0B1F3A', lineHeight: 1.1 }}>CarePlus</div>
              <div style={{ fontSize: 10, color: '#0B1F3A', fontWeight: 700, letterSpacing: '0.12em', marginTop: 1 }}>HOSPITAL</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, height: '100%', flexWrap: 'nowrap' }} className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 4px',
                  margin: '0 14px',
                  height: '100%',
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? '#0F9D8A' : '#475569',
                  borderBottom: 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginLeft: 'auto' }}>
            {/* Small Searchbar */}
            <div ref={searchRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="header-search-bar">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#F1F5F9',
                borderRadius: '20px',
                padding: '6px 14px',
                border: '1.5px solid transparent',
                transition: 'all 0.2s ease',
                width: 150,
              }}
              className="search-bar-container"
              >
                <Search size={14} style={{ color: '#64748B', marginRight: 8, flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    color: '#0B1F3A',
                    fontWeight: '500',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Search Dropdown Results */}
              <AnimatePresence>
                {showDropdown && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      marginTop: 8,
                      right: 0,
                      width: 250,
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 30px rgba(11, 31, 58, 0.08)',
                      zIndex: 1001,
                      overflow: 'hidden',
                      padding: '8px 0',
                    }}
                  >
                    {filteredItems.length > 0 ? (
                      <>
                        <div style={{ padding: '4px 14px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Quick Links
                        </div>
                        {filteredItems.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleItemSelect(item.path)}
                            style={{
                              padding: '10px 14px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'background 0.2s',
                              textAlign: 'left',
                            }}
                            className="hover:bg-slate-50"
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0B1F3A' }}>{item.title}</span>
                            <span style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>{item.category}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div style={{ padding: '12px 14px', fontSize: 12, color: '#64748B', textAlign: 'center' }}>
                        No quick links found
                      </div>
                    )}
                    <div style={{
                      borderTop: '1px solid #F1F5F9',
                      marginTop: 4,
                      padding: '8px 14px 4px',
                      fontSize: 10,
                      color: '#0F9D8A',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span>Press Enter to ask AI Copilot 🪄</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support Link */}
            <Link to="/support" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              color: '#1E293B',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}>
              <Headphones size={18} style={{ color: '#1E293B' }} />
              Support
            </Link>

            {/* Logins Dropdown Button */}
            <div ref={loginsDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setPortalOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  borderRadius: 30,
                  border: '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1E293B',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0F9D8A';
                  e.currentTarget.style.color = '#0F9D8A';
                }}
                onMouseLeave={(e) => {
                  if (!portalOpen) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.color = '#1E293B';
                  }
                }}
              >
                <LogIn size={16} />
                <span>Logins</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: portalOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {portalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 8,
                      width: 260,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 16,
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: '0 10px 30px rgba(11, 31, 58, 0.08)',
                      zIndex: 1001,
                      overflow: 'hidden',
                      padding: '12px 8px',
                    }}
                  >
                    <div style={{
                      padding: '0 12px 8px 12px',
                      borderBottom: '1px solid #F1F5F9',
                      marginBottom: 8,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Select Portal Login
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
                      {portalLinks.map((p) => {
                        const isExternal = p.to.startsWith('http');
                        const LinkComponent = isExternal ? 'a' : Link;
                        const linkProps = isExternal ? { href: p.to } : { to: p.to };
                        return (
                          <LinkComponent
                            key={p.to}
                            onClick={() => setPortalOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: 10,
                              textDecoration: 'none',
                              color: '#1E293B',
                              transition: 'all 0.2s ease',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(15, 157, 138, 0.06)';
                              e.currentTarget.style.color = '#0F9D8A';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#1E293B';
                            }}
                            {...linkProps}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: `${p.color}15`,
                              color: p.color,
                            }}
                            >
                              <p.icon size={15} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.label} Portal</span>
                              <span style={{ fontSize: 10, color: '#64748B' }}>Access {p.label.toLowerCase()} features</span>
                            </div>
                          </LinkComponent>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(p => !p)}
              style={{
                display: 'none',
                background: 'transparent', border: 'none',
                cursor: 'pointer', padding: 8, borderRadius: 8,
                color: '#0B1F3A',
              }}
              className="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 300, background: 'white',
              zIndex: 999, padding: 24, overflowY: 'auto',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, marginTop: 10 }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#0B1F3A' }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="#0B1F3A" />
              </button>
            </div>

            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '14px 16px', borderRadius: 10,
                  fontSize: 16, fontWeight: 500, textDecoration: 'none',
                  color: isActive ? '#0F9D8A' : '#0B1F3A',
                  background: isActive ? 'rgba(15,157,138,0.08)' : 'transparent',
                  marginBottom: 4,
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 16, paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Portals</div>
              {portalLinks.map(p => {
                const isExternal = p.to.startsWith('http');
                const LinkComponent = isExternal ? 'a' : Link;
                const linkProps = isExternal ? { href: p.to } : { to: p.to };
                return (
                  <LinkComponent
                    key={p.to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 10,
                      textDecoration: 'none', color: '#0B1F3A',
                      marginBottom: 4,
                    }}
                    {...linkProps}
                  >
                    <p.icon size={16} color={p.color} />
                    <span style={{ fontWeight: 500 }}>{p.label} Portal</span>
                  </LinkComponent>
                );
              })}
            </div>

            <div style={{ marginTop: 24 }}>
              <Link to="/system-status" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', textDecoration: 'none', color: '#10B981', fontWeight: 600 }}>
                <Activity size={16} />
                System Status
              </Link>
              <Link to="/support" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', textDecoration: 'none', color: '#475569', fontWeight: 600 }}>
                <Headphones size={16} />
                Support
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .search-bar-container:focus-within {
          border-color: #0F9D8A !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 3px rgba(15, 157, 138, 0.12);
          width: 200px !important;
        }
        @media (max-width: 768px) {
          .header-search-bar {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}
