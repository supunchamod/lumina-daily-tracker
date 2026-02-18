/**
 * XpBar — animated shimmer progress bar showing within-level XP progress.
 *
 * Props:
 *   xp        — user's total XP
 *   xpToNext  — XP remaining to reach the next level
 *   level     — current level number
 *
 * The bar shows progress within the CURRENT level only, not total XP.
 * Formula: xpStart = xpEnd - xpToNext  (backend returns remaining, not threshold)
 */
export default function XpBar({ xp, xpToNext, level }) {
  // xpThreshold(n) = n*(n-1)/2 * 100  (mirrors the backend formula)
  const threshold = (n) => Math.floor(n * (n - 1) / 2 * 100)

  const xpStart   = threshold(level)
  const xpEnd     = threshold(level + 1)
  const range     = Math.max(1, xpEnd - xpStart)
  const progress  = Math.min(xpEnd, xp) - xpStart
  const percent   = Math.min(100, Math.max(0, Math.round((progress / range) * 100)))

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-soft)]">
        <span>Lv. {level}</span>
        <span>{progress} / {range} XP</span>
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
