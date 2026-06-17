import LoginForm from '../../components/auth/LoginForm'
import { User } from 'lucide-react'

const config = {
  label: 'Patient Portal',
  role: 'patient',
  color: '#06B6D4',
  colorLight: '#22D3EE',
  icon: User,
  description: 'Access your personal health portal to view appointments, test reports, prescriptions and medical history.',
  features: ['Appointment Booking', 'Lab Reports Access', 'Prescription History', 'Medical Records'],
}

export default function PatientLoginPage() {
  return <LoginForm role="patient" portalConfig={config} />
}
