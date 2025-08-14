// app/layout.tsx
import './globals.css'
import { AuthProviderWrapper } from './providers/AuthProviderWrapper'

export const metadata = {
  title: 'Salary Management System',
  description: 'Manage salaries efficiently',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  )
}
