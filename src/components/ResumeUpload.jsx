import { useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

async function extractTextFromPdf(file) {
  const bytes = await file.arrayBuffer()
  const loadingTask = getDocument({ data: bytes })
  const pdf = await loadingTask.promise
  const pages = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')
    pages.push(pageText)
  }

  return pages.join('\n').replace(/\s+/g, ' ').trim()
}

export default function ResumeUpload({ onAnalyze, isLoading }) {
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('Frontend Developer')
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please choose a PDF resume first.')
      return
    }

    setError('')

    try {
      const text = await extractTextFromPdf(file)
      if (!text) {
        throw new Error('This PDF has no readable text. Try another resume file.')
      }
      await onAnalyze({ text, targetRole, resumeName: file.name })
    } catch (err) {
      setError(err.message || 'Unable to process this PDF file.')
    }
  }

  return (
    <section className="card-shell animate-rise space-y-5 rounded-3xl p-5 sm:p-6">
      <div>
        <h2 className="brand-heading text-xl font-bold text-white sm:text-2xl">
          Upload Resume
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Upload a PDF and get score, strengths, weaknesses, and suggestions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-200">Target role</span>
          <input
            className="input-surface w-full rounded-xl px-4 py-3 text-slate-100 outline-none ring-flare/60 transition focus:ring"
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Frontend Developer"
            value={targetRole}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-200">Resume (PDF)</span>
          <input
            accept="application/pdf"
            className="input-surface w-full cursor-pointer rounded-xl px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-foam file:px-4 file:py-2 file:font-semibold file:text-ink"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            type="file"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        className="rounded-2xl bg-flare px-5 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
        onClick={handleAnalyze}
        type="button"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </section>
  )
}
