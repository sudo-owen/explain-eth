import React, { useEffect } from 'react'
import CircularCountdown from './CircularCountdown'
import { Transaction } from '../types/blockchain'
import { TRANSACTION_DURATION, ROLLUP_TRANSACTION_DURATION } from '../utils/transactions'

interface TransactionModalProps {
  isOpen: boolean
  type: 'success' | 'error'
  message: string
  onClose: () => void
  pendingTransaction?: Transaction | null
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  type,
  message,
  onClose,
  pendingTransaction
}) => {
  const isPending = pendingTransaction !== null
  const duration = pendingTransaction?.chain === 'rollup' ? ROLLUP_TRANSACTION_DURATION : TRANSACTION_DURATION

  useEffect(() => {
    if (isOpen && !isPending) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, isPending])

  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-7/8 sm:w-full">
      {/* Modal */}
      <div className={`
        bg-gray-800 rounded-lg shadow-xl p-4 border-2
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isPending ? 'border-yellow-500' : type === 'success' ? 'border-green-500' : 'border-red-500'}
      `}>
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isPending ? 'bg-yellow-500' : type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          `}>
            {isPending ? (
              pendingTransaction && (
                <CircularCountdown
                  duration={duration}
                  startTime={pendingTransaction.timestamp}
                  size={32}
                  strokeWidth={3}
                  theme={pendingTransaction.chain === 'rollup' ? 'rollup' : 'ethereum'}
                  displayScale={pendingTransaction.chain === 'rollup' ? 1 : 2}
                />
              )
            ) : type === 'success' ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${isPending ? 'text-yellow-400' : type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {isPending
                ? `Transaction #${pendingTransaction?.nonce} Pending`
                : type === 'success'
                ? 'Transaction Successful'
                : 'Transaction Failed'
              }
            </h3>
            <p className="text-gray-300 text-sm mt-1">{message}</p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default TransactionModal
