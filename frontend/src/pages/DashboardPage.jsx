import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import Card from '../components/ui/Card'
import XpBar from '../components/ui/XpBar'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn:  () => api.get('/dashboard').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-4xl float-anim">🌟</span>
      </div>
    )
  }

  const { user, today_habits, pending_tasks, completed_today, xp_to_next_level } = data ?? {}

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-[var(--color-primary)]">
        Hello, {user?.name?.split(' ')[0]}! 🌸
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card accent="#C084FC">
          <p className="text-xs font-bold text-[var(--color-text-soft)] uppercase tracking-wider">Level</p>
          <p className="text-4xl font-black text-[var(--color-primary)]">{user?.level ?? 1}</p>
          <XpBar xp={user?.xp ?? 0} xpToNext={xp_to_next_level ?? 100} level={user?.level ?? 1} />
        </Card>

        <Card accent="#F9A8D4">
          <p className="text-xs font-bold text-[var(--color-text-soft)] uppercase tracking-wider">Streak</p>
          <p className="text-4xl font-black text-[var(--color-secondary)]">{user?.streak ?? 0}</p>
          <p className="text-sm text-[var(--color-text-soft)]">days in a row 🔥</p>
        </Card>

        <Card accent="#67E8F9">
          <p className="text-xs font-bold text-[var(--color-text-soft)] uppercase tracking-wider">Done Today</p>
          <p className="text-4xl font-black text-[var(--color-accent)]">{completed_today ?? 0}</p>
          <p className="text-sm text-[var(--color-text-soft)]">tasks completed</p>
        </Card>
      </div>

      {/* Today's habits */}
      <div>
        <h2 className="text-lg font-black text-[var(--color-text)] mb-3">Today's Habits</h2>
        {today_habits?.length ? (
          <div className="space-y-2">
            {today_habits.map((habit) => (
              <Card key={habit.id} className="flex items-center gap-3">
                <span className="text-2xl">{habit.icon ?? '⭐'}</span>
                <div className="flex-1">
                  <p className="font-bold">{habit.title}</p>
                  <p className="text-xs text-[var(--color-text-soft)]">+{habit.xp_reward} XP</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full
                  ${habit.streak > 0 ? 'bg-[var(--color-mint)]' : 'bg-[var(--color-muted)]'}`}>
                  {habit.streak} day streak
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center text-[var(--color-text-soft)] py-8">
            No daily habits yet. <a href="/habits" className="text-[var(--color-primary)] font-bold">Add one!</a>
          </Card>
        )}
      </div>

      {/* Pending tasks */}
      <div>
        <h2 className="text-lg font-black text-[var(--color-text)] mb-3">Up Next</h2>
        {pending_tasks?.length ? (
          <div className="space-y-2">
            {pending_tasks.map((task) => (
              <Card key={task.id} className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                  task.priority === 'high'   ? 'bg-red-300'    :
                  task.priority === 'medium' ? 'bg-yellow-300' : 'bg-green-300'
                }`} />
                <div className="flex-1">
                  <p className="font-bold">{task.title}</p>
                  {task.due_date && (
                    <p className="text-xs text-[var(--color-text-soft)]">Due {task.due_date}</p>
                  )}
                </div>
                <span className="text-xs text-[var(--color-text-soft)] font-bold">+{task.xp_reward} XP</span>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center text-[var(--color-text-soft)] py-8">
            All caught up! 🎉
          </Card>
        )}
      </div>
    </div>
  )
}
