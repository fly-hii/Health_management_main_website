import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import ModulesPage from './pages/ModulesPage'
import SubscriptionPage from './pages/SubscriptionPage'
import ContactPage from './pages/ContactPage'
import SystemStatusPage from './pages/SystemStatusPage'
import SupportPage from './pages/SupportPage'
import LoginSelectorPage from './pages/LoginSelectorPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import DoctorLoginPage from './pages/auth/DoctorLoginPage'
import NurseLoginPage from './pages/auth/NurseLoginPage'
import PharmacyLoginPage from './pages/auth/PharmacyLoginPage'
import LaboratoryLoginPage from './pages/auth/LaboratoryLoginPage'
import PatientLoginPage from './pages/auth/PatientLoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'
import ChatAssistant from './components/layout/ChatAssistant'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/system-status" element={<SystemStatusPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* Login pages – no footer/header wrapper needed for portal */}
        <Route path="/login" element={<LoginSelectorPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/doctor/login" element={<DoctorLoginPage />} />
        <Route path="/nurse/login" element={<NurseLoginPage />} />
        <Route path="/pharmacy/login" element={<PharmacyLoginPage />} />
        <Route path="/laboratory/login" element={<LaboratoryLoginPage />} />
        <Route path="/patient/login" element={<PatientLoginPage />} />
      </Routes>
      <ChatAssistant />
    </>
  )
}
