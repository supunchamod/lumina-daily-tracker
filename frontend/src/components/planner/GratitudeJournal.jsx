import { useState } from 'react'
import StyledInput from './StyledInput'

/**
 * GratitudeJournal
 * ----------------
 * 🌸 Three gratitude entry fields.
 *
 * Each entry is a StyledInput — so each line has its own independent
 * font and ink color. The user can style "line 1" in handwritten violet
 * and "line 2" in modern rose, completely independently.
 */
export default function GratitudeJournal() {
  const [entries, setEntries] = useState(['', '', ''])

  const updateEntry = (index, value) =>
    setEntries((prev) => prev.map((e, i) => (i === index ? value : e)))

  return (
    <div className="kawaii-card bg-[#FFE4CC]/30">
      <h3 className="text-center font-bold text-sm text-[#3D2A52] mb-3">
        🌸 Today I&apos;m Grateful For
      </h3>

      <div className="space-y-2.5">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-base select-none">💗</span>

            {/*
              Each StyledInput is its own isolated instance.
              Styling entry[0] never touches entry[1] or entry[2].
            */}
            <StyledInput
              value={entry}
              onChange={(e) => updateEntry(i, e.target.value)}
              placeholder={`Gratitude ${i + 1}…`}
              className="
                flex-1 bg-transparent
                border-b border-[#F9A8D4]/40 focus:border-[#F9A8D4]
                py-1 text-sm
                placeholder:text-[#8B6BAE]/40
                transition-all duration-200
              "
            />
          </div>
        ))}
      </div>
    </div>
  )
}
