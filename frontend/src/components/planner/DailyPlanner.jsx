import { useState } from 'react'
import DailyReflection  from './DailyReflection'
import NotesSection     from './NotesSection'
import GratitudeJournal from './GratitudeJournal'
import WaterTracker     from './WaterTracker'

// ─── Mood data ──────────────────────────────────────────────────────────────
const MOODS = [
  { emoji: '😄', label: 'Happy',   bg: '#FFF4B8' },
  { emoji: '😊', label: 'Good',    bg: '#C3F4D7' },
  { emoji: '😌', label: 'Calm',    bg: '#BEE9FD' },
  { emoji: '😔', label: 'Sad',     bg: '#E2D9F3' },
  { emoji: '😤', label: 'Angry',   bg: '#FFE4CC' },
]

// ─── Weather data ────────────────────────────────────────────────────────────
const WEATHERS = [
  { icon: '☀️', label: 'Sunny'   },
  { icon: '⛅', label: 'Cloudy'  },
  { icon: '🌧️', label: 'Rainy'  },
  { icon: '❄️', label: 'Snowy'  },
  { icon: '🌈', label: 'Rainbow' },
]

// ─── Day labels ───────────────────────────────────────────────────────────────
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// ─── Sleep tracker ───────────────────────────────────────────────────────────
function SleepTracker() {
  const [bedTime,  setBedTime]  = useState('')
  const [wakeTime, setWakeTime] = useState('')
  const [rating,   setRating]   = useState(0)

  return (
    <div className="kawaii-card bg-[#E2D9F3]/30">
      <h3 className="text-center font-bold text-sm text-[#3D2A52] mb-3">
        🌙 Sleep
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8B6BAE] w-16">Bed 🛏️</span>
          <input
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="flex-1 bg-white/60 rounded-xl px-2 py-1 text-xs
                       border border-[#E2D9F3] focus:border-[#C084FC]/40
                       outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8B6BAE] w-16">Wake ☀️</span>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="flex-1 bg-white/60 rounded-xl px-2 py-1 text-xs
                       border border-[#E2D9F3] focus:border-[#C084FC]/40
                       outline-none transition-all"
          />
        </div>
        <div>
          <p className="text-[11px] text-[#8B6BAE] font-semibold mb-1">How rested?</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-lg cursor-pointer transition-all duration-200
                  ${star <= rating ? 'scale-110' : 'opacity-40 hover:opacity-70'}`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Todo list ───────────────────────────────────────────────────────────────
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '', done: false },
    { id: 2, text: '', done: false },
    { id: 3, text: '', done: false },
    { id: 4, text: '', done: false },
  ])

  const toggle     = (id) => setTodos((p) => p.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  const updateText = (id, text) => setTodos((p) => p.map((t) => t.id === id ? { ...t, text } : t))
  const addTodo    = () => setTodos((p) => [...p, { id: Date.now(), text: '', done: false }])

  return (
    <div className="kawaii-card bg-[#C3F4D7]/30">
      <h3 className="text-center font-bold text-sm text-[#3D2A52] mb-3">
        ✅ To Do
      </h3>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2">
            <button
              onClick={() => toggle(todo.id)}
              className={`w-5 h-5 rounded-lg border-2 border-[#C084FC] flex items-center
                          justify-center transition-all flex-shrink-0 cursor-pointer
                          ${todo.done ? 'bg-[#C084FC]' : 'bg-white hover:bg-[#F3E8FF]'}`}
            >
              {todo.done && <span className="text-white text-[11px]">✓</span>}
            </button>
            <input
              type="text"
              value={todo.text}
              onChange={(e) => updateText(todo.id, e.target.value)}
              placeholder="Add a task…"
              className={`flex-1 bg-transparent border-b border-[#C3F4D7]
                          focus:border-[#C084FC]/50 outline-none py-0.5 text-sm
                          placeholder:text-[#8B6BAE]/40 transition-all
                          ${todo.done ? 'line-through text-[#8B6BAE]' : 'text-[#3D2A52]'}`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addTodo}
        className="mt-2 text-xs text-[#8B6BAE] hover:text-[#3D2A52] font-semibold
                   transition-colors cursor-pointer"
      >
        + Add task
      </button>
    </div>
  )
}

// ─── Mood tracker ─────────────────────────────────────────────────────────────
function MoodTracker() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="kawaii-card bg-[#FFD6E0]/30">
      <h3 className="text-center font-bold text-sm text-[#3D2A52] mb-3">✨ Mood</h3>
      <div className="flex justify-center gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            onClick={() => setSelected(mood.label)}
            title={mood.label}
            className={`text-2xl p-1.5 rounded-xl transition-all duration-200 cursor-pointer
              ${selected === mood.label ? 'scale-125 shadow-md' : 'hover:scale-110'}`}
            style={selected === mood.label ? { background: mood.bg } : {}}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-center text-xs text-[#8B6BAE] mt-2 font-semibold">
          Feeling {selected.toLowerCase()} today 💕
        </p>
      )}
    </div>
  )
}

// ─── Weather selector ─────────────────────────────────────────────────────────
function WeatherSelector() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="kawaii-card bg-[#BEE9FD]/30">
      <h3 className="text-center font-bold text-sm text-[#3D2A52] mb-3">🌤️ Weather</h3>
      <div className="flex justify-center gap-2">
        {WEATHERS.map((w) => (
          <button
            key={w.label}
            onClick={() => setSelected(w.label)}
            title={w.label}
            className={`text-xl p-1.5 rounded-xl transition-all duration-200 cursor-pointer
              ${selected === w.label ? 'bg-[#BEE9FD] scale-125 shadow-md' : 'hover:scale-110'}`}
          >
            {w.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main DailyPlanner ────────────────────────────────────────────────────────
/**
 * DailyPlanner — Main Dashboard Layout
 * =====================================
 * Hosts every planner widget in a responsive grid.
 *
 * Floating Toolbar feature
 * ─────────────────────────
 * The three StyledTextarea / StyledInput fields (NotesSection,
 * DailyReflection, GratitudeJournal) each show a FloatingToolbar on focus.
 * The toolbar lets users pick:
 *   • Font: "Modern" (Nunito) or "Handwritten" (Caveat)
 *   • Ink Color: 12 pastel-friendly colors
 *
 * Style isolation is guaranteed — each field has its own isolated
 * useTextStyle state; changing one field never affects another.
 */
export default function DailyPlanner() {
  const today      = new Date()
  const dateStr    = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const currentDay = (today.getDay() + 6) % 7   // Mon = 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8 pb-20">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-black tracking-tight mb-1"
            style={{ color: 'var(--color-primary)' }}
          >
            Daily Planner 🌿
          </h1>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-soft)' }}>
            {dateStr}
          </p>

          {/* Weekday pill row */}
          <div className="flex justify-center gap-2 mt-4">
            {DAY_LABELS.map((d, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           text-xs font-black transition-all"
                style={
                  i === currentDay
                    ? { background: 'var(--color-primary)', color: '#fff', boxShadow: 'var(--shadow-kawaii)' }
                    : { background: 'white', color: 'var(--color-text-soft)', border: '1.5px solid var(--color-muted)' }
                }
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* ── Feature callout banner ── */}
        <div
          className="rounded-[1.25rem] px-4 py-3 mb-6 flex items-center gap-3
                     border border-[#F3E8FF]"
          style={{ background: 'linear-gradient(135deg, #F9F0FF 0%, #FFF0FB 100%)' }}
        >
          <span className="text-2xl float-anim">✨</span>
          <div>
            <p className="text-sm font-black text-[#3D2A52]">Floating Toolbar — Style your notes!</p>
            <p className="text-xs text-[#8B6BAE] font-semibold">
              Click any notes, reflection, or gratitude field to choose a
              <strong className="text-[#C084FC]"> font </strong>
              and
              <strong className="text-[#F9A8D4]"> ink color</strong>.
              Each field has its own independent style 🎨
            </p>
          </div>
        </div>

        {/* ── Top row: Mood + Weather ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <MoodTracker />
          <WeatherSelector />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/*
            ── Styled text fields ──
            These three components render StyledTextarea / StyledInput.
            Clicking into them shows the FloatingToolbar.
          */}
          <DailyReflection />
          <NotesSection />
          <GratitudeJournal />

          {/* ── Other widgets (no FloatingToolbar — plain inputs) ── */}
          <SleepTracker />
          <WaterTracker />
          <TodoList />
        </div>

      </div>
    </div>
  )
}
