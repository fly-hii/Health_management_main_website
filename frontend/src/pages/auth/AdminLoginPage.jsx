import LoginForm from '../../components/auth/LoginForm'
import { Shield } from 'lucide-react'

const config = {
  label: 'Admin Portal',
  role: 'admin',
  color: '#6366F1',
  colorLight: '#8B5CF6',
  icon: Shield,
  description: 'Access the hospital administration panel to manage users, roles, permissions, and system-wide operations.',
  features: ['User Management', 'Role & Permission Control', 'Audit Logs', 'System Health Monitor'],
}

export default function AdminLoginPage() {
  return <LoginForm role="admin" portalConfig={config} />
}
