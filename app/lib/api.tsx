'use client';

import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch CSRF cookie from Laravel Sanctum
 */
export async function getCsrfCookie() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include', // Important for sending cookies
  });
}

/**
 * Helper for POST requests with automatic CSRF header
 */
export async function apiPost(
  endpoint: string,
  data: any,
  extraHeaders: Record<string, string> = {}
 ) {
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

  return response.json();
}

/**
 * Helper for GET requests with optional CSRF
 */
export async function apiGet(
  endpoint: string,
  extraHeaders: Record<string, string> = {}
 ) {
  await getCsrfCookie(); // Added CSRF fetch for consistency

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

  return response.json();
}

/**
 * Helper for PUT requests
 */
export async function apiPut(
  endpoint: string,
  data: any,
  extraHeaders: Record<string, string> = {}
 ) {
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

  return response.json();
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete(
  endpoint: string,
  extraHeaders: Record<string, string> = {}
 ) {
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

  return response.json();
}
