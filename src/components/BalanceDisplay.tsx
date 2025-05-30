import React, { useState, useEffect } from 'react'
import { ChainState } from '../types/blockchain'
import { ColorTheme } from './ChainColumn'
import { getRecipientEmoji } from '../utils/recipients'
import { calculateCurrentEarnings, formatETH } from '../utils/transactions'

interface BalanceDisplayProps {
  chainState: ChainState
  title: string
  theme: ColorTheme
  onSellNFT: (nftId: string) => void
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ chainState, title, theme, onSellNFT }) => {
  const [currentEarnings, setCurrentEarnings] = useState(0)

  const formatCurrency = (amount: number) => {
    return formatETH(amount)
  }

  // Update earnings display in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEarnings(calculateCurrentEarnings(chainState))
    }, 100) // Update every 100ms for smooth animation

    return () => clearInterval(interval)
  }, [chainState])

  const getThemeColors = () => {
    if (theme === 'rollup') {
      return {
        balance: 'text-purple-400',
        savings: 'text-indigo-400',
        pending: 'text-amber-400',
        background: 'bg-purple-950/30 border-purple-800/50',
        innerBackground: 'bg-purple-900/20'
      }
    }
    return {
      balance: 'text-green-400',
      savings: 'text-blue-400',
      pending: 'text-yellow-400',
      background: 'bg-gray-800 border-gray-700',
      innerBackground: 'bg-gray-700'
    }
  }

  const colors = getThemeColors()

  return (
    <div className={`${colors.background} rounded-lg p-6 border`}>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{title} Balance</h3>
      
      {/* Main Balance */}
      <div className="mb-6">
        <div className={`text-3xl font-bold ${colors.balance} mb-2`}>
          {formatCurrency(chainState.balance)}
        </div>
        <div className="text-sm text-gray-400">Available Balance</div>
        {chainState.pendingTransactions > 0 && (
          <div className={`text-xs ${colors.pending} mt-1`}>
            {chainState.pendingTransactions} transaction(s) pending...
          </div>
        )}
      </div>

      {/* Earnings */}
      {chainState.savingsDeposit > 0 && (
        <div className={`mb-6 p-4 ${colors.innerBackground} rounded-lg`}>
          <div className="text-sm text-gray-300 mb-2">💰 Earn Balance</div>
          <div className={`text-xl font-semibold ${colors.savings} mb-2`}>
            {formatCurrency(chainState.savingsDeposit)}
          </div>
          <div className="border-t border-gray-600 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Accrued Interest:</span>
              <span className={`text-sm font-medium ${colors.balance}`}>
                {formatCurrency(currentEarnings)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Earning 1% per second
            </div>
          </div>
        </div>
      )}

      {/* NFTs */}
      {chainState.nfts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-200 mb-3">🎨 NFT Collection</h4>
          <div className="grid grid-cols-2 gap-3">
            {chainState.nfts.map((nft) => {
              const isPendingSell = chainState.pendingSells.has(nft.id)
              return (
                <div key={nft.id} className={`p-3 ${colors.innerBackground} rounded-lg text-center`}>
                  <div className="text-3xl mb-2">{nft.emoji}</div>
                  <div className="text-xs font-medium text-gray-200 mb-1">{nft.name}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    Bought: {formatCurrency(nft.purchasePrice)}
                  </div>
                  <button
                    onClick={() => onSellNFT(nft.id)}
                    disabled={isPendingSell}
                    className={`
                      w-full px-2 py-1 text-xs rounded transition-colors
                      ${isPendingSell
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                      }
                    `}
                  >
                    {isPendingSell ? '⏳ Selling...' : '💰 Sell'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recipient Balances */}
      <div>
        <h4 className="text-md font-medium text-gray-200 mb-3">👥 Recipients</h4>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(chainState.recipientBalances).map(([recipient, balance]) => (
            <div key={recipient} className={`flex items-center space-x-2 p-2 ${colors.innerBackground} rounded-lg`}>
              <div className="text-lg">{getRecipientEmoji(recipient)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-200 truncate">{recipient}</div>
                <div className="text-xs font-semibold text-gray-200">
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BalanceDisplay
