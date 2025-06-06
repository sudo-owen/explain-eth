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
      case 'Send/Receive Money':
        return 'bg-blue-900/20 border-blue-700/30'
      case 'Split Bills':
        return 'bg-green-900/20 border-green-700/30'
      case 'Earn Interest':
        return 'bg-yellow-900/20 border-yellow-700/30'
      case 'New Apps':
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

// Top Left: Send/Receive Money - nodes representing Alice/Bob/Carol with white dot moving between them
const SendReceiveMoney = ({ isVisible }: AnimationComponentProps) => {
  const [dotPosition, setDotPosition] = useState<'alice' | 'moving-to-bob' | 'bob' | 'moving-to-carol' | 'carol' | 'moving-to-alice'>('alice')

  useEffect(() => {
    if (!isVisible) return

    const runCycle = () => {
      // Alice -> Bob -> Carol -> Alice cycle
      setDotPosition('alice')
      setTimeout(() => setDotPosition('moving-to-bob'), 500)
      setTimeout(() => setDotPosition('bob'), 1500)
      setTimeout(() => setDotPosition('moving-to-carol'), 2000)
      setTimeout(() => setDotPosition('carol'), 3000)
      setTimeout(() => setDotPosition('moving-to-alice'), 3500)
    }

    runCycle()
    const interval = setInterval(runCycle, 4500)
    return () => clearInterval(interval)
  }, [isVisible])

  const getDotStyle = () => {
    let left, top, opacity = 1

    switch (dotPosition) {
      case 'alice':
        left = '20px'
        top = '25%'
        break
      case 'moving-to-bob':
        left = '50%'
        top = '50%'
        break
      case 'bob':
        left = '80%'
        top = '75%'
        break
      case 'moving-to-carol':
        left = '50%'
        top = '25%'
        break
      case 'carol':
        left = '20px'
        top = '75%'
        break
      case 'moving-to-alice':
        left = '35%'
        top = '40%'
        break
      default:
        opacity = 0
    }

    return {
      left,
      top,
      width: '8px',
      height: '8px',
      opacity,
      transform: 'translate(-50%, -50%)',
      transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div className="h-full relative">
      {/* Alice */}
      <div className="absolute" style={{ left: '10px', top: '15%' }}>
        <SimpleRecipient name="Alice" size="small" />
      </div>

      {/* Bob */}
      <div className="absolute" style={{ right: '10px', bottom: '15%' }}>
        <SimpleRecipient name="Bob" size="small" />
      </div>

      {/* Carol */}
      <div className="absolute" style={{ left: '10px', bottom: '15%' }}>
        <SimpleRecipient name="Carol" size="small" />
      </div>

      {/* Moving white dot */}
      <div
        className="absolute bg-white rounded-full"
        style={getDotStyle()}
      />
    </div>
  )
}

// Top Right: Split Bills - white dot splitting to go to different nodes
const SplitBills = ({ isVisible }: AnimationComponentProps) => {
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
      }, 3000)
    }

    runCycle()
    const interval = setInterval(runCycle, 4000)
    return () => clearInterval(interval)
  }, [isVisible])

  // Calculate dot positions based on animation phase
  const getDotStyle = (index: number) => {
    const targetPositions = [
      { left: '80%', top: '25%' }, // Alice
      { left: '80%', top: '50%' }, // Bob  
      { left: '80%', top: '75%' }  // Carol
    ]
    
    let left, top, width, height, opacity
    
    switch (animationPhase) {
      case 'reset':
        left = '20px'
        top = '50%'
        width = height = '8px'
        opacity = index === 0 ? 1 : 0 // Only show main dot initially
        break
      case 'moving':
        left = '50%' // Move to center
        top = '50%'
        width = height = '8px'
        opacity = index === 0 ? 1 : 0 // Still only main dot
        break
      case 'splitting':
        left = targetPositions[index].left
        top = targetPositions[index].top
        width = height = '6px'
        opacity = 1 // All dots become visible
        break
      case 'arrived':
        left = targetPositions[index].left
        top = targetPositions[index].top
        width = height = '6px'
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
      transform: 'translate(-50%, -50%)',
      transition: animationPhase === 'reset' ? 'none' : 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div className="h-full relative">
      {/* Sender */}
      <div className="absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
        <div className="w-8 h-8 bg-green-600/40 rounded-lg flex items-center justify-center">
          <span className="text-sm">💰</span>
        </div>
      </div>

      {/* Recipients */}
      <div className="absolute" style={{ right: '10px', top: '15%' }}>
        <SimpleRecipient name="Alice" size="small" showDot={showRecipientDots[0]} dotSize={6} />
      </div>
      <div className="absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
        <SimpleRecipient name="Bob" size="small" showDot={showRecipientDots[1]} dotSize={6} />
      </div>
      <div className="absolute" style={{ right: '10px', bottom: '15%' }}>
        <SimpleRecipient name="Carol" size="small" showDot={showRecipientDots[2]} dotSize={6} />
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

// Bottom Left: Earn Interest - abstract growth animation similar to VolatilityComparison but upward only
const EarnInterest = ({ isVisible }: AnimationComponentProps) => {
  const [progress, setProgress] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  // Growth trajectory - only upward movement
  const growthTrajectory = [
    { x: 0, y: 80 },    // Start low
    { x: 15, y: 75 },   // Small growth
    { x: 30, y: 65 },   // More growth
    { x: 45, y: 55 },   // Steady rise
    { x: 60, y: 40 },   // Bigger jump
    { x: 75, y: 30 },   // Continued growth
    { x: 90, y: 20 },   // Strong growth
    { x: 100, y: 15 }   // Peak
  ]

  const createPath = (trajectory: { x: number; y: number }[], currentProgress: number) => {
    if (currentProgress === 0) return ''

    const totalPoints = trajectory.length
    const currentIndex = Math.floor((currentProgress / 100) * (totalPoints - 1))
    const nextIndex = Math.min(currentIndex + 1, totalPoints - 1)
    const localProgress = ((currentProgress / 100) * (totalPoints - 1)) % 1

    // Get points up to current position
    const visiblePoints = trajectory.slice(0, currentIndex + 1)

    // Interpolate current position if between points
    if (currentIndex < totalPoints - 1 && localProgress > 0) {
      const current = trajectory[currentIndex]
      const next = trajectory[nextIndex]
      const interpolatedPoint = {
        x: current.x + (next.x - current.x) * localProgress,
        y: current.y + (next.y - current.y) * localProgress
      }
      visiblePoints.push(interpolatedPoint)
    }

    // Create SVG path
    if (visiblePoints.length === 0) return ''

    let path = `M ${visiblePoints[0].x * 1.5} ${visiblePoints[0].y}`
    for (let i = 1; i < visiblePoints.length; i++) {
      path += ` L ${visiblePoints[i].x * 1.5} ${visiblePoints[i].y}`
    }

    return path
  }

  useEffect(() => {
    if (!isVisible) return

    const duration = 4000 // 4 seconds for full animation
    const interval = 50 // Update every 50ms

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Reset and start new cycle
          setTimeout(() => {
            setAnimationKey(k => k + 1)
            setProgress(0)
          }, 1000) // 1 second pause before restart
          return 100
        }
        return prev + (100 / (duration / interval))
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, animationKey])

  return (
    <div className="h-full relative bg-gray-700/30 rounded-lg p-2">
      {/* Dollar sign */}
      <div className="absolute top-2 left-2 text-green-400 text-lg font-bold">$</div>

      {/* Growth Chart */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 150 100"
        className="absolute inset-0"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="growthGrid" width="15" height="10" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="150" height="100" fill="url(#growthGrid)" />

        {/* Growth line */}
        <path
          d={createPath(growthTrajectory, progress)}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-1 left-1 text-xs text-gray-400">Interest</div>
    </div>
  )
}

// Bottom Right: New Apps - abstract SVG animation of a web page and user node
const NewApps = ({ isVisible }: AnimationComponentProps) => {
  const [connectionPhase, setConnectionPhase] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [appFeatures, setAppFeatures] = useState([false, false, false])

  useEffect(() => {
    if (!isVisible) return

    const runCycle = () => {
      // Reset
      setConnectionPhase('disconnected')
      setAppFeatures([false, false, false])

      // User connects to app
      setTimeout(() => setConnectionPhase('connecting'), 500)
      setTimeout(() => setConnectionPhase('connected'), 1500)

      // App features light up sequentially
      setTimeout(() => setAppFeatures([true, false, false]), 2000)
      setTimeout(() => setAppFeatures([true, true, false]), 2500)
      setTimeout(() => setAppFeatures([true, true, true]), 3000)

      // Reset for next cycle
      setTimeout(() => {
        setAppFeatures([false, false, false])
      }, 4000)
    }

    runCycle()
    const interval = setInterval(runCycle, 5000)
    return () => clearInterval(interval)
  }, [isVisible])

  const getConnectionDotStyle = () => {
    let left, opacity = 1

    switch (connectionPhase) {
      case 'disconnected':
        left = '20px'
        opacity = 0
        break
      case 'connecting':
        left = '50%'
        break
      case 'connected':
        left = '80%'
        opacity = 0
        break
    }

    return {
      left,
      top: '50%',
      width: '6px',
      height: '6px',
      opacity,
      transform: 'translate(-50%, -50%)',
      transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div className="h-full relative">
      {/* User Node */}
      <div className="absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
        <div className="w-8 h-8 bg-blue-600/40 rounded-lg flex items-center justify-center">
          <span className="text-sm">👤</span>
        </div>
      </div>

      {/* Web App Interface */}
      <div className="absolute" style={{ right: '10px', top: '20%', width: '60px', height: '60px' }}>
        <div className="w-full h-full bg-purple-600/20 border border-purple-500/40 rounded-lg p-1">
          {/* App header */}
          <div className="w-full h-2 bg-purple-500/30 rounded-sm mb-1"></div>

          {/* App features */}
          <div className="space-y-1">
            <div className={`w-full h-1.5 rounded-sm transition-colors duration-300 ${
              appFeatures[0] ? 'bg-green-400' : 'bg-gray-600'
            }`}></div>
            <div className={`w-3/4 h-1.5 rounded-sm transition-colors duration-300 ${
              appFeatures[1] ? 'bg-blue-400' : 'bg-gray-600'
            }`}></div>
            <div className={`w-1/2 h-1.5 rounded-sm transition-colors duration-300 ${
              appFeatures[2] ? 'bg-yellow-400' : 'bg-gray-600'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Moving connection dot */}
      <div
        className="absolute bg-white rounded-full"
        style={getConnectionDotStyle()}
      />

      {/* App label */}
      <div className="absolute bottom-1 right-1 text-xs text-purple-400">App</div>
    </div>
  )
}

interface IntroAbstractQuadrantProps {
  quadrantType?: 'Send/Receive Money' | 'Split Bills' | 'Earn Interest' | 'New Apps'
}

const IntroAbstractQuadrant: React.FC<IntroAbstractQuadrantProps> = ({ quadrantType }) => {
  const { ref, isVisible } = useIntersectionObserver(0.1)

  // Helper function to render individual quadrant
  const renderQuadrant = (title: string) => {
    switch (title) {
      case 'Send/Receive Money':
        return (
          <Quadrant title="Send/Receive Money">
            <SendReceiveMoney isVisible={isVisible} />
          </Quadrant>
        )
      case 'Split Bills':
        return (
          <Quadrant title="Split Bills">
            <SplitBills isVisible={isVisible} />
          </Quadrant>
        )
      case 'Earn Interest':
        return (
          <Quadrant title="Earn Interest">
            <EarnInterest isVisible={isVisible} />
          </Quadrant>
        )
      case 'New Apps':
        return (
          <Quadrant title="New Apps">
            <NewApps isVisible={isVisible} />
          </Quadrant>
        )
      default:
        return null
    }
  }

  // If quadrantType is specified, render only that quadrant
  if (quadrantType) {
    return (
      <div ref={ref} className="w-full max-w-md mx-auto bg-gray-900 rounded-lg p-4">
        {renderQuadrant(quadrantType)}
      </div>
    )
  }

  // Default behavior: render all quadrants in grid
  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderQuadrant('Send/Receive Money')}
        {renderQuadrant('Split Bills')}
        {renderQuadrant('Earn Interest')}
        {renderQuadrant('New Apps')}
      </div>
    </div>
  )
}

export default IntroAbstractQuadrant
