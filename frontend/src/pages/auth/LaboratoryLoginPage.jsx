import LoginForm from '../../components/auth/LoginForm'
import { FlaskConical } from 'lucide-react'

const config = {
  label: 'Laboratory Portal',
  role: 'laboratory',
  color: '#10B981',
  colorLight: '#34D399',
  icon: FlaskConical,
  description: 'Access lab operations to process test orders, manage samples, record results and generate reports.',
  features: ['Test Order Processing', 'Sample Tracking', 'Report Generation', 'Lab Equipment Management'],
}

export default function LaboratoryLoginPage() {
  return <LoginForm role="laboratory" portalConfig={config} />
}
