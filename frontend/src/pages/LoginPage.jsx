import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../stores/authStore'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const navigate  = useNavigate()
  const login     = useAuthStore((s) => s.login)
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br
                    from-[var(--color-blush)] via-[var(--color-lavender)] to-[var(--color-sky)]">
      <div className="kawaii-card w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-5xl float-anim inline-block">🌸</span>
          <h2 className="text-3xl font-black text-[var(--color-primary)] mt-2">Welcome back!</h2>
          <p className="text-[var(--color-text-soft)] text-sm mt-1">Sign in to your Lumina world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[var(--color-muted)]
                         bg-[var(--color-surface)] outline-none focus:border-[var(--color-primary)]
                         transition-colors text-sm font-semibold"
              placeholder="hello@lumina.app"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[var(--color-muted)]
                         bg-[var(--color-surface)] outline-none focus:border-[var(--color-primary)]
                         transition-colors text-sm font-semibold"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In ✨'}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-soft)] mt-4">
          New here?{' '}
          <Link to="/register" className="font-bold text-[var(--color-primary)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
