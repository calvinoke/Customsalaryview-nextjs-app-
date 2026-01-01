'use client'

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
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

export default function RegisterPage() {
  const auth = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const strengthScore = calculatePasswordStrength(form.password)
  const strength = getStrengthLabel(strengthScore)

  function validateForm() {
    const newErrors: Partial<typeof form> = {}

    if (!form.name.trim()) newErrors.name = 'Name is required'
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'

    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address'

    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (!form.password_confirmation) newErrors.password_confirmation = 'Please confirm your password'
    else if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Passwords do not match'

    if (!form.role) newErrors.role = 'Please select a role'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)
    try {
      await auth.register(
        form.name,
        form.email,
        form.password,
        form.password_confirmation,
        form.role
      )
      setSuccess('Registration successful! Redirecting to login...')

      setForm({ name: '', email: '', password: '', password_confirmation: '', role: '' })
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600 text-center mb-2 drop-shadow-md whitespace-nowrap">
          Custom Salary View
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            required
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            required
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

          {/* Password */}
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
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            {form.password && (
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className={`h-2 flex-1 rounded ${strength.color} transition-all duration-300`}
                  style={{ width: `${(strengthScore / 6) * 100}%` }}
                />
                <span className="text-sm font-semibold text-gray-700">{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showPasswordConfirm ? 'Hide' : 'Show'}
            </button>
            {errors.password_confirmation && <p className="text-red-600 text-sm">{errors.password_confirmation}</p>}
          </div>

          {/* Role */}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className={`w-full border rounded px-3 py-2 ${errors.role ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            required
          >
            <option value="" disabled>Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mt-2 text-center">{success}</p>}

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
