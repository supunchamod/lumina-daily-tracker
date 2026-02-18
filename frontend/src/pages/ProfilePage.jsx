import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'

// Colour for locked badges
const LOCK_STYLE = { filter: 'grayscale(100%)', opacity: 0.4 }

function LevelProgressBar({ percent, current, needed, level }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold text-[var(--color-text-soft)]">
        <span>Level {level}</span>
        <span>{current} / {needed} XP</span>
        <span>Level {level + 1}</span>
      </div>
      <div className="h-5 w-full bg-[var(--color-muted)] rounded-full overflow-hidden">
        <div
          className="h-full xp-bar-fill rounded-full transition-all duration-700 flex items-center justify-end pr-2"
          style={{ width: `${percent}%` }}
        >
          {percent >= 15 && (
            <span className="text-[10px] font-black text-white">{percent}%</span>
          )}
        </div>
      </div>
    </div>
  )
}

function BadgeCard({ badge }) {
  const unlocked = badge.unlocked

  return (
    <div
      className="kawaii-card flex flex-col items-center gap-2 text-center p-4 transition-transform hover:scale-105"
      style={unlocked ? { borderTop: `3px solid ${badge.color ?? '#C084FC'}` } : LOCK_STYLE}
      title={unlocked ? badge.description : `Locked — ${badge.description}`}
    >
      <span className="text-4xl">{badge.icon}</span>
      <p className="font-black text-sm text-[var(--color-text)] leading-tight">{badge.name}</p>
      {unlocked ? (
        <span className="text-[10px] font-bold text-[var(--color-text-soft)] bg-[var(--color-muted)] px-2 py-0.5 rounded-full">
          {badge.awarded_at ? new Date(badge.awarded_at).toLocaleDateString() : 'Earned'}
        </span>
      ) : (
        <span className="text-[10px] font-bold text-[var(--color-text-soft)]">🔒 Locked</span>
      )}
      <p className="text-[10px] text-[var(--color-text-soft)] leading-tight">{badge.description}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn:  () => api.get('/profile').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-4xl float-anim">🌟</span>
      </div>
    )
  }

  const { user, xp_progress, badges } = data ?? {}
  const unlockedCount = badges?.filter((b) => b.unlocked).length ?? 0

  return (
    <div className="space-y-8 max-w-3xl">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="kawaii-card flex items-center gap-6"
           style={{ borderLeft: '4px solid var(--color-primary)' }}>
        {/* Avatar / initial */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                        flex items-center justify-center text-3xl text-white font-black flex-shrink-0 shadow-lg">
          {user?.avatar ?? user?.name?.[0]?.toUpperCase() ?? '✨'}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-[var(--color-primary)] truncate">{user?.name}</h1>
          <div className="flex gap-4 mt-1 text-sm font-bold text-[var(--color-text-soft)]">
            <span>Level {user?.level}</span>
            <span>·</span>
            <span>{user?.xp} XP total</span>
            <span>·</span>
            <span>{user?.streak} day streak 🔥</span>
          </div>

          {/* Level progress bar */}
          <div className="mt-3">
            <LevelProgressBar
              percent={xp_progress?.percent ?? 0}
              current={xp_progress?.current ?? 0}
              needed={xp_progress?.needed ?? 100}
              level={user?.level ?? 1}
            />
          </div>
        </div>
      </div>

      {/* ── Badge collection ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-[var(--color-text)]">
            Badge Collection
          </h2>
          <span className="text-sm font-bold text-[var(--color-text-soft)] bg-[var(--color-muted)] px-3 py-1 rounded-full">
            {unlockedCount} / {badges?.length ?? 0} unlocked
          </span>
        </div>

        {/* Unlocked first, then locked */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...(badges ?? [])]
            .sort((a, b) => Number(b.unlocked) - Number(a.unlocked))
            .map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
        </div>
      </div>

    </div>
  )
}
