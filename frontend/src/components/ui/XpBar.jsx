/**
 * XpBar — animated shimmer progress bar showing XP progress to next level.
 */
export default function XpBar({ xp, xpToNext, level }) {
  const total    = xp + xpToNext
  const percent  = total > 0 ? Math.min(100, Math.round((xp / total) * 100)) : 0

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-soft)]">
        <span>Lv. {level}</span>
        <span>{xp} / {total} XP</span>
      </div>
      <div className="h-3 w-full bg-[var(--color-muted)] rounded-full overflow-hidden">
        <div
          className="h-full xp-bar-fill rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
