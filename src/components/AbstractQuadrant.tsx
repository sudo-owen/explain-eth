import { useState, useEffect, useRef, ReactNode } from 'react'
import { getRecipientEmoji, getRecipientBackgroundColor } from '../utils/recipients'

// Type definitions
interface QuadrantProps {
  title: string
  children: ReactNode
}

interface SimpleRecipientProps {
  name: string
  size?: 'normal' | 'small'
  showDot?: boolean
  dotSize?: number
}

interface AnimationComponentProps {
  isVisible: boolean
}

// Custom hook for intersection observer
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

// Individual quadrant component with subtle background variations
const Quadrant = ({ title, children }: QuadrantProps) => {
  // Define subtle background colors for each quadrant type
  const getQuadrantBackground = (title: string) => {
    switch (title) {
      case 'Variable Split':
        return 'bg-blue-900/20 border-blue-700/30'
      case 'Dynamic Recipients':
        return 'bg-green-900/20 border-green-700/30'
      case 'Fee Flow':
        return 'bg-yellow-900/20 border-yellow-700/30'
      case 'Betting':
        return 'bg-purple-900/20 border-purple-700/30'
      default:
        return 'bg-gray-800 border-gray-700'
    }
  }

  return (
    <div className={`${getQuadrantBackground(title)} rounded-lg p-4 border`}>
      <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">{title}</h3>
      <div className="h-32 relative">
        {children}
      </div>
    </div>
  )
}

// Simple recipient component for abstract visualization
const SimpleRecipient = ({
  name,
  size = 'normal',
  showDot = false,
  dotSize = 8
}: SimpleRecipientProps) => (
  <div className={`
    ${getRecipientBackgroundColor(name)} rounded-lg flex items-center justify-center relative
    ${size === 'small' ? 'w-8 h-8' : 'w-12 h-12'}
  `}>
    <span className={size === 'small' ? 'text-sm' : 'text-lg'}>
      {getRecipientEmoji(name)}
    </span>
    {showDot && (
      <div
        className="absolute -top-1 -right-1 bg-white rounded-full"
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
        }}
      />
    )}
  </div>
)

// Top Left: Variable proportions splitting with smooth dot splitting animation
const VariableProportions = ({ isVisible }: AnimationComponentProps) => {
  const [cycle, setCycle] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<'reset' | 'moving' | 'splitting' | 'arrived'>('reset')
  const [showRecipientDots, setShowRecipientDots] = useState([false, false, false])

  useEffect(() => {
    if (!isVisible) return

    const runCycle = () => {
      // Reset
      setAnimationPhase('reset')
      setShowRecipientDots([false, false, false])

      // Start moving
      setTimeout(() => setAnimationPhase('moving'), 500)

      // Split at midpoint and continue to targets
      setTimeout(() => setAnimationPhase('splitting'), 1000)

      // Arrive at targets and show recipient dots
      setTimeout(() => {
        setAnimationPhase('arrived')
      }, 1400)

      setTimeout(() => {
        setShowRecipientDots([true, true, true])
      }, 2000)

      // Clear recipient dots and prepare for next cycle
      setTimeout(() => {
        setShowRecipientDots([false, false, false])
        setCycle(prev => prev + 1)
      }, 3000)
    }

    runCycle()
    const interval = setInterval(runCycle, 4000)
    return () => clearInterval(interval)
  }, [isVisible, cycle])

  // Calculate recipient positions
  const getRecipientPosition = (index: number): number => {
    const baseTop = 20 + (index * 30) // 20%, 50%, 80%
    return baseTop
  }

  const isEqualSplit = cycle % 2 === 0
  const dotSizes = isEqualSplit ? [8, 8, 8] : [12, 6, 6]

  // Calculate dot positions based on animation phase
  const getDotStyle = (index: number) => {
    const targetTop = getRecipientPosition(index)
    const dotSize = Math.max(dotSizes[index] * 0.375, 6)
    
    let left, top, width, height, opacity
    
    switch (animationPhase) {
      case 'reset':
        left = '20px'
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0 // Only show main dot initially
        break
      case 'moving':
        left = '50%' // Move to center
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0 // Still only main dot
        break
      case 'splitting':
        left = '100%' // Continue to targets
        top = `${targetTop}%` // Split to different Y positions
        width = height = `${dotSize}px` // Change to target sizes
        opacity = 1 // All dots become visible
        break
      case 'arrived':
        left = '100%'
        top = `${targetTop}%`
        width = height = `${dotSize}px`
        opacity = 0 // Hide animated dots, show recipient dots instead
        break
      default:
        opacity = 0
    }
    
    return {
      left,
      top,
      width,
      height,
      opacity,
      transform: 'translateY(-50%)',
      transition: animationPhase === 'reset' ? 'none' : 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div className="flex items-center justify-between h-full relative">
      {/* Sender */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-green-600/40 rounded-lg flex items-center justify-center">
          <span className="text-sm">⚡</span>
        </div>
      </div>

      {/* Recipients */}
      <div className="flex flex-col space-y-1">
        {['Alice', 'Bob', 'Carol'].map((name, index) => (
          <SimpleRecipient
            key={name}
            name={name}
            size="small"
            showDot={showRecipientDots[index]}
            dotSize={dotSizes[index]}
          />
        ))}
      </div>

      {/* Animated splitting dots */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full"
          style={getDotStyle(index)}
        />
      ))}
    </div>
  )
}

