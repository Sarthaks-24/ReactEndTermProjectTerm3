import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseEnabled } from './firebase.js'

function localKey(userId) {
  return `resume-analyses:${userId}`
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString()
  if (typeof value === 'string') return value
  if (typeof value?.toDate === 'function') return value.toDate().toISOString()
  return new Date(value).toISOString()
}

function readLocalAnalyses(userId) {
  const raw = localStorage.getItem(localKey(userId))
  return raw ? JSON.parse(raw) : []
}

function writeLocalAnalyses(userId, analyses) {
  localStorage.setItem(localKey(userId), JSON.stringify(analyses))
}

export async function listAnalyses(userId) {
  if (!userId) return []

  if (isFirebaseEnabled && db) {
    const analysesRef = collection(db, 'users', userId, 'analyses')
    const snapshot = await getDocs(query(analysesRef, orderBy('createdAt', 'desc')))
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
      createdAt: toIsoDate(item.data().createdAt),
    }))
  }

  return readLocalAnalyses(userId)
}

export async function createAnalysis(userId, analysis) {
  if (!userId) {
    throw new Error('User not found. Please log in again.')
  }

  const payload = {
    score: analysis.score,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    suggestions: analysis.suggestions,
    targetRole: analysis.targetRole,
    resumeName: analysis.resumeName,
    createdAt: new Date().toISOString(),
  }

  if (isFirebaseEnabled && db) {
    const analysesRef = collection(db, 'users', userId, 'analyses')
    const docRef = await addDoc(analysesRef, {
      ...payload,
      createdAt: serverTimestamp(),
    })
    return { ...payload, id: docRef.id }
  }

  const existing = readLocalAnalyses(userId)
  const next = [{ ...payload, id: crypto.randomUUID() }, ...existing]
  writeLocalAnalyses(userId, next)
  return next[0]
}

export async function editAnalysis(userId, analysisId, updates) {
  if (isFirebaseEnabled && db) {
    const analysisRef = doc(db, 'users', userId, 'analyses', analysisId)
    await updateDoc(analysisRef, updates)
    return
  }

  const existing = readLocalAnalyses(userId)
  const next = existing.map((entry) =>
    entry.id === analysisId ? { ...entry, ...updates } : entry,
  )
  writeLocalAnalyses(userId, next)
}

export async function removeAnalysis(userId, analysisId) {
  if (isFirebaseEnabled && db) {
    const analysisRef = doc(db, 'users', userId, 'analyses', analysisId)
    await deleteDoc(analysisRef)
    return
  }

  const existing = readLocalAnalyses(userId)
  const next = existing.filter((entry) => entry.id !== analysisId)
  writeLocalAnalyses(userId, next)
}
