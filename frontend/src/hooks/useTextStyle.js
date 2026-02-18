import { useState, useRef, useCallback } from 'react'

export const DEFAULT_TEXT_STYLE = {
  fontFamily: "'Nunito', sans-serif",
  textColor: '#3D2A52',      // var(--color-text)
}

/**
 * useTextStyle
 * ------------
 * Manages per-input text styling state (fontFamily + textColor) and the
 * visibility of the FloatingToolbar that controls those styles.
 *
 * Each input that calls this hook gets its OWN isolated state, so changing
 * the font or color of one field never affects any other field in the app.
 *
 * @param {Partial<typeof DEFAULT_TEXT_STYLE>} initial – optional overrides
 */
export function useTextStyle(initial = {}) {
  const [textStyle, setTextStyle] = useState({ ...DEFAULT_TEXT_STYLE, ...initial })
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const inputRef = useRef(null)

  const handleFocus = useCallback(() => {
    setToolbarVisible(true)
  }, [])

  /** Called by FloatingToolbar when the user picks a font or color. */
  const handleStyleChange = useCallback((changes) => {
    setTextStyle((prev) => ({ ...prev, ...changes }))
    // Return focus to the input so the user keeps typing without re-clicking
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  /** Called when the user clicks outside both the input and the toolbar. */
  const closeToolbar = useCallback(() => {
    setToolbarVisible(false)
  }, [])

  return {
    textStyle,
    toolbarVisible,
    inputRef,
    handleFocus,
    handleStyleChange,
    closeToolbar,
  }
}