// Top Right: Dynamic recipient count with smooth splitting
const DynamicRecipients = ({ isVisible }: AnimationComponentProps) => {
  const [cycle, setCycle] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<'reset' | 'moving' | 'splitting' | 'arrived'>('reset')
  const [showRecipientDots, setShowRecipientDots] = useState([false, false, false, false])

  const getRecipientCount = (cycleNum: number): number => {
    const counts = [3, 2, 4] // 3 recipients, then 2, then 4
    return counts[cycleNum % counts.length]
  }

  useEffect(() => {
    if (!isVisible) return

    const runCycle = () => {
      setAnimationPhase('reset')
      setShowRecipientDots([false, false, false, false])

      setTimeout(() => setAnimationPhase('moving'), 500)
      setTimeout(() => setAnimationPhase('splitting'), 1000)
      setTimeout(() => {
        setAnimationPhase('arrived')
      }, 1800)
      setTimeout(() => {
        const currentRecipientCount = getRecipientCount(cycle)
        const newDots = [false, false, false, false]
        for (let i = 0; i < currentRecipientCount; i++) {
          newDots[i] = true
        }
        setShowRecipientDots(newDots)
      }, 2000)
      setTimeout(() => {
        setShowRecipientDots([false, false, false, false])
        setCycle(prev => prev + 1)
      }, 3000)
    }

    runCycle()
    const interval = setInterval(runCycle, 4000)
    return () => clearInterval(interval)
  }, [isVisible, cycle])

  const getRecipientPosition = (index: number, totalCount: number): number => {
    // Adjust spacing based on number of recipients
    if (totalCount === 2) return 35 + (index * 30) // More spread out
    if (totalCount === 4) return 12 + (index * 20) // Tighter spacing
    return 20 + (index * 30) // Default for 3
  }

  const currentRecipientCount = getRecipientCount(cycle)
  const recipients = ['Alice', 'Bob', 'Carol', 'Eve'].slice(0, currentRecipientCount)
  const dotSize = currentRecipientCount === 4 ? 6 : 8

  // Calculate dot positions based on animation phase
  const getDotStyle = (index: number) => {
    const isActiveRecipient = index < currentRecipientCount
    const targetTop = getRecipientPosition(index, currentRecipientCount)
    const calculatedDotSize = Math.max(dotSize * 0.375, 6)
    
    let left, top, width, height, opacity
    
    switch (animationPhase) {
      case 'reset':
        left = '20px'
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0
        break
      case 'moving':
        left = '50%'
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0
        break
      case 'splitting':
        left = '100%'
        top = isActiveRecipient ? `${targetTop}%` : '50%'
        width = height = `${calculatedDotSize}px`
        opacity = isActiveRecipient ? 1 : 0
        break
      case 'arrived':
        left = '100%'
        top = isActiveRecipient ? `${targetTop}%` : '50%'
        width = height = `${calculatedDotSize}px`
        opacity = 0
        break
      default:
        opacity = 0
    }
    
    return {
      left,
      top,
      width,
      height,
      opacity,
      transform: 'translateY(-50%)',
      transition: animationPhase === 'reset' ? 'none' : 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div className="flex items-center justify-between h-full relative">
      {/* Sender */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-green-600/40 rounded-lg flex items-center justify-center">
          <span className="text-sm">⚡</span>
        </div>
      </div>

      {/* Recipients */}
      <div className="flex flex-col space-y-1">
        {recipients.map((name, index) => (
          <SimpleRecipient
            key={name}
            name={name}
            size="small"
            showDot={showRecipientDots[index]}
            dotSize={dotSize}
          />
        ))}
      </div>

      {/* Animated splitting dots */}
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full"
          style={getDotStyle(index)}
        />
      ))}
    </div>
  )
}

