import { useEffect, useState } from 'react'
import AnalysisCard from '../components/AnalysisCard.jsx'
import { useAuth } from '../context/useAuth.jsx'
import { listAnalyses, removeAnalysis } from '../services/analysisStore.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const analyses = await listAnalyses(user.uid)
        setItems(analyses)
      } catch (err) {
        setError(err.message || 'Unable to load analyses.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [user.uid])

  const handleDelete = async (analysisId) => {
    try {
      await removeAnalysis(user.uid, analysisId)
      setItems((prev) => prev.filter((entry) => entry.id !== analysisId))
    } catch (err) {
      setError(err.message || 'Delete failed.')
    }
  }

  return (
    <div className="space-y-6">
      <section className="animate-rise rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
        <h1 className="brand-heading text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-slate-300">
          Track every resume analysis with score history and actionable feedback.
        </p>
      </section>

      {error ? (
        <p className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="card-shell rounded-2xl p-6 text-sm text-slate-300">Loading history...</div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="card-shell rounded-2xl p-6 text-sm text-slate-300">
          No analyses yet. Go to Analyzer and run your first resume check.
        </div>
      ) : null}

      <div className="space-y-4">
        {items.map((analysis, idx) => (
          <div className="animate-rise" key={analysis.id} style={{ animationDelay: `${idx * 80}ms` }}>
            <AnalysisCard analysis={analysis} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}
