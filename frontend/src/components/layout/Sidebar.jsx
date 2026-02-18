import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Flame, CheckSquare, Gift, Trophy, User, LogOut } from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import XpBar from '../ui/XpBar'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/habits',      icon: Flame,           label: 'Habits'      },
  { to: '/tasks',       icon: CheckSquare,     label: 'Tasks'       },
  { to: '/rewards',     icon: Gift,            label: 'Rewards'     },
  { to: '/profile',     icon: User,            label: 'Profile'     },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[var(--color-muted)]
                      flex flex-col py-6 px-4 shadow-[var(--shadow-kawaii)] z-20">
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="text-2xl float-anim inline-block">✨</span>
        <h1 className="text-xl font-black text-[var(--color-primary)] tracking-tight">
          Lumina
        </h1>
        <p className="text-xs text-[var(--color-text-soft)] font-semibold">Life Planner</p>
      </div>

      {/* User XP card */}
      {user && (
        <div className="kawaii-card mb-6 bg-[var(--color-muted)]">
          <p className="font-bold text-sm truncate text-[var(--color-text)]">{user.name}</p>
          <XpBar xp={user.xp ?? 0} xpToNext={user.xp_to_next_level ?? 100} level={user.level ?? 1} />
          <p className="text-xs text-[var(--color-text-soft)] mt-1 text-right">
            {user.streak ?? 0} day streak 🔥
          </p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all
               ${isActive
                 ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-kawaii)]'
                 : 'text-[var(--color-text-soft)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text)]'
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold
                   text-red-400 hover:bg-red-50 hover:text-red-500 transition-all mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}
