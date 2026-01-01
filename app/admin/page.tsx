'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LogoutButton from '../components/LogoutButton';



type SalaryRecord = {
  id: number
  name: string
  email: string
  salary_local: number
  salary_euros: number
  commission: number
}

export default function AdminPanel() {
  const { fetchAllSalaries, updateSalary, deleteSalary } = useAuth()
  const [records, setRecords] = useState<SalaryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<SalaryRecord>>({})

  // Fetch records safely
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true)
      setError('')
      try {
        const recordsArray: SalaryRecord[] = await fetchAllSalaries()
        const computed = recordsArray.map((r) => ({
          ...r,
          commission: r.commission ?? 500,
        }))
        setRecords(computed)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Failed to fetch records')
      }
      setLoading(false)
    }

    fetchRecords()
  }, [fetchAllSalaries]) // safe dependency

  function startEdit(record: SalaryRecord) {
    setEditingId(record.id)
    setEditForm({
      salary_local: record.salary_local,
      salary_euros: record.salary_euros,
      commission: record.commission ?? 500,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  async function saveEdit(id: number) {
    setLoading(true)
    setError('')
    try {
      const result = await updateSalary(id, {
        salary_local: editForm.salary_local,
        salary_euros: editForm.salary_euros,
        commission: editForm.commission ?? 500,
      })
      if (!result.success) setError(result.message)
      else {
        await fetchAllSalariesAndUpdate()
        cancelEdit()
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Error updating record')
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this record?')) return
    setLoading(true)
    setError('')
    try {
      const result = await deleteSalary(id)
      if (!result.success) setError(result.message)
      else await fetchAllSalariesAndUpdate()
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Error deleting record')
    }
    setLoading(false)
  }

  // Helper to refresh records after updates/deletes
  const fetchAllSalariesAndUpdate = async () => {
    try {
      const recordsArray: SalaryRecord[] = await fetchAllSalaries()
      const computed = recordsArray.map((r) => ({
        ...r,
        commission: r.commission ?? 500,
      }))
      setRecords(computed)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Failed to fetch records')
    }
  }

  // Totals
  const totalLocal = records.reduce((sum, r) => {
    return sum + (editingId === r.id ? (editForm.salary_local ?? r.salary_local) : r.salary_local)
  }, 0)

  const totalEuros = records.reduce((sum, r) => {
    return sum + (editingId === r.id ? (editForm.salary_euros ?? r.salary_euros) : r.salary_euros)
  }, 0)

  const totalCommission = records.reduce((sum, r) => {
    const commission = editingId === r.id ? (editForm.commission ?? r.commission ?? 500) : (r.commission ?? 500)
    return sum + commission
  }, 0)

  const totalDisplayed = records.reduce((sum, r) => {
    const euros = editingId === r.id ? (editForm.salary_euros ?? r.salary_euros ?? 0) : (r.salary_euros ?? 0)
    const commission = editingId === r.id ? (editForm.commission ?? r.commission ?? 500) : (r.commission ?? 500)
    return sum + euros + commission
  }, 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start p-6">
      <h1 className="sticky top-4 z-10 text-4xl font-extrabold text-indigo-800 mb-6 bg-blue-50 px-2 rounded">
        Custom Salary View
      </h1>

      <section className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-700">Admin Salary Panel</h2>
          <LogoutButton />
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 text-center text-indigo-600 font-semibold animate-pulse">
            Loading...
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-indigo-100">
              <tr>
                {['Name', 'Email', 'Salary Local', 'Salary Euros', 'Commission (€)', 'Displayed Salary (€)', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-indigo-700 font-semibold text-sm select-none"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No salary records found.
                  </td>
                </tr>
              ) : (
                <>
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-indigo-50 transition-colors duration-200">
                      <td className="border px-4 py-3 text-gray-800 font-medium">{record.name}</td>
                      <td className="border px-4 py-3 text-gray-700 truncate max-w-xs">{record.email}</td>
                      <td className="border px-4 py-3 text-center">
                        {editingId === record.id ? (
                          <input
                            type="number"
                            value={editForm.salary_local ?? ''}
                            onChange={e => setEditForm({ ...editForm, salary_local: Number(e.target.value) })}
                            className="w-28 border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : record.salary_local}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {editingId === record.id ? (
                          <input
                            type="number"
                            value={editForm.salary_euros ?? ''}
                            onChange={e => setEditForm({ ...editForm, salary_euros: Number(e.target.value) })}
                            className="w-28 border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : record.salary_euros}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {editingId === record.id ? (
                          <input
                            type="number"
                            value={editForm.commission ?? ''}
                            onChange={e => setEditForm({ ...editForm, commission: Number(e.target.value) })}
                            className="w-28 border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : record.commission}
                      </td>
                      <td className="border px-4 py-3 text-center font-semibold text-indigo-800">
                        {(() => {
                          const euros = editingId === record.id ? (editForm.salary_euros ?? record.salary_euros ?? 0) : (record.salary_euros ?? 0)
                          const commission = editingId === record.id ? (editForm.commission ?? record.commission ?? 500) : (record.commission ?? 500)
                          return euros + commission
                        })()}
                      </td>
                      <td className="border px-4 py-3 text-center space-x-2 whitespace-nowrap">
                        {editingId === record.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(record.id)}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded-md transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={loading}
                              className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-3 py-1 rounded-md transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(record)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-indigo-50 font-bold text-indigo-700">
                    <td className="border px-4 py-3 text-center" colSpan={2}>Totals</td>
                    <td className="border px-4 py-3 text-center">{totalLocal.toFixed(2)}</td>
                    <td className="border px-4 py-3 text-center">{totalEuros.toFixed(2)}</td>
                    <td className="border px-4 py-3 text-center">{totalCommission.toFixed(2)}</td>
                    <td className="border px-4 py-3 text-center">{totalDisplayed.toFixed(2)}</td>
                    <td className="border px-4 py-3 text-center"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
