import { useState, useEffect } from "react"

export function useCounterAnimation(target: number, delay: number = 0, duration: number = 900) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0
      const increment = Math.ceil(target / 30)
      const interval = setInterval(() => {
        current += increment
        if (current >= target) {
          setDisplayValue(target)
          clearInterval(interval)
        } else {
          setDisplayValue(current)
        }
      }, duration / 30)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [target, delay, duration])

  return displayValue
}
