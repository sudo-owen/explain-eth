import React from 'react'
import { Transaction } from '../types/blockchain'
import CircularCountdown from './CircularCountdown'
import { TRANSACTION_DURATION } from '../utils/transactions'
import { ColorTheme } from './ChainColumn'

interface TransactionHistoryProps {
  transactions: Transaction[]
  title: string
  theme: ColorTheme
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, title, theme }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getThemeColors = () => {
    if (theme === 'rollup') {
      return {
        background: 'bg-purple-950/30 border-purple-800/50',
        innerBackground: 'bg-purple-900/20'
      }
    }
    return {
      background: 'bg-gray-800 border-gray-700',
      innerBackground: 'bg-gray-700'
    }
  }

  const colors = getThemeColors()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getTransactionIcon = (type: string, status: string, timestamp?: Date) => {
    if (status === 'pending' && timestamp) {
      return (
        <CircularCountdown
          duration={TRANSACTION_DURATION}
          startTime={timestamp}
          size={24}
          strokeWidth={2}
          theme={theme}
        />
      )
    }

    switch (type) {
      case 'send':
        return (
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'purchase_nft':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'sell_nft':
        return (
          <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'deposit_savings':
        return (
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case 'send':
        return `Sent ${formatCurrency(tx.amount)} to ${tx.recipient}`
      case 'purchase_nft':
        return `Purchased NFT for ${formatCurrency(tx.amount)}`
      case 'sell_nft':
        return `Sold NFT for ${formatCurrency(tx.amount)}`
      case 'deposit_savings':
        return `Deposited ${formatCurrency(tx.amount)} to savings`
      default:
        return `Transaction: ${formatCurrency(tx.amount)}`
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className={`${colors.background} rounded-lg p-6 border`}>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{title} Transaction History</h3>
      
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`p-4 rounded-lg border transition-all ${
                tx.status === 'pending'
                  ? 'bg-yellow-900/20 border-yellow-500/30'
                  : tx.status === 'confirmed'
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-red-900/20 border-red-500/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getTransactionIcon(tx.type, tx.status, tx.timestamp)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {getTransactionDescription(tx)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : tx.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">
                      {formatTime(tx.timestamp)}
                    </p>
                    {tx.completionTime && (
                      <p className="text-xs text-gray-500">
                        Completed: {formatTime(tx.completionTime)}
                      </p>
                    )}
                  </div>
                  
                  {tx.errorMessage && (
                    <p className="text-xs text-red-400 mt-1">
                      Error: {tx.errorMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
