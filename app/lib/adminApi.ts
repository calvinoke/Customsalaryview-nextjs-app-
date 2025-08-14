// lib/adminApi.ts

export async function adminApiFetch(
  path: string,
  options: RequestInit = {},
  router?: any, // no Router type import needed
  token?: string
): Promise<Response> {
  const authToken = token || localStorage.getItem('adminToken')

  if (!authToken) {
    if (router) router.push('/')
    throw new Error('No admin token')
  }

  // Verify token with backend
  const verify = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/verify-token`, {
    headers: { Authorization: `Bearer ${authToken}` },
  })

  if (!verify.ok) {
    localStorage.removeItem('adminToken')
    if (router) router.push('/')
    throw new Error('Invalid token')
  }

  const verifyData = await verify.json()
  if (!verifyData.valid) {
    localStorage.removeItem('adminToken')
    if (router) router.push('/')
    throw new Error('Invalid token')
  }

  // Actual request
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  })
}
