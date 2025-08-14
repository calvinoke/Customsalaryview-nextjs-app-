'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-indigo-100 px-4 py-12">
      {/* Central container */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col items-center">
        {/* Page title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600 text-center"
          style={{ textShadow: '0 4px 10px rgba(99, 102, 241, 0.3)', lineHeight: '1.1' }}
        >
          Custom Salary View
        </h1>

        {/* Intro text */}
        <p className="mb-8 text-center text-gray-700 text-base sm:text-lg md:text-xl max-w-xl">
          Welcome to the Salary Management System. Manage and view salary details securely with role-based access.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 w-full">
          <Link
            href="/login"
            className="flex-1 text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex-1 text-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
          >
            Register
          </Link>
        </div>

        {/* Features card */}
        <section className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8 shadow-inner">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-700">Features:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
            <li>User and Admin login</li>
            <li>Role-based salary management</li>
            <li>Commission and salary tracking</li>
            <li>Responsive design with secure authentication</li>
            <li>Modern and mobile-friendly interface</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
