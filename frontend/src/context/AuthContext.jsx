import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

const PORTAL_URLS = {
  admin: import.meta.env.VITE_ADMIN_URL || 'https://health-dashboards-hospital-admin-fr.vercel.app',
  doctor: import.meta.env.VITE_DOCTOR_URL || 'https://health-dashboards-doctor-frontend.vercel.app',
  nurse: import.meta.env.VITE_NURSE_URL || 'https://health-dashboards-nurse-frontend.vercel.app',
  pharmacy: import.meta.env.VITE_PHARMACY_URL || 'https://health-dashboards-pharma-frontend.vercel.app',
  laboratory: import.meta.env.VITE_LAB_URL || 'http://localhost:5177',
  patient: import.meta.env.VITE_PATIENT_URL || 'https://health-dashboards-patient-frontend.vercel.app',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('careplus_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const login = useCallback(async ({ email, password, role, rememberMe }) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', { email, password, role })
      const userData = data.data
      setUser(userData)
      if (rememberMe) {
        localStorage.setItem('careplus_user', JSON.stringify(userData))
        localStorage.setItem('careplus_token', data.token)
      } else {
        sessionStorage.setItem('careplus_user', JSON.stringify(userData))
        sessionStorage.setItem('careplus_token', data.token)
      }
      toast.success(`Welcome back, ${userData.name}!`)
      // Redirect to portal
      const url = PORTAL_URLS[userData.role] || '/'
      setTimeout(() => { window.location.href = url }, 1500)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const sendOTP = useCallback(async (email) => {
    setLoading(true)
    try {
      await axios.post('/api/auth/send-otp', { email })
      setOtpSent(true)
      toast.success('OTP sent to your email!')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyOTP = useCallback(async ({ email, otp, role }) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/verify-otp', { email, otp, role })
      const userData = data.data
      setUser(userData)
      localStorage.setItem('careplus_user', JSON.stringify(userData))
      localStorage.setItem('careplus_token', data.token)
      toast.success('OTP verified! Redirecting...')
      const url = PORTAL_URLS[userData.role] || '/'
      setTimeout(() => { window.location.href = url }, 1500)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const forgotPassword = useCallback(async (email) => {
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password', { email })
      toast.success('Password reset link sent to your email!')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('careplus_user')
    localStorage.removeItem('careplus_token')
    sessionStorage.clear()
    toast.info('Logged out successfully')
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading, otpSent,
      login, logout, sendOTP, verifyOTP, forgotPassword,
      isAuthenticated: !!user,
      portalUrls: PORTAL_URLS,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
