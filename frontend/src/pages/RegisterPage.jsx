import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../stores/authStore'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const navigate  = useNavigate()
  const register  = useAuthStore((s) => s.register)
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      toast.success('Account created! Welcome to Lumina ✨')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach((msgs) => toast.error(msgs[0]))
      } else {
        toast.error(err.response?.data?.message ?? 'Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `
    w-full px-4 py-2.5 rounded-2xl border-2 border-[var(--color-muted)]
    bg-[var(--color-surface)] outline-none focus:border-[var(--color-primary)]
    transition-colors text-sm font-semibold
  `

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br
                    from-[var(--color-blush)] via-[var(--color-lavender)] to-[var(--color-sky)]">
      <div className="kawaii-card w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-5xl float-anim inline-block">🌱</span>
          <h2 className="text-3xl font-black text-[var(--color-primary)] mt-2">Join Lumina!</h2>
          <p className="text-[var(--color-text-soft)] text-sm mt-1">
            Start your kawaii planning journey ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              className={inputClass}
              placeholder="Sakura ✿"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              className={inputClass}
              placeholder="you@lumina.app"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-text)] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={set('password_confirmation')}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account 🌸'}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-soft)] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
