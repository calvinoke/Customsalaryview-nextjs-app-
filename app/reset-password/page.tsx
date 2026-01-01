'use client'

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const { resetPassword, logout } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const res: { message?: string } = await resetPassword(
        token,
        email,
        password,
        passwordConfirmation
      )

      setMessage(res.message || 'Password reset successfully!')
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Password reset failed.')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
        Custom Salary View
      </h1>

      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-600">
            User Password Reset Details
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-center">Reset Password</h3>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}
