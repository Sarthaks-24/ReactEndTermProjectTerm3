import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

export default function Login() {
  const { user, login, signup, loginWithGoogle, isFirebaseEnabled } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/analyzer" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      if (isSignup) {
        await signup(form.email, form.password)
      } else {
        await login(form.email, form.password)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <section className="card-shell w-full max-w-md animate-rise rounded-3xl p-6 sm:p-8">
        <h1 className="brand-heading text-2xl font-bold text-foam">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {isSignup
            ? 'Sign up to save and track resume improvements.'
            : 'Log in to continue your resume analysis journey.'}
        </p>

        {!isFirebaseEnabled ? (
          <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Firebase keys are missing. App is running in local demo mode.
          </p>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-surface w-full rounded-xl px-4 py-3 text-slate-100 outline-none ring-flare/60 transition focus:ring"
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            required
            type="email"
            value={form.email}
          />

          <input
            className="input-surface w-full rounded-xl px-4 py-3 text-slate-100 outline-none ring-flare/60 transition focus:ring"
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            required
            type="password"
            value={form.password}
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            className="w-full rounded-xl bg-flare px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          className="mt-3 w-full rounded-xl border border-foam/35 bg-foam/10 px-4 py-3 font-semibold text-foam transition hover:bg-foam/20"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          type="button"
        >
          {isSubmitting ? 'Please wait...' : 'Continue with Google'}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="font-semibold text-foam underline decoration-dotted underline-offset-4"
            onClick={() => setIsSignup((prev) => !prev)}
            type="button"
          >
            {isSignup ? 'Login here' : 'Sign up here'}
          </button>
        </p>

        <p className="mt-3 text-xs text-slate-400">
          After login, go to <Link className="text-foam" to="/analyzer">Analyzer</Link> to upload your resume.
        </p>
      </section>
    </div>
  )
}
