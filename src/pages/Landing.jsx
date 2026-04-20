import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <section className="animate-rise overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foam/90">
              Smart Resume Insights
            </p>

            <h1 className="brand-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              AI Resume Analyzer
              <span className="block text-flare">Built for Faster Job Wins</span>
            </h1>

            <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
              Upload your resume, target a role, and get a clear score with actionable strengths,
              weaknesses, and improvement suggestions in seconds.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                className="rounded-full bg-flare px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                to={user ? '/analyzer' : '/login'}
              >
                {user ? 'Go to Analyzer' : 'Get Started'}
              </Link>
              <Link
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                to={user ? '/dashboard' : '/login'}
              >
                {user ? 'View Dashboard' : 'Login'}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
          <article className="card-shell animate-rise rounded-2xl p-5" style={{ animationDelay: '60ms' }}>
            <h2 className="brand-heading text-lg font-semibold text-white">Role-based Analysis</h2>
            <p className="mt-2 text-sm text-slate-300">
              Compare your resume against the role you want, not a generic checklist.
            </p>
          </article>

          <article className="card-shell animate-rise rounded-2xl p-5" style={{ animationDelay: '120ms' }}>
            <h2 className="brand-heading text-lg font-semibold text-white">Actionable Feedback</h2>
            <p className="mt-2 text-sm text-slate-300">
              Get concise strengths, weaknesses, and next-step suggestions you can use immediately.
            </p>
          </article>

          <article className="card-shell animate-rise rounded-2xl p-5" style={{ animationDelay: '180ms' }}>
            <h2 className="brand-heading text-lg font-semibold text-white">Saved History</h2>
            <p className="mt-2 text-sm text-slate-300">
              Track analyses over time in your dashboard and monitor your resume improvements.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}