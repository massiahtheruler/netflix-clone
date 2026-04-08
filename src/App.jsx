import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { auth } from './firebase'
import spinner from './assets netflix/netflix_spinner.gif'
import './App.css'

const TEST_AUTH_DELAY_MS = import.meta.env.DEV ? 2000 : 0

function AuthLoadingScreen() {
  return (
    <div className='auth-loading'>
      <img src={spinner} alt='Loading' className='auth-loading__spinner' />
      <p>Loading your Netflix experience...</p>
    </div>
  )
}

function useAuthDelay() {
  const [delayDone, setDelayDone] = useState(TEST_AUTH_DELAY_MS === 0)

  useEffect(() => {
    if (TEST_AUTH_DELAY_MS === 0) {
      return
    }

    const timer = setTimeout(() => {
      setDelayDone(true)
    }, TEST_AUTH_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  return delayDone
}

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth)
  const delayDone = useAuthDelay()

  if (loading || !delayDone) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return children
}

function PublicRoute({ children }) {
  const [user, loading] = useAuthState(auth)
  const delayDone = useAuthDelay()

  if (loading || !delayDone) {
    return <AuthLoadingScreen />
  }

  if (user) {
    return <Navigate to='/' replace />
  }

  return children
}

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/player/:id' element={<ProtectedRoute><Player /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
