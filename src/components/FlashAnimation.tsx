import React, { useState, useEffect } from 'react'

interface FlashAnimationProps {
  children: React.ReactNode
  trigger: any // Value that triggers the flash when it changes
  duration?: number // Duration in milliseconds
  className?: string
  flashColor?: string
  flashType?: 'background' | 'border' // Type of flash animation
}

const FlashAnimation: React.FC<FlashAnimationProps> = ({
  children,
  trigger,
  duration = 1000,
  className = '',
  flashColor = 'bg-green-400/30',
  flashType = 'background'
}) => {
  const [isFlashing, setIsFlashing] = useState(false)
  const [previousTrigger, setPreviousTrigger] = useState(trigger)

  useEffect(() => {
    // Only flash if the trigger value has actually changed and it's not the initial render
    if (trigger !== previousTrigger && previousTrigger !== undefined) {
      setIsFlashing(true)
      
      const timer = setTimeout(() => {
        setIsFlashing(false)
      }, duration)

      return () => clearTimeout(timer)
    }
    
    setPreviousTrigger(trigger)
  }, [trigger, previousTrigger, duration])

  const getBorderFlashColor = (color: string) => {
    // Convert background color to border color
    if (color.includes('bg-green-400')) return 'border-green-400'
    if (color.includes('bg-blue-400')) return 'border-blue-400'
    if (color.includes('bg-yellow-400')) return 'border-yellow-400'
    if (color.includes('bg-red-400')) return 'border-red-400'
    return 'border-white'
  }

  return (
    <div
      className={`
        relative transition-all duration-300 ease-in-out
        ${isFlashing && flashType === 'background' ? `${flashColor} scale-105` : ''}
        ${isFlashing && flashType === 'border' ? `${getBorderFlashColor(flashColor)} border-2 scale-105` : ''}
        ${className}
      `}
    >
      {children}
      {isFlashing && flashType === 'background' && (
        <div
          className={`
            absolute inset-0 rounded-lg ${flashColor}
            animate-pulse pointer-events-none
          `}
          style={{
            animation: `flash ${duration}ms ease-in-out`
          }}
        />
      )}
    </div>
  )
}

export default FlashAnimation
