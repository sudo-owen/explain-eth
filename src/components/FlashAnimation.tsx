import React, { useState, useEffect } from 'react'

interface FlashAnimationProps {
  children: React.ReactNode
  trigger: any // Value that triggers the flash when it changes
  duration?: number // Duration in milliseconds
  className?: string
  flashColor?: string
}

const FlashAnimation: React.FC<FlashAnimationProps> = ({
  children,
  trigger,
  duration = 1000,
  className = '',
  flashColor = 'bg-green-400/30'
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

  return (
    <div 
      className={`
        relative transition-all duration-300 ease-in-out
        ${isFlashing ? `${flashColor} scale-105` : ''}
        ${className}
      `}
    >
      {children}
      {isFlashing && (
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
