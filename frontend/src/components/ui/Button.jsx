const variants = {
  primary:   'bg-[var(--color-primary)]   text-white hover:bg-purple-400',
  secondary: 'bg-[var(--color-secondary)] text-white hover:bg-pink-400',
  ghost:     'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-muted)]',
  danger:    'bg-red-300 text-white hover:bg-red-400',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-5 py-2',
  lg: 'text-lg px-7 py-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`kawaii-btn border-none outline-none font-bold
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
