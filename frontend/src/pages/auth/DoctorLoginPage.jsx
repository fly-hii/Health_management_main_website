import LoginForm from '../../components/auth/LoginForm'
import { Stethoscope } from 'lucide-react'

const config = {
  label: 'Doctor Portal',
  role: 'doctor',
  color: '#0F9D8A',
  colorLight: '#06B6D4',
  icon: Stethoscope,
  description: 'Access your clinical dashboard to manage patient queues, consultations, prescriptions and medical records.',
  features: ['Patient Queue Management', 'Digital Prescriptions', 'EMR Access', 'Appointment Management'],
}

export default function DoctorLoginPage() {
  return <LoginForm role="doctor" portalConfig={config} />
}
