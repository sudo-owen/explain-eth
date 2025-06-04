import React, { useEffect, useState } from 'react'

interface CircularCountdownProps {
  duration: number // Duration in milliseconds
  startTime: Date
  size?: number
  strokeWidth?: number
  className?: string
  theme?: 'ethereum' | 'rollup'
  hideValue?: boolean // Option to hide the countdown number
  displayScale?: number // Scale factor for displayed countdown (e.g., 2 to show 12 seconds for 6 second duration)
}

const CircularCountdown: React.FC<CircularCountdownProps> = ({
  duration,
  startTime,
  size = 24,
  strokeWidth = 2,
  className = '',
  theme = 'ethereum',
  hideValue = false,
  displayScale = 1
}) => {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const elapsed = now - startTime.getTime()
      const remaining = Math.max(0, duration - elapsed)
      const progressPercent = Math.min(100, (elapsed / duration) * 100)
      
      setProgress(progressPercent)
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 100) // Update every 100ms for smooth animation

    return () => clearInterval(interval)
  }, [duration, startTime])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const seconds = Math.ceil((timeLeft / 1000) * displayScale)

  const getThemeColors = () => {
    if (theme === 'rollup') {
      return {
        progress: 'text-amber-400',
        text: 'text-gray-800'
      }
    }
    return {
      progress: 'text-yellow-400',
      text: 'text-gray-800'
    }
  }

  const colors = getThemeColors()

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-600"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${colors.progress} transition-all duration-100 ease-linear`}
          strokeLinecap="round"
        />
      </svg>
      {/* Timer text */}
      {!hideValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-medium ${colors.text}`}>
            {seconds}
          </span>
        </div>
      )}
    </div>
  )
}

export default CircularCountdown
