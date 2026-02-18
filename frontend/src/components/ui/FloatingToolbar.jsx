import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// ─── Font options ──────────────────────────────────────────────────────────────
// Only these two fonts are swapped per-field. The rest of the app is untouched.
export const FONT_OPTIONS = [
  {
    label: 'Modern',
    value: "'Nunito', sans-serif",
    sampleStyle: { fontFamily: "'Nunito', sans-serif", fontWeight: 700 },
    description: 'Clean & rounded',
  },
  {
    label: 'Handwritten',
    value: "'Caveat', cursive",
    sampleStyle: { fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: '1.05rem' },
    description: 'Casual & personal',
  },
]

// ─── Pastel ink color palette ──────────────────────────────────────────────────
// Darker enough to be readable on white/pastel backgrounds, still on-theme.
export const PASTEL_COLORS = [
  { name: 'Plum',      value: '#3D2A52' },   // default app text
  { name: 'Violet',    value: '#7C3AED' },
  { name: 'Rose',      value: '#BE185D' },
  { name: 'Crimson',   value: '#DC2626' },
  { name: 'Ocean',     value: '#0369A1' },
  { name: 'Forest',    value: '#15803D' },
  { name: 'Cinnamon',  value: '#B45309' },
  { name: 'Pink',      value: '#DB2777' },
  { name: 'Teal',      value: '#0F766E' },
  { name: 'Indigo',    value: '#4338CA' },
  { name: 'Coral',     value: '#EA580C' },
  { name: 'Slate',     value: '#475569' },
]

/**
 * FloatingToolbar
 * ---------------
 * A portal-rendered toolbar that floats above (or below) a focused input.
 * It lets the user pick a FONT and INK COLOR for that specific field.
 *
 * ⚠️ Isolation guarantee: all state lives in `useTextStyle` which is called
 * per-component, so no style bleeds into other fields or the global theme.
 *
 * Props
 * -----
 * anchorEl       – the DOM element the toolbar should anchor to
 * visible        – whether the toolbar is shown
 * textStyle      – { fontFamily, textColor } current style for this field
 * onStyleChange  – ({ fontFamily?, textColor? }) => void
 * onClose        – () => void  (called on outside click)
 */
export default function FloatingToolbar({
  anchorEl,
  visible,
  textStyle,
  onStyleChange,
  onClose,
}) {
  const toolbarRef = useRef(null)

  // ── Position calculation ────────────────────────────────────────────────────
  const getPosition = () => {
    if (!anchorEl) return { top: 0, left: 0, arrowDown: true }

    const rect   = anchorEl.getBoundingClientRect()
    const TOOLBAR_H = 90   // approximate height px
    const TOOLBAR_W = 296
    const GAP     = 8

    // Prefer above; fall back to below if too close to top
    const spaceAbove = rect.top
    const placeAbove = spaceAbove >= TOOLBAR_H + GAP

    let top  = placeAbove ? rect.top - TOOLBAR_H - GAP : rect.bottom + GAP
    let left = rect.left

    // Clamp horizontally so toolbar stays inside viewport
    if (left + TOOLBAR_W > window.innerWidth - 8) {
      left = window.innerWidth - TOOLBAR_W - 8
    }
    if (left < 8) left = 8

    return { top, left, arrowDown: placeAbove }
  }

  // ── Close on outside pointer-down ─────────────────────────────────────────
  useEffect(() => {
    if (!visible) return

    const handlePointerDown = (e) => {
      const clickedInsideToolbar = toolbarRef.current?.contains(e.target)
      const clickedAnchor        = anchorEl?.contains(e.target)
      if (!clickedInsideToolbar && !clickedAnchor) {
        onClose()
      }
    }

    // Use capture so we intercept before React synthetic events
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [visible, anchorEl, onClose])

  if (!visible || !anchorEl) return null

  const { top, left, arrowDown } = getPosition()

  return createPortal(
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Text style toolbar"
      style={{
        position: 'fixed',
        top,
        left,
        width: 296,
        zIndex: 9999,
      }}
      className="bg-white/95 backdrop-blur-md rounded-[1.25rem]
                 border border-[#F3E8FF]
                 shadow-[0_8px_32px_0_rgba(192,132,252,0.22)]
                 p-3 animate-[toolbar-pop_0.18s_ease-out]"
    >
      {/* ── Directional arrow ── */}
      {arrowDown ? (
        // Arrow pointing down (toolbar is above the input)
        <span
          aria-hidden
          className="absolute -bottom-[7px] left-5 block w-3.5 h-3.5
                     bg-white border-r border-b border-[#F3E8FF] rotate-45"
        />
      ) : (
        // Arrow pointing up (toolbar is below the input)
        <span
          aria-hidden
          className="absolute -top-[7px] left-5 block w-3.5 h-3.5
                     bg-white border-l border-t border-[#F3E8FF] rotate-45"
        />
      )}

      {/* ── Font picker ── */}
      <section className="mb-2.5">
        <p className="text-[10px] font-bold text-[#8B6BAE] uppercase tracking-wider mb-1.5">
          ✍️ Font
        </p>
        <div className="flex gap-2">
          {FONT_OPTIONS.map((font) => {
            const isActive = textStyle.fontFamily === font.value
            return (
              <button
                key={font.value}
                // onPointerDown instead of onClick so the input doesn't blur
                onPointerDown={(e) => {
                  e.preventDefault()
                  onStyleChange({ fontFamily: font.value })
                }}
                title={font.description}
                className={`
                  flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl
                  border-2 transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'border-[#C084FC] bg-[#F3E8FF] shadow-sm scale-[1.04]'
                    : 'border-transparent bg-[#FEFAFF] hover:border-[#E2D9F3] hover:bg-[#F9F0FF]'
                  }
                `}
              >
                <span
                  className="text-sm leading-none"
                  style={{ ...font.sampleStyle, color: isActive ? '#7C3AED' : '#3D2A52' }}
                >
                  Aa
                </span>
                <span
                  className={`text-[10px] font-semibold leading-none
                    ${isActive ? 'text-[#7C3AED]' : 'text-[#8B6BAE]'}`}
                >
                  {font.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Ink color picker ── */}
      <section>
        <p className="text-[10px] font-bold text-[#8B6BAE] uppercase tracking-wider mb-1.5">
          🖊️ Ink Color
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {PASTEL_COLORS.map((color) => {
            const isActive = textStyle.textColor === color.value
            return (
              <button
                key={color.value}
                title={color.name}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onStyleChange({ textColor: color.value })
                }}
                className={`
                  w-6 h-6 rounded-full transition-all duration-150 cursor-pointer
                  border-[3px]
                  ${isActive
                    ? 'border-white scale-125 shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
                    : 'border-white/60 hover:scale-110 hover:border-white hover:shadow-md'
                  }
                `}
                style={{ backgroundColor: color.value }}
                aria-pressed={isActive}
                aria-label={`${color.name} ink`}
              />
            )
          })}
        </div>
      </section>
    </div>,
    document.body,
  )
}
