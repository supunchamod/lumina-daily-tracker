import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

const RANK_STYLES = {
  1: 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300',
  2: 'bg-gradient-to-r from-gray-100  to-gray-50  border-gray-300',
  3: 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300',
}

function LeaderRow({ entry }) {
  const isCurrent = entry.is_current
  const medal     = MEDAL[entry.rank]

  return (
    <div
      className={`kawaii-card flex items-center gap-4 transition-all
        ${RANK_STYLES[entry.rank] ?? ''}
        ${isCurrent ? 'ring-2 ring-[var(--color-primary)] ring-offset-1' : ''}
      `}
    >
      {/* Rank */}
      <div className="w-10 text-center flex-shrink-0">
        {medal
          ? <span className="text-2xl">{medal}</span>
          : <span className="text-sm font-black text-[var(--color-text-soft)]">#{entry.rank}</span>
        }
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                      flex items-center justify-center text-lg text-white font-black flex-shrink-0">
        {entry.avatar ?? entry.name?.[0]?.toUpperCase()}
      </div>

      {/* Name + badges */}
      <div className="flex-1 min-w-0">
        <p className={`font-black truncate ${isCurrent ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
          {entry.name} {isCurrent && <span className="text-xs font-bold text-[var(--color-text-soft)]">(you)</span>}
        </p>
        <p className="text-xs text-[var(--color-text-soft)] font-semibold">
          Level {entry.level} · {entry.streak} day streak 🔥
        </p>
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <p className="font-black text-[var(--color-primary)] text-lg">{entry.xp.toLocaleString()}</p>
        <p className="text-[10px] font-bold text-[var(--color-text-soft)] uppercase tracking-wide">XP</p>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn:  () => api.get('/leaderboard').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-4xl float-anim">🏆</span>
      </div>
    )
  }

  const { leaders = [], current_user } = data ?? {}

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div className="text-center">
        <span className="text-5xl float-anim inline-block">🏆</span>
        <h1 className="text-3xl font-black text-[var(--color-primary)] mt-2">Leaderboard</h1>
        <p className="text-[var(--color-text-soft)] text-sm mt-1">Top Lumina users ranked by XP</p>
      </div>

      {/* Podium (top 3) */}
      {leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-1 pt-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-200
                            flex items-center justify-center text-xl text-white font-black shadow-md">
              {leaders[1]?.avatar ?? leaders[1]?.name?.[0]}
            </div>
            <p className="text-xs font-black text-[var(--color-text)] truncate w-full px-1">{leaders[1]?.name}</p>
            <p className="text-xs text-[var(--color-text-soft)]">{leaders[1]?.xp} XP</p>
            <div className="w-full bg-gray-200 rounded-t-xl h-16 mt-1 flex items-center justify-center text-2xl">🥈</div>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-200
                            flex items-center justify-center text-2xl text-white font-black shadow-lg">
              {leaders[0]?.avatar ?? leaders[0]?.name?.[0]}
            </div>
            <p className="text-xs font-black text-[var(--color-primary)] truncate w-full px-1">{leaders[0]?.name}</p>
            <p className="text-xs text-[var(--color-text-soft)]">{leaders[0]?.xp} XP</p>
            <div className="w-full bg-yellow-100 rounded-t-xl h-24 mt-1 flex items-center justify-center text-2xl">🥇</div>
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center gap-1 pt-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-200
                            flex items-center justify-center text-lg text-white font-black shadow">
              {leaders[2]?.avatar ?? leaders[2]?.name?.[0]}
            </div>
            <p className="text-xs font-black text-[var(--color-text)] truncate w-full px-1">{leaders[2]?.name}</p>
            <p className="text-xs text-[var(--color-text-soft)]">{leaders[2]?.xp} XP</p>
            <div className="w-full bg-orange-100 rounded-t-xl h-10 mt-1 flex items-center justify-center text-2xl">🥉</div>
          </div>
        </div>
      )}

      {/* Full ranked list */}
      <div className="space-y-2">
        {leaders.map((entry) => (
          <LeaderRow key={entry.id} entry={entry} />
        ))}
      </div>

      {/* Current user footer (if outside top 20) */}
      {current_user && (
        <div className="space-y-2">
          <p className="text-center text-xs font-bold text-[var(--color-text-soft)]">· · ·</p>
          <LeaderRow entry={current_user} />
        </div>
      )}

      {leaders.length === 0 && (
        <div className="kawaii-card text-center text-[var(--color-text-soft)] py-12">
          No data yet — complete tasks and habits to earn XP and appear here!
        </div>
      )}

    </div>
  )
}
