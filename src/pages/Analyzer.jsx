import { useState } from 'react'
import AnalysisCard from '../components/AnalysisCard.jsx'
import ResumeUpload from '../components/ResumeUpload.jsx'
import { useAuth } from '../context/useAuth.jsx'
import { createAnalysis } from '../services/analysisStore.js'
import { analyzeResumeWithAI } from '../services/groq.js'

export default function Analyzer() {
  const { user } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const handleAnalyze = async ({ text, targetRole, resumeName }) => {
    setIsLoading(true)
    setError('')
    setSavedMessage('')

    try {
      const aiResult = await analyzeResumeWithAI({ resumeText: text, targetRole })

      const payload = {
        ...aiResult,
        targetRole,
        resumeName,
        createdAt: new Date().toISOString(),
      }

      setAnalysis(payload)
      await createAnalysis(user.uid, payload)
      setSavedMessage('Analysis saved to your history.')
    } catch (err) {
      setError(err.message || 'Analysis failed. Please retry.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="animate-rise rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
        <h1 className="brand-heading text-2xl font-bold text-white sm:text-3xl">
          Resume Analyzer
        </h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Upload your resume, select a role, and receive AI-based score and improvement feedback.
        </p>
      </div>

      <ResumeUpload isLoading={isLoading} onAnalyze={handleAnalyze} />

      {isLoading ? (
        <div className="card-shell animate-rise rounded-3xl p-6 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-foam/30 border-t-foam" />
          <p className="mt-3 text-sm text-slate-300">Analyzing your resume with AI...</p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {savedMessage ? (
        <p className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {savedMessage}
        </p>
      ) : null}

      {analysis ? <AnalysisCard analysis={analysis} showMeta={false} /> : null}
    </div>
  )
}
