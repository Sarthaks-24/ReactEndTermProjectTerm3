const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const MODEL_NAME = import.meta.env.VITE_GROQ_MODEL
const MAX_RESUME_CHARS = 12000

function clampResumeText(resumeText) {
  const cleanText = resumeText.trim().replace(/\s+/g, ' ')
  return cleanText.slice(0, MAX_RESUME_CHARS)
}

function buildPrompt(resumeText, targetRole) {
  return [
    'Analyze the following resume and return strict JSON only.',
    `Target role: ${targetRole}.`,
    'Schema:',
    '{"score":number,"strengths":[string],"weaknesses":[string],"suggestions":[string]}',
    'Rules:',
    '- score is between 0 and 100.',
    '- Keep each list between 3 and 5 short bullet points.',
    '- Do not include markdown, labels, or extra keys.',
    `Resume text: ${resumeText}`,
  ].join('\n')
}

function fallbackAnalysis(resumeText, targetRole) {
  const text = resumeText.toLowerCase()
  const hasNumbers = /\d/.test(text)
  const hasSkillsSection = /skills|technologies|tech stack/.test(text)
  const hasProjects = /project|experience|intern/.test(text)

  let score = 52
  if (hasNumbers) score += 12
  if (hasSkillsSection) score += 10
  if (hasProjects) score += 10
  if (resumeText.length > 3500) score += 8

  return {
    score: Math.min(score, 95),
    strengths: [
      'Resume appears structured and includes core profile information.',
      hasProjects
        ? 'Projects and/or experience sections are present, which supports credibility.'
        : 'Resume has a base structure ready for project-focused improvement.',
      hasSkillsSection
        ? 'Skills are explicitly listed, helping recruiter and ATS scanning.'
        : 'Language and formatting suggest reasonable ATS readability.',
    ],
    weaknesses: [
      'Some bullets likely lack measurable impact or quantified outcomes.',
      `Content may not be fully tailored for the ${targetRole} role.`,
      'Keyword coverage for ATS may be uneven across technical and soft skills.',
    ],
    suggestions: [
      'Add impact-driven bullets using metrics such as %, time saved, or revenue impact.',
      `Align summary and top skills directly to ${targetRole} expectations.`,
      'Mirror common job-description keywords and keep formatting ATS-friendly.',
    ],
  }
}

function parseStrictJson(text) {
  const trimmed = text.trim()
  const first = trimmed.indexOf('{')
  const last = trimmed.lastIndexOf('}')
  if (first === -1 || last === -1) {
    throw new Error('AI response did not include valid JSON.')
  }
  return JSON.parse(trimmed.slice(first, last + 1))
}

function buildGroqRequestBody(prompt) {
  return JSON.stringify({
    model: MODEL_NAME,
    temperature: 0.2,
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: 'You are a resume reviewer that only returns strict JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })
}

async function requestGroqAnalysis(prompt) {
  if (!MODEL_NAME) {
    throw new Error('Groq model is not configured. Please set VITE_GROQ_MODEL.')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: buildGroqRequestBody(prompt),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq request failed: ${errorText || 'Unknown error'}`)
  }

  const payload = await response.json()
  const raw = payload?.choices?.[0]?.message?.content

  if (!raw) {
    throw new Error('Groq response was empty.')
  }

  return raw
}

export async function analyzeResumeWithAI({ resumeText, targetRole }) {
  const role = targetRole?.trim() || 'Frontend Developer'
  const text = clampResumeText(resumeText)

  if (!text) {
    throw new Error('Resume text is empty. Please upload a valid PDF.')
  }

  if (!GROQ_API_KEY || !MODEL_NAME) {
    return fallbackAnalysis(text, role)
  }

  const raw = await requestGroqAnalysis(buildPrompt(text, role))
  const data = parseStrictJson(raw)

  return {
    score: Number(data.score) || 0,
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
  }
}