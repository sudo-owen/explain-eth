import React, { useState, useEffect } from 'react'
import CircularCountdown from './CircularCountdown'

// Animated Dummy Transaction Modal Component for illustration
const DummyTransactionModal: React.FC = () => {
  const [phase, setPhase] = useState<'pending' | 'confirmed'>('pending')
  const [startTime, setStartTime] = useState(new Date())

  useEffect(() => {
    const cycle = () => {
      // Start with pending
      setPhase('pending')
      setStartTime(new Date())

      // After 12 seconds, show confirmed
      setTimeout(() => {
        setPhase('confirmed')
      }, 12000)

      // After 3 more seconds, restart the cycle
      setTimeout(() => {
        cycle()
      }, 15000)
    }

    cycle()
  }, [])

  const isPending = phase === 'pending'

  return (
    <div className={`max-w-sm mx-auto my-8 bg-gray-800 rounded-lg shadow-xl p-4 border-2 transition-all duration-300 ${
      isPending ? 'border-yellow-500' : 'border-green-500'
    }`}>
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPending ? 'bg-yellow-500' : 'bg-green-500'
        }`}>
          {isPending ? (
            <CircularCountdown
              duration={12000}
              startTime={startTime}
              size={32}
              strokeWidth={3}
              theme="ethereum"
            />
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1">
          <h3 className={`text-sm font-medium transition-all duration-300 ${
            isPending ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {isPending ? 'Transaction Pending' : 'Transaction Successful'}
          </h3>
          <div className="text-gray-300 text-sm mt-1">
            {isPending ? 'Sending 0.01 ETH to Alice 👩‍💼...' : 'Sent 0.01 ETH to Alice 👩‍💼'}
          </div>
        </div>
      </div>


    </div>
  )
}

export default DummyTransactionModal
