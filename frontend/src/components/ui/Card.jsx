/**
 * Kawaii Card — the primary surface component for Lumina Life Planner.
 * Supports an optional pastel accent color strip on the left side.
 */
export default function Card({ children, className = '', accent }) {
  return (
    <div
      className={`kawaii-card relative overflow-hidden ${className}`}
      style={accent ? { borderLeft: `4px solid ${accent}` } : {}}
    >
      {children}
    </div>
  )
}
