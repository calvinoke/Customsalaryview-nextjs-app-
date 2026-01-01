'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

type SalaryFormState = { salary_local: string }
type SaveSalaryResponse = { success: boolean; message?: string }

export default function SalaryForm() {
  const { user, salaryRecord, fetchUserSalary, saveSalary, logout } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState<SalaryFormState>({ salary_local: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchUserSalary()
  }, [user, fetchUserSalary, router])

  useEffect(() => {
    if (salaryRecord && !form.salary_local) {
      setForm({
        salary_local: salaryRecord.salary_local?.toString() || '',
      })
    }
  }, [salaryRecord, form.salary_local])

  function validateForm(): string {
    if (!form.salary_local.trim()) return 'Salary in local currency is required'
    if (isNaN(Number(form.salary_local)) || Number(form.salary_local) <= 0)
      return 'Salary in local currency must be positive'
    return ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const payload = { salary_local: parseFloat(form.salary_local) }
      const res: SaveSalaryResponse = await saveSalary(payload)

      if (!res.success) setError(res.message || 'Failed to save salary')
      else {
        setSuccess('Salary saved successfully!')
        await fetchUserSalary()
        setTimeout(() => setSuccess(''), 2000)
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Error saving salary')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <main className="max-w-2xl mx-auto mt-12 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-xl shadow-lg border border-indigo-100 flex flex-col">
      <h1 className="text-3xl font-extrabold text-indigo-800 mb-6 text-center">
        Custom Salary View
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">User Salary Details</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Name"
          />
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Email"
          />
          <input
            type="number"
            placeholder="Salary in Local Currency"
            value={form.salary_local}
            onChange={e => setForm({ ...form, salary_local: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit Salary'}
          </button>
        </form>

        {salaryRecord && (
          <section className="mt-4 bg-white p-4 rounded-lg shadow max-h-80 overflow-y-auto">
            <h3 className="text-lg font-semibold text-indigo-600 mb-3">Your Salary Info</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-center rounded overflow-hidden">
                <thead className="sticky top-0 bg-indigo-100 z-10">
                  <tr className="text-indigo-800">
                    <th className="border px-4 py-2">Salary (Local)</th>
                    <th className="border px-4 py-2">Salary (Euros)</th>
                    <th className="border px-4 py-2">Commission (€)</th>
                    <th className="border px-4 py-2">Total (€)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-indigo-50">
                    <td className="border px-4 py-2">{salaryRecord.salary_local ?? 0}</td>
                    <td className="border px-4 py-2">{salaryRecord.salary_euros ?? 0}</td>
                    <td className="border px-4 py-2">{salaryRecord.commission ?? 500}</td>
                    <td className="border px-4 py-2">
                      {(salaryRecord.salary_euros ?? 0) + (salaryRecord.commission ?? 500)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
