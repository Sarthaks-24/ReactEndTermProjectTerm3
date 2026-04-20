import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-foam text-ink'
      : 'text-slate-200 hover:bg-white/10 hover:text-white'
  }`
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/70 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="brand-heading text-lg font-bold text-foam sm:text-xl" to="/analyzer">
          AI Resume Analyzer
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink className={navClass} to="/analyzer">
            Analyzer
          </NavLink>
          <NavLink className={navClass} to="/dashboard">
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-300 sm:block">{user?.email}</span>
          <button
            className="rounded-full bg-flare px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
