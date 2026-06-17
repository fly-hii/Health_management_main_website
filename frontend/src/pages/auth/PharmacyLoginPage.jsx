import LoginForm from '../../components/auth/LoginForm'
import { Pill } from 'lucide-react'

const config = {
  label: 'Pharmacy Portal',
  role: 'pharmacy',
  color: '#F59E0B',
  colorLight: '#FBBF24',
  icon: Pill,
  description: 'Access pharmacy management to process prescriptions, manage medicine inventory and track dispensing.',
  features: ['Prescription Processing', 'Medicine Inventory', 'Drug Interaction Alerts', 'Stock Management'],
}

export default function PharmacyLoginPage() {
  return <LoginForm role="pharmacy" portalConfig={config} />
}
