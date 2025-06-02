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
  const [showMainDot, setShowMainDot] = useState(false)
  const [mainDotPosition, setMainDotPosition] = useState('left') // 'left', 'splitter', 'splitting'
  const [showSplitDots, setShowSplitDots] = useState(false)
  const [splitDotsPosition, setSplitDotsPosition] = useState('splitter') // 'splitter', 'moving', 'arrived'

  useEffect(() => {
    const runAnimationCycle = () => {
      // Reset everything including balances
      setPhase('pending')
      setTransactionStatus('pending')
      setTransactionStartTime(new Date())
      setShowMainDot(false)
      setMainDotPosition('left')
      setShowSplitDots(false)
      setSplitDotsPosition('splitter')
      setRecipientBalances({ Alice: 0, Bob: 0, Carol: 0 })

      // Phase 1: Pending transaction, dot enters and goes to splitter (0-4s)
      setTimeout(() => {
        setShowMainDot(true)
      }, 500)

      setTimeout(() => {
        setMainDotPosition('splitter')
      }, 1500)

      // Phase 2: Transaction confirms, dot splits (4-5s)
      setTimeout(() => {
        setPhase('splitting')
        setTransactionStatus('confirmed')
        setMainDotPosition('splitting')
        setShowMainDot(false)
        setShowSplitDots(true)
      }, 4000)

      // Phase 3: Split dots move to recipients, balances update (5-6s)
      setTimeout(() => {
        setPhase('distributing')
        setSplitDotsPosition('moving')
      }, 5000)

      setTimeout(() => {
        setSplitDotsPosition('arrived')
        setShowSplitDots(false)
        // Update balances to show the split
        setRecipientBalances({
          Alice: 0.1,
          Bob: 0.1,
          Carol: 0.1
        })
      }, 5500)

      // Phase 4: Reset and restart (6s)
      setTimeout(() => {
        setPhase('resetting')
        setCycleCount(prev => prev + 1)
        runAnimationCycle()
      }, 6000)
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
                Transaction #{cycleCount + 1}
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
            <div className="bg-purple-600/40 border border-purple-500/60 rounded-lg p-6 text-center w-full max-w-xs">
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
              return (
                <div key={`${recipient}-${cycleCount}`} className={`${getRecipientBackgroundColor(recipient)} rounded-lg p-3 flex items-center space-x-3`}>
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

        {/* Main White Dot Animation */}
        {showMainDot && (
          <div
            className="absolute w-4 h-4 bg-white rounded-full transition-all duration-2000 ease-in-out z-10"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              left: mainDotPosition === 'left' ? '-20px' : 
                   mainDotPosition === 'splitter' ? 'calc(25% - 8px)' : 
                   'calc(25% - 8px)',
              opacity: mainDotPosition === 'splitting' ? 0 : 1
            }}
          />
        )}

        {/* Split Dots Animation */}
        {showSplitDots && (
          <>
            {recipients.map((recipient, index) => (
              <div
                key={`split-dot-${recipient}-${cycleCount}`}
                className="absolute w-3 h-3 bg-white rounded-full transition-all duration-1000 ease-in-out z-10"
                style={{
                  top: splitDotsPosition === 'splitter' ? '50%' : `${30 + index * 30}%`,
                  left: splitDotsPosition === 'splitter' ? 'calc(25% - 6px)' : 
                       splitDotsPosition === 'moving' ? 'calc(75% - 6px)' : 
                       'calc(75% - 6px)',
                  transform: 'translateY(-50%)',
                  opacity: splitDotsPosition === 'arrived' ? 0 : 1,
                  transitionDelay: `${index * 100}ms`
                }}
              />
            ))}
          </>
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
