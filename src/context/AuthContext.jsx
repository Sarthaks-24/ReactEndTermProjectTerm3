import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContextObject.js'
import { auth, isFirebaseEnabled } from '../services/firebase.js'

const LOCAL_USER_KEY = 'resume-analyzer-local-user'

function normalizeUser(user) {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email ?? 'demo@local.dev',
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Guest User',
  }
}

function createLocalUser(email = 'demo@local.dev') {
  const safeEmail = email.trim().toLowerCase() || 'demo@local.dev'
  return {
    uid: `local-${safeEmail}`,
    email: safeEmail,
    displayName: safeEmail.split('@')[0],
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (isFirebaseEnabled) return null

    const storedUser = localStorage.getItem(LOCAL_USER_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isLoading, setIsLoading] = useState(isFirebaseEnabled)

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(normalizeUser(nextUser))
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const signup = async (email, password) => {
    if (isFirebaseEnabled && auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      return normalizeUser(credential.user)
    }

    const nextUser = createLocalUser(email)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const login = async (email, password) => {
    if (isFirebaseEnabled && auth) {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      return normalizeUser(credential.user)
    }

    if (!password?.trim()) {
      throw new Error('Password is required in demo mode.')
    }

    const nextUser = createLocalUser(email)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const loginWithGoogle = async () => {
    if (isFirebaseEnabled && auth) {
      const provider = new GoogleAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      return normalizeUser(credential.user)
    }

    const nextUser = createLocalUser('google-demo@local.dev')
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const logout = async () => {
    if (isFirebaseEnabled && auth) {
      await signOut(auth)
      return
    }
    localStorage.removeItem(LOCAL_USER_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      loginWithGoogle,
      logout,
      isFirebaseEnabled,
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
