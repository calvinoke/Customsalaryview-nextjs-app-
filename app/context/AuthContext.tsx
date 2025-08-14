'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { getCsrfCookie, apiGet, apiPost, apiPut, apiDelete } from '../lib/api';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'
};

export type SalaryRecord = {
  id: number;
  name: string;
  email: string;
  salary_local: number;
  salary_euros: number;
  commission: number;
  displayed_salary?: number;
};

export type SalaryData = {
  salary_local: number;
  salary_euros?: number;
  commission?: number;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  salaryRecord: SalaryRecord | null;
  allSalaries: SalaryRecord[] | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: string
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<{ success: boolean; message: string }>;
  fetchUserSalary: () => Promise<void>;
  saveSalary: (data: SalaryData) => Promise<{ success: boolean; message: string }>;
  fetchAllSalaries: () => Promise<SalaryRecord[]>;
  updateSalary: (
    id: number,
    data: Partial<SalaryData>
  ) => Promise<{ success: boolean; message: string }>;
  deleteSalary: (id: number) => Promise<{ success: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [salaryRecord, setSalaryRecord] = useState<SalaryRecord | null>(null);
  const [allSalaries, setAllSalaries] = useState<SalaryRecord[] | null>(null);

  // Load stored token and user
  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Admin auto-refresh: listen to salary changes from other users
  useEffect(() => {
    if (user?.role === 'admin') {
      const handleStorageEvent = (e: StorageEvent) => {
        if (e.key === 'salaryUpdated') {
          fetchAllSalaries().then(setAllSalaries).catch(() => {});
        }
      };
      window.addEventListener('storage', handleStorageEvent);
      return () => window.removeEventListener('storage', handleStorageEvent);
    }
  }, [user]);

  function setAuth(newToken: string, newUser: User) {
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  // ------------------------
  // AUTH FUNCTIONS
  // ------------------------

  async function register(name: string, email: string, password: string, password_confirmation: string, role: string) {
    await getCsrfCookie();
    const data = await apiPost('/api/register', { name, email, password, password_confirmation, role });
    setAuth(data.token, data.user);
    router.push('/login');
  }

  async function login(email: string, password: string): Promise<User> {
  await getCsrfCookie();
  const data = await apiPost('/api/login', { email, password });

  // Save user and token in state + localStorage
  setAuth(data.token, data.user);

  // Return the logged-in user
  return data.user;
}


  async function logout() {
    if (!token) return;
    await getCsrfCookie();
    await apiPost('/api/logout', {}, { Authorization: `Bearer ${token}` });
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setSalaryRecord(null);
    setAllSalaries(null);
    router.push('/login');
  }

  async function forgotPassword(email: string) {
    await getCsrfCookie();
    try {
      await apiPost('/api/forgot-password', { email });
      return { success: true, message: 'Reset link sent! Please check your email.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send reset link' };
    }
  }

  async function resetPassword(token: string, email: string, password: string, password_confirmation: string) {
    await getCsrfCookie();
    try {
      await apiPost('/api/reset-password', { token, email, password, password_confirmation });
      return { success: true, message: 'Password has been reset!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to reset password' };
    }
  }

  // ------------------------
  // SALARY FUNCTIONS
  // ------------------------

  async function fetchUserSalary() {
    if (!token || !user?.email) return;
    try {
      const data = await apiGet(`/api/salaries/${user.email}`, { Authorization: `Bearer ${token}` });
      setSalaryRecord(data);
    } catch {
      setSalaryRecord(null);
    }
  }

  async function saveSalary(salaryData: SalaryData) {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      await apiPost('/api/salaries', { name: user?.name, email: user?.email, ...salaryData }, { Authorization: `Bearer ${token}` });
      await fetchUserSalary();

      // Trigger admin update
      localStorage.setItem('salaryUpdated', Date.now().toString());

      return { success: true, message: 'Salary saved successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error saving salary' };
    }
  }

  async function fetchAllSalaries(): Promise<SalaryRecord[]> {
    if (!token) throw new Error('Not authenticated');
    const data = await apiGet('/api/salaries', { Authorization: `Bearer ${token}` });
    setAllSalaries(data.data || data);
    return data.data || data;
  }

  async function updateSalary(id: number, salaryData: Partial<SalaryData>) {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      await apiPut(`/api/salaries/${id}`, salaryData, { Authorization: `Bearer ${token}` });

      // Trigger admin update
      localStorage.setItem('salaryUpdated', Date.now().toString());

      return { success: true, message: 'Salary updated successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating salary' };
    }
  }

  async function deleteSalary(id: number) {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      await apiDelete(`/api/salaries/${id}`, { Authorization: `Bearer ${token}` });

      // Trigger admin update
      localStorage.setItem('salaryUpdated', Date.now().toString());

      return { success: true, message: 'Salary deleted successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error deleting salary' };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        salaryRecord,
        allSalaries,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        fetchUserSalary,
        saveSalary,
        fetchAllSalaries,
        updateSalary,
        deleteSalary,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
