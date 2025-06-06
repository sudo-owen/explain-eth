import React, { useState, useEffect, useRef } from 'react'
import { Recipient } from '../types/blockchain'
import { formatETHTruncated } from '../utils/transactions'
import { getRecipientEmoji, getRecipientBackgroundColor, getRecipientAddressTruncated } from '../utils/recipients'
import CircularCountdown from './CircularCountdown'

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

// Local state interface for the animation
interface LocalRecipientBalances {
  Alice: number
  Bob: number
  Carol: number
}

// Animation phases
type AnimationPhase = 'pending' | 'splitting' | 'distributing' | 'resetting'

// Dot animation phases for the splitting effect
type DotAnimationPhase = 'reset' | 'moving' | 'splitting' | 'arrived'

// Props interface for split percentages
interface SplitAnimationProps {
  alicePercent?: number
  bobPercent?: number
  carolPercent?: number
  totalAmount?: number
}

const SplitAnimation: React.FC<SplitAnimationProps> = ({
  alicePercent = 33.33,
  bobPercent = 33.33,
  carolPercent = 33.33,
  totalAmount = 0.3
}) => {
  // Calculate split amounts
  const aliceAmount = (totalAmount * alicePercent) / 100
  const bobAmount = (totalAmount * bobPercent) / 100
  const carolAmount = (totalAmount * carolPercent) / 100

  // Intersection observer for viewport detection
  const { ref, isVisible } = useIntersectionObserver(0.1)

  // Animation state
  const [phase, setPhase] = useState<AnimationPhase>('pending')
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'confirmed'>('pending')
  const [transactionStartTime, setTransactionStartTime] = useState(new Date())
  const [cycleCount, setCycleCount] = useState(0)

  // Track timeouts for cleanup
  const timeoutsRef = useRef<number[]>([])
  
  // Local recipient balances (not synced with global state)
  const [recipientBalances, setRecipientBalances] = useState<LocalRecipientBalances>({
    Alice: 0,
    Bob: 0,
    Carol: 0,
  })
  
  // Animation elements visibility
  const [splitterCharged, setSplitterCharged] = useState(false)
  const [recipientCharging, setRecipientCharging] = useState<Record<string, boolean>>({
    Alice: false,
    Bob: false,
    Carol: false
  })
  const [dotAnimationPhase, setDotAnimationPhase] = useState<DotAnimationPhase>('reset')
  const [recipientDots, setRecipientDots] = useState<Record<string, boolean>>({
    Alice: false,
    Bob: false,
    Carol: false
  })


  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
    timeoutsRef.current = []
  }

  useEffect(() => {
    // Only run animation when component is visible
    if (!isVisible) {
      clearAllTimeouts()
      return
    }

    const runAnimationCycle = () => {
      // Clear any existing timeouts before starting new cycle
      clearAllTimeouts()

      // Reset everything including balances
      setPhase('pending')
      setTransactionStatus('pending')
      setTransactionStartTime(new Date())
      setSplitterCharged(false)
      setRecipientCharging({ Alice: false, Bob: false, Carol: false })
      setRecipientBalances({ Alice: 0, Bob: 0, Carol: 0 })
      setDotAnimationPhase('reset')
      setRecipientDots({ Alice: false, Bob: false, Carol: false })

      // Single animation sequence with all timing
      const animationSteps = [
        { delay: 100, action: () => setDotAnimationPhase('moving') },
        { delay: 200, action: () => setSplitterCharged(true) },
        { delay: 4000, action: () => { setPhase('splitting'); setTransactionStatus('confirmed'); setDotAnimationPhase('splitting') } },
        { delay: 4500, action: () => {
          setPhase('distributing')
          setSplitterCharged(false)
          setDotAnimationPhase('arrived')
        }},
        { delay: 4700, action: () => {
          setRecipientCharging(prev => ({ ...prev, Alice: true }))
          setRecipientBalances(prev => ({ ...prev, Alice: aliceAmount }))
          setRecipientDots(prev => ({ ...prev, Alice: true }))
        }}, // 200ms after splitter uncharged
        { delay: 4800, action: () => {
          setRecipientCharging(prev => ({ ...prev, Bob: true }))
          setRecipientBalances(prev => ({ ...prev, Bob: bobAmount }))
          setRecipientDots(prev => ({ ...prev, Bob: true }))
        }},
        { delay: 4900, action: () => {
          setRecipientCharging(prev => ({ ...prev, Carol: true }))
          setRecipientBalances(prev => ({ ...prev, Carol: carolAmount }))
          setRecipientDots(prev => ({ ...prev, Carol: true }))
        }},
        { delay: 6000, action: () => setRecipientCharging({ Alice: false, Bob: false, Carol: false }) },
        { delay: 8000, action: () => { setPhase('resetting'); setCycleCount(prev => prev + 1); runAnimationCycle() } }
      ]

      // Execute all steps and track timeouts
      animationSteps.forEach(step => {
        const timeoutId = setTimeout(step.action, step.delay)
        timeoutsRef.current.push(timeoutId)
      })
    }

    runAnimationCycle()

    // Cleanup function
    return () => {
      clearAllTimeouts()
    }
  }, [isVisible])

  const recipients: Recipient[] = ['Alice', 'Bob', 'Carol']

  // Calculate dot size based on amount (relative to total amount)
  const getDotSize = (amount: number): number => {
    const baseSize = 8 // minimum size in pixels
    const maxSize = 16 // maximum size in pixels
    const ratio = amount / totalAmount
    return Math.max(baseSize, Math.min(maxSize, baseSize + (ratio * (maxSize - baseSize))))
  }

  // Get animated dot style for splitting animation (similar to AbstractQuadrant)
  const getAnimatedDotStyle = (index: number) => {
    const recipients = ['Alice', 'Bob', 'Carol']
    const recipient = recipients[index]
    const amount = index === 0 ? aliceAmount : index === 1 ? bobAmount : carolAmount
    const dotSize = getDotSize(amount)

    // Calculate target positions for each recipient (approximate positions in the right column)
    const targetTops = [25, 50, 75] // Approximate percentages for Alice, Bob, Carol positions
    const targetTop = targetTops[index]

    let left: string, top: string, width: string, height: string, opacity: number

    switch (dotAnimationPhase) {
      case 'reset':
        left = '20px'
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0 // Only show main dot initially
        break
      case 'moving':
        left = '40%' // Move toward splitter
        top = '50%'
        width = height = '12px'
        opacity = index === 0 ? 1 : 0 // Still only main dot
        break
      case 'splitting':
        left = '75%' // Continue to recipients area
        top = `${targetTop}%` // Split to different Y positions
        width = height = `${dotSize}px` // Change to target sizes
        opacity = 1 // All dots become visible
        break
      case 'arrived':
        left = '75%'
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
      transition: dotAnimationPhase === 'reset' ? 'none' : 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg p-3 sm:p-6">
      {/* Pending Transaction Component */}
      <div className="mb-8">
        <div className={`
          bg-gray-700 rounded-lg shadow-lg p-4 border-2 transition-all duration-300
          ${transactionStatus === 'pending' ? 'border-yellow-500' : 'border-green-500'}
        `}>
          <div className="flex items-center space-x-3">
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${transactionStatus === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}
            `}>
              {transactionStatus === 'pending' ? (
                <CircularCountdown
                  duration={4000}
                  startTime={transactionStartTime}
                  size={32}
                  strokeWidth={3}
                  theme="ethereum"
                  hideValue={true}
                />
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="text-white font-medium">
                Transaction
              </div>
              <div className="text-gray-300 text-sm">
                Send {formatETHTruncated(totalAmount)} to Payment Splitter
              </div>
            </div>

            {/* Status */}
            <div className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${transactionStatus === 'pending' 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-green-500/20 text-green-400'
              }
            `}>
              {transactionStatus === 'pending' ? 'Pending' : 'Confirmed'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Animation Area */}
      <div className="relative h-80 sm:h-96 bg-gray-900 rounded-lg overflow-hidden">
        {/* Two Column Layout */}
        <div className="absolute inset-0 grid grid-cols-2 gap-3 sm:gap-8 p-3 sm:p-6">
          
          {/* Left Column - Payment Splitter */}
          <div className="flex items-center justify-center">
            <div className={`
              bg-green-700/40 rounded-lg p-3 sm:p-6 text-center w-full max-w-xs transition-all duration-500
              ${splitterCharged ? 'border-2 border-white shadow-lg shadow-white/20' : 'border border-green-500/60'}
            `}>
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
              <div className="text-sm sm:text-lg font-semibold text-gray-100 mb-1 sm:mb-2">Payment Splitter</div>
              {/* Full address on desktop, truncated on mobile */}
              <div className="text-xs text-gray-400 break-all sm:hidden">
                0x3f81...3214
              </div>
              <div className="text-xs text-gray-400 break-all hidden sm:block">
                0x3f81...3214
              </div>
            </div>
          </div>

          {/* Right Column - Profile Cards */}
          <div className="flex flex-col justify-center space-y-1 sm:space-y-3">
            {recipients.map((recipient) => {
              const balance = recipientBalances[recipient as keyof LocalRecipientBalances]
              const isCharging = recipientCharging[recipient]
              const showDot = recipientDots[recipient]
              const dotSize = getDotSize(balance)
              return (
                <div
                  key={`${recipient}-${cycleCount}`}
                  className={`
                    ${getRecipientBackgroundColor(recipient)} rounded-lg p-2 sm:p-3 flex items-center space-x-2 sm:space-x-3 transition-all duration-300 relative
                    ${isCharging ? 'border-2 border-white shadow-lg shadow-white/20' : 'border border-transparent'}
                  `}
                >
                  <div className="text-lg sm:text-2xl">{getRecipientEmoji(recipient)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-gray-100">{recipient}</div>
                    {/* Truncated address on mobile, full on desktop */}
                    <div className="text-xs text-gray-400 mb-1 sm:hidden">
                      {getRecipientAddressTruncated(recipient)}
                    </div>
                    <div className="text-xs text-gray-400 break-all mb-1 hidden sm:block">
                      {getRecipientAddressTruncated(recipient)}
                    </div>
                    <div className="text-s font-bold text-gray-200">
                      {formatETHTruncated(balance)}
                    </div>
                  </div>

                  {/* White dot representing received ETH */}
                  {showDot && (
                    <div
                      className="bg-white rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${dotSize}px`,
                        height: `${dotSize}px`,
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Animated splitting dots */}
        {[0, 1, 2].map((index) => (
          <div
            key={`split-dot-${index}-${cycleCount}`}
            className="absolute bg-white rounded-full z-10"
            style={getAnimatedDotStyle(index)}
          />
        ))}

      </div>

      {/* Status Message */}
      <div className="mt-4 text-center">
        <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded inline-block">
          {phase === 'pending' && `Sending ${formatETHTruncated(totalAmount)} to Payment Splitter`}
          {phase === 'splitting' && 'Payment Splitter executing'}
          {phase === 'distributing' && `Automatically sending ${formatETHTruncated(aliceAmount)} to Alice, ${formatETHTruncated(bobAmount)} to Bob, and ${formatETHTruncated(carolAmount)} to Carol`}
          {phase === 'resetting' && 'Transaction complete!'}
        </div>
      </div>
    </div>
  )
}

export default SplitAnimation
