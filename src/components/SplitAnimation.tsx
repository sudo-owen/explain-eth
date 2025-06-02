import React, { useState, useEffect } from 'react'
import { Recipient } from '../types/blockchain'
import { formatETH } from '../utils/transactions'
import { getRecipientEmoji, getRecipientBackgroundColor, getRecipientAddress } from '../utils/recipients'
import CircularCountdown from './CircularCountdown'

// Local state interface for the animation
interface LocalRecipientBalances {
  Alice: number
  Bob: number
  Carol: number
}

// Animation phases
type AnimationPhase = 'pending' | 'splitting' | 'distributing' | 'resetting'

const SplitAnimation: React.FC = () => {
  // Animation state
  const [phase, setPhase] = useState<AnimationPhase>('pending')
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'confirmed'>('pending')
  const [transactionStartTime, setTransactionStartTime] = useState(new Date())
  const [cycleCount, setCycleCount] = useState(0)
  
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
  const [showMainDot, setShowMainDot] = useState(false)
  const [mainDotPosition, setMainDotPosition] = useState('left') // 'left', 'moving', 'hidden'


  useEffect(() => {
    const runAnimationCycle = () => {
      // Reset everything including balances
      setPhase('pending')
      setTransactionStatus('pending')
      setTransactionStartTime(new Date())
      setSplitterCharged(false)
      setRecipientCharging({ Alice: false, Bob: false, Carol: false })
      setRecipientBalances({ Alice: 0, Bob: 0, Carol: 0 })
      setShowMainDot(false)
      setMainDotPosition('left')

      // Single animation sequence with all timing
      const animationSteps = [
        { delay: 100, action: () => setShowMainDot(true) },
        { delay: 200, action: () => { setMainDotPosition('moving'); setSplitterCharged(true) } },
        { delay: 4000, action: () => { setPhase('splitting'); setTransactionStatus('confirmed') } },
        { delay: 4500, action: () => {
          setMainDotPosition('hidden')
          setShowMainDot(false)
          setPhase('distributing')
          setSplitterCharged(false)
        }},
        { delay: 4700, action: () => setRecipientCharging(prev => ({ ...prev, Alice: true })) }, // 200ms after splitter uncharged
        { delay: 4800, action: () => setRecipientCharging(prev => ({ ...prev, Bob: true })) },
        { delay: 4900, action: () => setRecipientCharging(prev => ({ ...prev, Carol: true })) },
        { delay: 5500, action: () => setRecipientBalances({ Alice: 0.1, Bob: 0.1, Carol: 0.1 }) },
        { delay: 6000, action: () => setRecipientCharging({ Alice: false, Bob: false, Carol: false }) },
        { delay: 8000, action: () => { setPhase('resetting'); setCycleCount(prev => prev + 1); runAnimationCycle() } }
      ]

      // Execute all steps
      animationSteps.forEach(step => {
        setTimeout(step.action, step.delay)
      })
    }

    runAnimationCycle()
  }, [])

  const recipients: Recipient[] = ['Alice', 'Bob', 'Carol']

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
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
                Send 0.3 ETH to Payment Splitter
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
      <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
        {/* Two Column Layout */}
        <div className="absolute inset-0 grid grid-cols-2 gap-8 p-6">
          
          {/* Left Column - Payment Splitter */}
          <div className="flex items-center justify-center">
            <div className={`
              bg-purple-600/40 rounded-lg p-6 text-center w-full max-w-xs transition-all duration-500
              ${splitterCharged ? 'border-2 border-white shadow-lg shadow-white/20' : 'border border-purple-500/60'}
            `}>
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-lg font-semibold text-gray-100 mb-2">Payment Splitter</div>
              <div className="text-xs text-gray-400 break-all">
                0x3f81D81e0884abD8Cc4583a704a9397972623214
              </div>
            </div>
          </div>

          {/* Right Column - Profile Cards */}
          <div className="flex flex-col justify-center space-y-3">
            {recipients.map((recipient) => {
              const balance = recipientBalances[recipient as keyof LocalRecipientBalances]
              const isCharging = recipientCharging[recipient]
              return (
                <div
                  key={`${recipient}-${cycleCount}`}
                  className={`
                    ${getRecipientBackgroundColor(recipient)} rounded-lg p-3 flex items-center space-x-3 transition-all duration-300
                    ${isCharging ? 'border-2 border-white shadow-lg shadow-white/20' : 'border border-transparent'}
                  `}
                >
                  <div className="text-2xl">{getRecipientEmoji(recipient)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-100">{recipient}</div>
                    <div className="text-xs text-gray-400 break-all mb-1">
                      {getRecipientAddress(recipient)}
                    </div>
                    <div className="text-xs font-medium text-green-400">
                      {formatETH(balance)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main White Dot Animation - visible only when not overlapping components */}
        {showMainDot && mainDotPosition !== 'hidden' && (
          <div
            className="absolute w-4 h-4 bg-white rounded-full transition-all duration-1000 ease-in-out z-10"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              left: mainDotPosition === 'left' ? '-20px' : 'calc(40% - 8px)', // Stop before splitter component
              opacity: 1
            }}
          />
        )}

      </div>

      {/* Status Message */}
      <div className="mt-4 text-center">
        <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded inline-block">
          {phase === 'pending' && 'Sending 0.3 ETH to Payment Splitter...'}
          {phase === 'splitting' && 'Payment Splitter executing...'}
          {phase === 'distributing' && 'Automatically distributing 0.1 ETH to Alice, Bob, and Carol...'}
          {phase === 'resetting' && 'Transaction complete!'}
        </div>
      </div>
    </div>
  )
}

export default SplitAnimation
