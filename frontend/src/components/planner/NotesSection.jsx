import { useState } from 'react'
import StyledTextarea from './StyledTextarea'

/**
 * NotesSection
 * ------------
 * 📝 Free-form notes card.
 *
 * Demonstrates the FloatingToolbar feature:
 *   • Clicking the textarea reveals the font/color toolbar above it.
 *   • Choosing "Handwritten" switches to Caveat cursive for THIS field only.
 *   • Picking an ink color changes only THIS textarea's text color.
 *   • All other fields and the app theme remain completely unchanged.
 */
export default function NotesSection() {
  const [text, setText] = useState('')

  return (
    <div className="kawaii-card relative bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-[#3D2A52]">📝 Daily Notes</h3>
        {/* Small hint badge — only visible when empty */}
        {!text && (
          <span className="text-[10px] text-[#8B6BAE] bg-[#F3E8FF] px-2 py-0.5 rounded-full font-semibold">
            click to style ✨
          </span>
        )}
      </div>

      {/*
        StyledTextarea wraps a standard <textarea>.
        On focus → FloatingToolbar pops up.
        Font + color state lives entirely inside this component instance.
      */}
      <StyledTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write anything here…"
        rows={5}
        className="
          w-full bg-[#FEFAFF]/60 rounded-2xl p-3 text-sm
          placeholder:text-[#8B6BAE]/40
          border border-[#F3E8FF] focus:border-[#C084FC]/40
          transition-all duration-200
        "
      />

      {/* Character count */}
      {text.length > 0 && (
        <p className="text-right text-[10px] text-[#8B6BAE] mt-1 font-semibold">
          {text.length} chars
        </p>
      )}
    </div>
  )
}
