import React, { useState, useEffect } from 'react'
import { Transaction, Recipient } from '../types/blockchain'
import { generateTransactionId, generateTransactionFee, formatETHTruncated } from '../utils/transactions'
import CircularCountdown from './CircularCountdown'

// Test transaction generation
const generateTestTransaction = (): Transaction => {
  const recipients: Recipient[] = ['Alice', 'Bob', 'Carol']
  const amounts = [0.01, 0.05, 0.1, 0.02, 0.03]
  
  return {
    id: generateTransactionId(),
    chain: 'ethereum',
    type: 'send',
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    fee: generateTransactionFee(false),
    recipient: recipients[Math.floor(Math.random() * recipients.length)],
    status: 'pending',
    timestamp: new Date(),
    nonce: Math.floor(Math.random() * 1000)
  }
}

interface BlockSlotProps {
  transaction?: Transaction
  isEmpty: boolean
  isConfirmed: boolean
  slotIndex: number
}

const BlockSlot: React.FC<BlockSlotProps> = ({ transaction, isEmpty, isConfirmed, slotIndex }) => {
  if (isEmpty) {
    return (
      <div className="h-12 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-sm">Empty Slot</span>
      </div>
    )
  }

  if (!transaction) return null

  const getTransactionIcon = () => {
    if (isConfirmed) {
      return (
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    }

    // For pending transactions, just show a simple pending icon
    return (
      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    )
  }

  return (
    <div
      className={`p-2 rounded-lg border transition-all duration-500 ${
        isConfirmed
          ? 'bg-green-900/20 border-green-500/30'
          : 'bg-yellow-900/20 border-yellow-500/30'
      }`}
      style={{
        animationDelay: `${slotIndex * 200}ms`
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {getTransactionIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-200 truncate">
              Sent {formatETHTruncated(transaction.amount)} to {transaction.recipient}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface BlockContainerProps {
  transactions: Transaction[]
  isConfirmed: boolean
  isMoving: boolean
  blockNumber: number
  blockStartTime?: Date
}

const BlockContainer: React.FC<BlockContainerProps> = ({
  transactions,
  isConfirmed,
  isMoving,
  blockNumber,
  blockStartTime
}) => {
  const slots = Array.from({ length: 4 }, (_, index) => {
    const transaction = transactions[index]
    return (
      <BlockSlot
        key={`slot-${blockNumber}-${index}`}
        transaction={transaction}
        isEmpty={!transaction}
        isConfirmed={isConfirmed}
        slotIndex={index}
      />
    )
  })

  const getBlockIcon = () => {
    if (isConfirmed) {
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    }

    if (blockStartTime && transactions.length > 0) {
      return (
        <CircularCountdown
          duration={12000}
          startTime={blockStartTime}
          size={24}
          strokeWidth={2}
          theme="ethereum"
        />
      )
    }

    return null
  }

  return (
    <div
      className={`w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all duration-1000 ${
        isMoving ? 'transform translate-x-[calc(100%+34px)] opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-100">
            Block #{blockNumber}
          </h3>
          {getBlockIcon()}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isConfirmed
            ? 'bg-green-500/20 text-green-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {isConfirmed ? 'Confirmed' : 'Pending'}
        </span>
      </div>

      <div className="space-y-2">
        {slots}
      </div>
    </div>
  )
}

const BlockAnimation: React.FC = () => {
  const [currentBlock, setCurrentBlock] = useState<Transaction[]>([])
  const [previousBlock, setPreviousBlock] = useState<Transaction[]>([])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [blockNumber, setBlockNumber] = useState(1)
  const [phase, setPhase] = useState<'filling' | 'confirming' | 'moving'>('filling')
  const [blockStartTime, setBlockStartTime] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const runBlockCycle = () => {
      // Phase 1: Fill the block with transactions
      setPhase('filling')
      setCurrentBlock([])
      setIsConfirmed(false)
      setIsMoving(false)
      setBlockStartTime(undefined)

      // Generate 1-4 random transactions
      const numTransactions = Math.floor(Math.random() * 4) + 1
      
      // Use a closure variable to track transactions across all setTimeout callbacks
      const allTransactions: Transaction[] = []
      let firstTransactionAdded = false

      for (let i = 0; i < numTransactions; i++) {
        setTimeout(() => {
          const newTx = generateTestTransaction()
          allTransactions.push(newTx)
          
          // Update state with a copy of the transactions
          setCurrentBlock([...allTransactions])

          // Set block start time when first transaction is added
          if (!firstTransactionAdded) {
            setBlockStartTime(new Date())
            firstTransactionAdded = true
          }
        }, i * 500)
      }

      // Phase 2: Wait for confirmation (12 seconds from first transaction)
      setTimeout(() => {
        setPhase('confirming')
        setIsConfirmed(true)
      }, 12000)

      // Phase 3: Move block to the right (after 13 seconds)
      setTimeout(() => {
        setPhase('moving')
        setIsMoving(true)
      }, 13000)

      // Phase 4: Complete the move and update previous block (after 15 seconds)
      setTimeout(() => {
        // Use the allTransactions array directly - it has all the transactions
        setPreviousBlock([...allTransactions])
        
        // Clear current block for next cycle
        setCurrentBlock([])
        setIsMoving(false)
        setBlockNumber(prev => prev + 1)

        // Start next cycle after a brief pause
        setTimeout(() => {
          runBlockCycle()
        }, 1000)
      }, 15000)
    }

    runBlockCycle()
  }, [])

  const getStatusMessage = () => {
    switch (phase) {
      case 'filling':
        return 'Collecting transactions into block...'
      case 'confirming':
        return 'Block confirmed! All transactions processed.'
      case 'moving':
        return 'Block added to blockchain. Starting new block...'
      default:
        return ''
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-12 pb-4 bg-gray-800 rounded-lg">
      <div className="p-6 pb-1">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Block Building</h2>
        </div>

        {/* Two-column layout for blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Current Block */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 text-center">Current Block</h3>
            <BlockContainer
              transactions={currentBlock}
              isConfirmed={isConfirmed}
              isMoving={isMoving}
              blockNumber={blockNumber}
              blockStartTime={blockStartTime}
            />
          </div>

          {/* Previous Block (if exists) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 text-center">Previous Block</h3>
            {previousBlock.length > 0 ? (
                <BlockContainer
                  transactions={previousBlock}
                  isConfirmed={true}
                  isMoving={false}
                  blockNumber={blockNumber-1}
                />
            ) : (
              <div className="w-full max-w-sm bg-gray-700/50 border border-gray-600 border-dashed rounded-lg p-4 h-74 flex items-center justify-center">
                <span className="text-gray-500">No previous block</span>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex justify-center">
          <div className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
            {getStatusMessage()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockAnimation