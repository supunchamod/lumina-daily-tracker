import { useState, useCallback, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import api from '../../lib/axios'

// ─── Pastel water palette ───────────────────────────────────────────────────
const WATER_BLUE   = '#7EC8E3'   // filled glass water
const GLASS_STROKE = '#8B6BAE'   // kawaii purple outline
const TOTAL        = 8

// ─── Animated SVG Glass ──────────────────────────────────────────────────────
// Each glass is a trapezoid with a rising water-fill clipped inside it.
function GlassIcon({ filled, onClick, index, justFilled }) {
  const uid   = useId()
  const clipId = `glass-clip-${uid}`

  return (
    <motion.button
      onClick={onClick}
      aria-label={`Glass ${index + 1}${filled ? ' (filled)' : ''}`}
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="focus:outline-none cursor-pointer"
    >
      <svg
        width="36"
        height="52"
        viewBox="0 0 36 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          {/* Clip path matches the glass trapezoid shape */}
          <clipPath id={clipId}>
            <path d="M5 2 L31 2 L27 50 L9 50 Z" />
          </clipPath>
        </defs>

        {/* Water fill — animates scaleY from 0 → 1, origin at bottom */}
        <motion.rect
          x="0"
          y="2"
          width="36"
          height="48"
          rx="2"
          fill={WATER_BLUE}
          clipPath={`url(#${clipId})`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: filled ? 1 : 0 }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 22,
            delay: filled && justFilled ? index * 0.04 : 0,
          }}
          style={{ transformOrigin: 'bottom center' }}
        />

        {/* Shine stripe — only visible when filled */}
        <motion.rect
          x="11"
          y="8"
          width="4"
          height="28"
          rx="2"
          fill="white"
          clipPath={`url(#${clipId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: filled ? 0.45 : 0 }}
          transition={{ duration: 0.3, delay: filled && justFilled ? 0.25 : 0 }}
        />

        {/* Glass outline (drawn last so it sits on top of the water) */}
        <path
          d="M5 2 L31 2 L27 50 L9 50 Z"
          stroke={filled ? '#5AA7C7' : GLASS_STROKE}
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="none"
          opacity={filled ? 1 : 0.45}
        />

        {/* Rim highlight */}
        <line
          x1="5"
          y1="2"
          x2="31"
          y2="2"
          stroke={filled ? '#5AA7C7' : GLASS_STROKE}
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity={filled ? 1 : 0.45}
        />

        {/* Small bubbles inside water — appear when filled */}
        <AnimatePresence>
          {filled && (
            <>
              <motion.circle
                cx="14"
                cy="38"
                r="2"
                fill="white"
                opacity="0.55"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -18, opacity: [0, 0.55, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
              />
              <motion.circle
                cx="22"
                cy="42"
                r="1.5"
                fill="white"
                opacity="0.4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -22, opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }}
              />
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.button>
  )
}

// ─── Confetti burst ───────────────────────────────────────────────────────────
function launchConfetti() {
  const pastelColors = ['#BEE9FD', '#C3F4D7', '#FFD6E8', '#E2D9F3', '#FFF4B8', '#FFDAB9']

  // Two bursts from the sides
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.25, y: 0.55 },
    colors: pastelColors,
    shapes: ['circle', 'square'],
    scalar: 0.9,
  })
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.75, y: 0.55 },
      colors: pastelColors,
      shapes: ['circle', 'square'],
      scalar: 0.9,
    })
  }, 150)

  // Final shower from top-center
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 270,
      spread: 90,
      origin: { x: 0.5, y: 0 },
      colors: pastelColors,
      scalar: 1.1,
    })
  }, 400)
}

// ─── Main WaterTracker ────────────────────────────────────────────────────────
export default function WaterTracker({ initialCount = 0 }) {
  const [count,      setCount]      = useState(initialCount)
  const [justFilled, setJustFilled] = useState(false)   // drives stagger delay
  const [goalShown,  setGoalShown]  = useState(initialCount >= TOTAL)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  // Sync if parent provides a fresh initialCount (e.g. after data load)
  useEffect(() => {
    setCount(initialCount)
    setGoalShown(initialCount >= TOTAL)
  }, [initialCount])

  const handleGlassClick = useCallback(async (clickedIndex) => {
    // Clicking the last filled glass removes it (toggle off); otherwise fill up to clickedIndex+1
    const newCount = clickedIndex + 1 === count ? count - 1 : clickedIndex + 1
    if (newCount === count) return

    const increasing = newCount > count
    setJustFilled(increasing)
    setCount(newCount)
    setError(null)

    if (newCount >= TOTAL && !goalShown) {
      setGoalShown(true)
      setTimeout(launchConfetti, 100)
    }
    if (newCount < TOTAL) setGoalShown(false)

    setLoading(true)
    try {
      await api.post('/daily-logs/water', { water_count: newCount })
    } catch (err) {
      // Roll back optimistic update on failure
      setCount(count)
      setGoalShown(count >= TOTAL)
      setError('Could not save. Try again.')
    } finally {
      setLoading(false)
    }
  }, [count, goalShown])

  const filledPct = Math.round((count / TOTAL) * 100)

  return (
    <div className="kawaii-card bg-[#BEE9FD]/25 relative overflow-hidden select-none">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #7EC8E3 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-[#3D2A52] flex items-center gap-1.5">
          <span className="text-base">💧</span>
          Water Intake
        </h3>
        <span className="text-xs font-bold text-[#5AA7C7] tabular-nums">
          {count}/{TOTAL}
        </span>
      </div>

      {/* Glasses grid */}
      <div className="flex justify-center gap-1.5 flex-wrap min-h-[60px]">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <GlassIcon
            key={i}
            index={i}
            filled={i < count}
            justFilled={justFilled}
            onClick={() => handleGlassClick(i)}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-[#BEE9FD]/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #7EC8E3, #5AA7C7)' }}
          initial={{ width: `${(initialCount / TOTAL) * 100}%` }}
          animate={{ width: `${filledPct}%` }}
          transition={{ type: 'spring', stiffness: 160, damping: 24 }}
        />
      </div>

      {/* Status text */}
      <div className="mt-2 text-center min-h-[20px]">
        <AnimatePresence mode="wait">
          {goalShown ? (
            <motion.p
              key="goal"
              className="text-xs font-bold text-[#5AA7C7]"
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              🎉 Daily goal reached! You're amazing! ✨
            </motion.p>
          ) : (
            <motion.p
              key="count"
              className="text-xs text-[#8B6BAE] font-semibold"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {count === 0
                ? 'Tap a glass to log water! 🌊'
                : `${TOTAL - count} more to go — keep it up! 💪`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* API error nudge */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-center text-xs text-red-400 mt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Saving indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute top-2 right-3 text-[10px] text-[#8B6BAE]/60 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            saving…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
