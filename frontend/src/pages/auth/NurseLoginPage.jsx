import LoginForm from '../../components/auth/LoginForm'
import { UserCheck } from 'lucide-react'

const config = {
  label: 'Nurse Portal',
  role: 'nurse',
  color: '#8B5CF6',
  colorLight: '#A78BFA',
  icon: UserCheck,
  description: 'Access nursing dashboard to record vitals, manage patient care, coordinate treatments and daily tasks.',
  features: ['Vitals Recording', 'Patient Care Tracking', 'Treatment Coordination', 'Nursing Task Management'],
}

export default function NurseLoginPage() {
  return <LoginForm role="nurse" portalConfig={config} />
}
