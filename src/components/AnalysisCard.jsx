import ScoreBar from './ScoreBar.jsx'

function Section({ title, points, tone }) {
  const accent =
    tone === 'good'
      ? 'border-emerald-300/30 bg-emerald-500/10'
      : tone === 'warn'
        ? 'border-amber-300/30 bg-amber-500/10'
        : 'border-sky-300/30 bg-sky-500/10'

  return (
    <section className={`rounded-2xl border p-4 ${accent}`}>
      <h4 className="mb-2 font-semibold text-white">{title}</h4>
      <ul className="space-y-1 text-sm text-slate-200">
        {points?.length ? (
          points.map((point, idx) => <li key={`${title}-${idx}`}>• {point}</li>)
        ) : (
          <li>No insights available yet.</li>
        )}
      </ul>
    </section>
  )
}

export default function AnalysisCard({ analysis, showMeta = true, onDelete }) {
  return (
    <article className="card-shell animate-rise space-y-5 rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="brand-heading text-xl font-bold text-white">Analysis Result</h3>
          {showMeta ? (
            <p className="mt-1 text-sm text-slate-300">
              {analysis.resumeName || 'Uploaded Resume'}
              {' | '}
              Role: {analysis.targetRole || 'General'}
              {' | '}
              {new Date(analysis.createdAt).toLocaleString()}
            </p>
          ) : null}
        </div>

        {onDelete ? (
          <button
            className="rounded-full border border-rose-300/40 px-3 py-1.5 text-sm text-rose-200 transition hover:bg-rose-500/20"
            onClick={() => onDelete(analysis.id)}
            type="button"
          >
            Delete
          </button>
        ) : null}
      </div>

      <ScoreBar score={analysis.score} />

      <div className="grid gap-4 md:grid-cols-3">
        <Section points={analysis.strengths} title="Strengths" tone="good" />
        <Section points={analysis.weaknesses} title="Weaknesses" tone="warn" />
        <Section points={analysis.suggestions} title="Suggestions" tone="tip" />
      </div>
    </article>
  )
}
