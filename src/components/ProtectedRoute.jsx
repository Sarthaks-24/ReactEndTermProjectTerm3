import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-slate-100">
        <div className="animate-pulse text-lg">Checking authentication...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
