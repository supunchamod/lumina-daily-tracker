import { Outlet, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import useAuthStore from '../../stores/authStore'

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <Outlet />
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            color: 'var(--color-text)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-kawaii)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
          },
        }}
      />
    </div>
  )
}
