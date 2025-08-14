'use client'
import React, { useContext } from 'react'
import { useAuth } from '../context/AuthContext';

export function LogoutButton() {
  const auth =  useAuth()
  return (
    <button
      onClick={() => auth?.logout()}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  )
}
