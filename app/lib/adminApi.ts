// lib/adminApi.ts
'use client'

export async function adminApiFetch(
  path: string,
  options: RequestInit = {},
  router?: { push: (url: string) => void },
  token?: string
): Promise<Response> {
  const authToken = token || localStorage.getItem('adminToken')

  if (!authToken) {
    if (router) router.push('/')
    throw new Error('No admin token')
  }

  // Verify token with backend
  const verifyResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/admin/verify-token`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  )

  if (!verifyResponse.ok) {
    localStorage.removeItem('adminToken')
    if (router) router.push('/')
    throw new Error('Invalid token')
  }

  const verifyData: { valid: boolean } = await verifyResponse.json()
  if (!verifyData.valid) {
    localStorage.removeItem('adminToken')
    if (router) router.push('/')
    throw new Error('Invalid token')
  }

  // Perform the actual request
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  })

  return response
}
