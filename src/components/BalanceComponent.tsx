import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import { Recipient } from '../types/blockchain'
import { formatETH } from '../utils/transactions'
import { getRecipientEmoji } from '../utils/recipients'
import FlashAnimation from './FlashAnimation'

interface BalanceComponentProps {
  showSendAction?: boolean
  allowedRecipients?: Recipient[]
  className?: string
}

const BalanceComponent: React.FC<BalanceComponentProps> = ({
  showSendAction = false,
  allowedRecipients = ['Alice', 'Bob', 'Carol'],
  className = ''
}) => {
  const { ethereumState, sendMoney, transactionHistory } = useBlockchainContext()
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient>(allowedRecipients[0] || 'Bob')

  // Quick send amounts
  const quickSendAmounts = [0.01]

  // Check if there's a pending send transaction to a specific recipient
  const isPendingSendToRecipient = (recipient: Recipient) => {
    return transactionHistory.some(tx =>
      tx.type === 'send' &&
      tx.recipient === recipient &&
      tx.status === 'pending' &&
      tx.chain === 'ethereum'
    )
  }

  const handleQuickSend = (amount: number) => {
    if (amount > 0 && amount <= ethereumState.balance) {
      sendMoney('ethereum', selectedRecipient, amount)
    }
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Your ETH Balance</h3>
      
      {/* Main Balance */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-green-400 mb-2">
          {formatETH(ethereumState.balance)}
        </div>
        <div className="text-sm text-gray-400">Available Balance</div>
      </div>

      {/* Send Action */}
      {showSendAction && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-200">Send ETH</h4>
          
          {/* Recipient Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">To:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {allowedRecipients.map((recipient) => {
                const recipientBalance = ethereumState.recipientBalances[recipient] || 0
                return (
                  <FlashAnimation
                    key={recipient}
                    trigger={recipientBalance}
                    flashColor="bg-blue-400/40"
                    flashType="border"
                    duration={1200}
                  >
                    <button
                      onClick={() => setSelectedRecipient(recipient)}
                      className={`
                        w-full flex flex-col items-center space-y-1 px-3 py-2 rounded-lg border transition-colors cursor-pointer
                        ${selectedRecipient === recipient
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getRecipientEmoji(recipient)}</span>
                        <span className="text-sm font-medium">{recipient}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatETH(recipientBalance)}
                      </span>
                    </button>
                  </FlashAnimation>
                )
              })}
            </div>
          </div>

          {/* Quick Send Buttons */}
          <div>
            <div className="w-full">
              {quickSendAmounts.map((amount) => {
                const isLoading = isPendingSendToRecipient(selectedRecipient)
                const canAfford = amount <= ethereumState.balance

                return (
                  <button
                    key={amount}
                    onClick={() => handleQuickSend(amount)}
                    disabled={isLoading || !canAfford}
                    className={`
                      w-full relative px-6 py-3 rounded-lg font-medium transition-all cursor-pointer
                      ${canAfford && !isLoading
                        ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse-glow'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Send {formatETH(amount)} (Click me!)
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BalanceComponent
