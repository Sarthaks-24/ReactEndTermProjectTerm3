export default function ScoreBar({ score = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Resume Score</span>
        <span className="font-semibold text-foam">{safeScore}/100</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-flare to-foam transition-all duration-700"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  )
}
