import React, { useState } from 'react'
import { Transaction } from '../types/blockchain'
import CircularCountdown from './CircularCountdown'
import { TRANSACTION_DURATION, formatETH } from '../utils/transactions'

interface TransactionHistoryOverlayProps {
  ethereumTransactions: Transaction[]
  rollupTransactions: Transaction[]
  ethereumPendingCount: number
  rollupPendingCount: number
  isOpen: boolean
  onToggle: () => void
}

const TransactionHistoryOverlay: React.FC<TransactionHistoryOverlayProps> = ({
  ethereumTransactions,
  rollupTransactions,
  ethereumPendingCount,
  rollupPendingCount,
  isOpen,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState<'ethereum' | 'rollup'>('ethereum')

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
          size={20}
          strokeWidth={2}
          theme="ethereum"
        />
      )
    }

    switch (type) {
      case 'send':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'purchase_nft':
        return (
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'sell_nft':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'deposit_earnings':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )
      case 'withdraw_earnings':
        return (
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )
      case 'claim_earnings':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'bridge':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case 'send':
        return `Sent ${formatETH(tx.amount)} to ${tx.recipient} (Fee: ${formatETH(tx.fee)})`
      case 'purchase_nft':
        return `Purchased NFT for ${formatETH(tx.amount)} (Fee: ${formatETH(tx.fee)})`
      case 'sell_nft':
        return `Sold NFT for ${formatETH(tx.amount)} (Fee: ${formatETH(tx.fee)})`
      case 'deposit_earnings':
        return `Deposited ${formatETH(tx.amount)} to earn (Fee: ${formatETH(tx.fee)})`
      case 'withdraw_earnings':
        return `Withdrew ${formatETH(tx.amount)} from earn (Fee: ${formatETH(tx.fee)})`
      case 'claim_earnings':
        return `Claimed ${formatETH(tx.amount)} interest (Fee: ${formatETH(tx.fee)})`
      case 'bridge':
        return `Bridged ${formatETH(tx.amount)} to Rollup (Fee: ${formatETH(tx.fee)})`
      default:
        return `Transaction: ${formatETH(tx.amount)} (Fee: ${formatETH(tx.fee)})`
    }
  }

  const currentTransactions = activeTab === 'ethereum' ? ethereumTransactions : rollupTransactions
  const sortedTransactions = [...currentTransactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <>
      {/* Transaction History Panel */}
      <div className={`
        fixed bottom-4 right-4 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Transaction History</h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('ethereum')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'ethereum'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div>Ethereum Mainnet ({ethereumTransactions.length})</div>
            {ethereumPendingCount > 0 && (
              <div className="text-xs text-yellow-400 mt-1">
                {ethereumPendingCount} pending...
              </div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rollup')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'rollup'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div>Rollup ({rollupTransactions.length})</div>
            {rollupPendingCount > 0 && (
              <div className="text-xs text-yellow-400 mt-1">
                {rollupPendingCount} pending...
              </div>
            )}
          </button>
        </div>

        {/* Transaction List */}
        <div className="h-96 overflow-y-auto p-4">
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`p-3 rounded-lg border transition-all ${
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
                        <p className="text-xs font-medium text-gray-200 truncate">
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
      </div>

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 z-40 cursor-pointer"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      )}
    </>
  )
}

export default TransactionHistoryOverlay
