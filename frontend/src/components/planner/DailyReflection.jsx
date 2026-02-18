import { useState } from 'react'
import StyledTextarea from './StyledTextarea'

/**
 * DailyReflection
 * ---------------
 * 💭 End-of-day reflection textarea.
 *
 * Each StyledTextarea call below has its OWN useTextStyle state inside.
 * Changing the font in this card has zero effect on NotesSection or any
 * other component — isolation is enforced at the hook level.
 */
export default function DailyReflection() {
  const [text, setText] = useState('')

  return (
    <div className="kawaii-card bg-[#E2D9F3]/30">
      <h3 className="text-center font-bold text-sm text-[#3D2A52] mb-3">
        💭 Daily Reflection
      </h3>

      <StyledTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How was your day? What's on your mind?…"
        rows={4}
        className="
          w-full bg-white/40 rounded-2xl p-3 text-sm
          placeholder:text-[#8B6BAE]/40
          border border-[#E2D9F3] focus:border-[#C084FC]/40
          transition-all duration-200
        "
      />
    </div>
  )
}
