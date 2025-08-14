'use client'

import React, { useState } from 'react'
import { useAuth, User } from '../context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Password strength helpers
function calculatePasswordStrength(password: string) {
  let score = 0
  if (!password) return score
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

function getStrengthLabel(score: number) {
  switch (score) {
    case 0:
    case 1:
      return { label: 'Very Weak', color: 'bg-red-500' }
    case 2:
      return { label: 'Weak', color: 'bg-orange-500' }
    case 3:
      return { label: 'Fair', color: 'bg-yellow-400' }
    case 4:
      return { label: 'Good', color: 'bg-green-400' }
    case 5:
    case 6:
      return { label: 'Strong', color: 'bg-green-600' }
    default:
      return { label: '', color: '' }
  }
}

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const strengthScore = calculatePasswordStrength(form.password)
  const strength = getStrengthLabel(strengthScore)

  function validateForm() {
    const newErrors: { email?: string; password?: string } = {}
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email'

    if (!form.password.trim()) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 chars'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setErrors({})

    if (!validateForm()) return

    setLoading(true)
    try {
      const loggedInUser: User = await auth.login(form.email, form.password)
      setSuccess('Login successful! Redirecting...')

      if (loggedInUser.role === 'admin') router.push('/admin')
      else router.push('/salary')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      {/* Wider container to fit header */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600 text-center mb-2 drop-shadow-md whitespace-nowrap">
          Custom Salary View
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 text-center mb-6">
          Login to your account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              required
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {form.password && (
            <div className="flex items-center space-x-2 mt-1">
              <div
                className={`h-2 flex-1 rounded ${strength.color}`}
                style={{ width: `${(strengthScore / 6) * 100}%` }}
              />
              <span className="text-sm font-semibold text-gray-700">{strength.label}</span>
            </div>
          )}

          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline text-left">
            Forgot password?
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mt-2 text-center">{success}</p>}

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
