'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LogoutPage() {
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err: any) {
      console.error('Logout failed:', err.message || err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
