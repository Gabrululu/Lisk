import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    return saved ?? 'system'
  })

  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && systemDark)
    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () =>
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return { theme, setTheme, toggle }
}
