'use client'

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { forgotPassword, logout } = useAuth()
  const router = useRouter()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim()) return setError('Please enter your email')
    if (!emailRegex.test(email)) return setError('Please enter a valid email address')

    setLoading(true)
    try {
      const res = await forgotPassword(email)
      if (res.success) setMessage(res.message)
      else setError(res.message)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-700">Custom Salary View</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Main container */}
      <main className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby="email-error"
            required
          />
          {error && (
            <p id="email-error" className="text-red-600 text-sm mt-1 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-green-600 text-center font-medium">{message}</p>
        )}
      </main>
    </div>
  )
}
