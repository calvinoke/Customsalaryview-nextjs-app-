'use client';

import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch CSRF cookie from Laravel Sanctum
 */
export async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include', // Important for sending cookies
  });
}

/**
 * Generic helper for POST requests with automatic CSRF header
 */
export async function apiPost<T = any>(
  endpoint: string,
  data: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  await getCsrfCookie();
  const xsrfToken = Cookies.get('XSRF-TOKEN');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    ...extraHeaders,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
}

/**
 * Generic helper for GET requests
 */
export async function apiGet<T = any>(
  endpoint: string,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  await getCsrfCookie();

  const xsrfToken = Cookies.get('XSRF-TOKEN');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    ...extraHeaders,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
}

/**
 * Generic helper for PUT requests
 */
export async function apiPut<T = any>(
  endpoint: string,
  data: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  await getCsrfCookie();

  const xsrfToken = Cookies.get('XSRF-TOKEN');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    ...extraHeaders,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
}

/**
 * Generic helper for DELETE requests
 */
export async function apiDelete<T = any>(
  endpoint: string,
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  await getCsrfCookie();

  const xsrfToken = Cookies.get('XSRF-TOKEN');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    ...extraHeaders,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
}