// Bottom Left: Fee flow with splitting animation and cashback
const CashbackFlow = ({ isVisible }: AnimationComponentProps) => {
  const [animationPhase, setAnimationPhase] = useState<'reset' | 'moving' | 'splitting' | 'arrived' | 'cashback' | 'cashbackMoving'>('reset')
  const [showRecipientDots, setShowRecipientDots] = useState([false, false, false])
  const [showSenderCashback, setShowSenderCashback] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const runCycle = () => {
      // Reset
      setAnimationPhase('reset')
      setShowRecipientDots([false, false, false])
      setShowSenderCashback(false)

      // Forward flow with splitting animation
      setTimeout(() => setAnimationPhase('moving'), 500)
      setTimeout(() => setAnimationPhase('splitting'), 1000)
      setTimeout(() => {
        setAnimationPhase('arrived')
      }, 1800)
      setTimeout(() => {
        setShowRecipientDots([true, true, true])
      }, 2000)

      // Cashback flow
      setTimeout(() => {
        setAnimationPhase('cashback')
        setShowRecipientDots([false, false, false])
      }, 3000)
      setTimeout(() => setAnimationPhase('cashbackMoving'), 3500)
      setTimeout(() => {
        setAnimationPhase('reset')
        setShowSenderCashback(true)
      }, 4500)
      setTimeout(() => setShowSenderCashback(false), 5000)
    }

    runCycle()
    const interval = setInterval(runCycle, 6000)
    return () => clearInterval(interval)
  }, [isVisible])

  // Calculate recipient positions
  const getRecipientPosition = (index: number): number => {
    const baseTop = 20 + (index * 30) // 20%, 50%, 80%
    return baseTop
  }

  // Calculate dot positions based on animation phase
  const getDotStyle = (index: number) => {
    const targetTop = getRecipientPosition(index)
    const dotSize = Math.max(8 * 0.375, 6) // Consistent size for fee flow

    let left, top, width, height, opacity

    switch (animationPhase) {
      case 'reset':
        left = '20px'
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0 // Only show main dot initially
        break
      case 'moving':
        left = '50%' // Move to center
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0 // Still only main dot
        break
      case 'splitting':
        left = '100%' // Continue to targets
        top = `${targetTop}%` // Split to different Y positions
        width = height = `${dotSize}px` // Change to target sizes
        opacity = 1 // All dots become visible
        break
      case 'arrived':
        left = '100%'
        top = `${targetTop}%`
        width = height = `${dotSize}px`
        opacity = 0 // Hide animated dots, show recipient dots instead
        break
      default:
        opacity = 0
    }

    return {
      left,
      top,
      width,
      height,
      opacity,
      transform: 'translateY(-50%)',
      transition: animationPhase === 'reset' ? 'none' : 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  // Calculate cashback dot position
  const getCashbackDotStyle = () => {
    let left, opacity

    switch (animationPhase) {
      case 'cashback':
        left = 'calc(100% - 60px)'
        opacity = 1
        break
      case 'cashbackMoving':
        left = '20px'
        opacity = 1
        break
      default:
        left = 'calc(100% - 60px)'
        opacity = 0
    }

    return {
      left,
      top: '60%',
      width: '8px',
      height: '8px',
      opacity,
      transform: 'translateY(-50%)',
      transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div className="flex items-center justify-between h-full relative">
      {/* Sender */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-green-600/40 rounded-lg flex items-center justify-center relative">
          <span className="text-sm">⚡</span>
          {showSenderCashback && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
          )}
        </div>
      </div>

      {/* Recipients */}
      <div className="flex flex-col space-y-1">
        {['Alice', 'Bob', 'Carol'].map((name, index) => (
          <SimpleRecipient
            key={name}
            name={name}
            size="small"
            showDot={showRecipientDots[index]}
            dotSize={8}
          />
        ))}
      </div>

      {/* Animated splitting dots (forward flow) */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full"
          style={getDotStyle(index)}
        />
      ))}

      {/* Animated cashback dot (reverse flow) */}
      <div
        className="absolute bg-yellow-400 rounded-full"
        style={getCashbackDotStyle()}
      />
    </div>
  )
}

// Bottom Right: Betting contract (keeping original since it's different)
const BettingContract = ({ isVisible }: AnimationComponentProps) => {
  const [senderDotsPosition, setSenderDotsPosition] = useState<('sender' | 'moving' | 'hidden')[]>(['sender', 'sender'])
  const [payoutDotPosition, setPayoutDotPosition] = useState<'contract' | 'moving' | 'hidden'>('hidden')
  const [showWinnerDot, setShowWinnerDot] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const runCycle = () => {
      // Reset
      setSenderDotsPosition(['sender', 'sender'])
      setPayoutDotPosition('hidden')
      setShowWinnerDot(false)

      // Senders send (staggered)
      setTimeout(() => setSenderDotsPosition(['moving', 'sender']), 500)
      setTimeout(() => setSenderDotsPosition(['moving', 'moving']), 700)
      setTimeout(() => {
        setSenderDotsPosition(['hidden', 'hidden'])
      }, 1500)

      // Contract pays out to winner (Alice)
      setTimeout(() => setPayoutDotPosition('contract'), 2500)
      setTimeout(() => setPayoutDotPosition('moving'), 3000)
      setTimeout(() => {
        setPayoutDotPosition('hidden')
        setShowWinnerDot(true)
      }, 4000)
      setTimeout(() => setShowWinnerDot(false), 4500)
    }

    runCycle()
    const interval = setInterval(runCycle, 5500)
    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <div className="flex items-center justify-between h-full relative">
      {/* Senders */}
      <div className="flex flex-col space-y-2">
        {['Alice', 'Bob'].map((name, index) => (
          <SimpleRecipient
            key={name}
            name={name}
            size="small"
            showDot={showWinnerDot && index === 0} // Alice wins
            dotSize={12}
          />
        ))}
      </div>

      {/* Betting Contract */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-purple-600/40 rounded-lg flex items-center justify-center">
          <span className="text-lg">🎲</span>
        </div>
      </div>

      {/* Animated sender dots */}
      {senderDotsPosition.map((position, index) =>
        position !== 'hidden' && (
          <div
            key={`sender-${index}`}
            className="absolute w-2 h-2 bg-white rounded-full transition-all duration-1000 ease-in-out"
            style={{
              top: `${35 + (index * 30)}%`,
              transform: 'translateY(-50%)',
              left: position === 'sender' ? '25px' : 'calc(100% - 60px)',
            }}
          />
        )
      )}

      {/* Animated payout dot */}
      {payoutDotPosition !== 'hidden' && (
        <div
          className="absolute w-3 h-3 bg-green-400 rounded-full transition-all duration-1000 ease-in-out"
          style={{
            top: '35%',
            transform: 'translateY(-50%)',
            left: payoutDotPosition === 'contract' ? 'calc(100% - 60px)' : '25px',
          }}
        />
      )}
    </div>
  )
}

const AbstractQuadrant = () => {
  const { ref, isVisible } = useIntersectionObserver(0.1)
  
  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Quadrant title="Variable Split">
          <VariableProportions isVisible={isVisible} />
        </Quadrant>
        
        <Quadrant title="Dynamic Recipients">
          <DynamicRecipients isVisible={isVisible} />
        </Quadrant>
        
        <Quadrant title="Fee Flow">
          <CashbackFlow isVisible={isVisible} />
        </Quadrant>
        
        <Quadrant title="Betting">
          <BettingContract isVisible={isVisible} />
        </Quadrant>
      </div>
    </div>
  )
}

export default AbstractQuadrant