import React from 'react'
import { ChainState } from '../types/blockchain'
import { ColorTheme } from './ChainColumn'

interface BalanceDisplayProps {
  chainState: ChainState
  title: string
  theme: ColorTheme
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ chainState, title, theme }) => {
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

      {/* Savings */}
      {chainState.savingsDeposit > 0 && (
        <div className={`mb-6 p-4 ${colors.innerBackground} rounded-lg`}>
          <div className="text-sm text-gray-300 mb-1">Savings Deposit</div>
          <div className={`text-xl font-semibold ${colors.savings}`}>
            {formatCurrency(chainState.savingsDeposit)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Earning 10% per minute
          </div>
        </div>
      )}

      {/* NFTs */}
      {chainState.nfts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-200 mb-3">🎨 NFT Collection</h4>
          <div className="grid grid-cols-2 gap-3">
            {chainState.nfts.map((nft) => (
              <div key={nft.id} className={`p-3 ${colors.innerBackground} rounded-lg text-center`}>
                <div className="text-3xl mb-2">{nft.emoji}</div>
                <div className="text-xs font-medium text-gray-200 mb-1">{nft.name}</div>
                <div className="text-xs text-gray-400">
                  {formatCurrency(nft.purchasePrice)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipient Balances */}
      <div>
        <h4 className="text-md font-medium text-gray-200 mb-3">Recipient Balances</h4>
        <div className="space-y-2">
          {Object.entries(chainState.recipientBalances).map(([recipient, balance]) => (
            <div key={recipient} className={`flex justify-between items-center p-2 ${colors.innerBackground} rounded`}>
              <span className="text-sm text-gray-300">{recipient}</span>
              <span className="text-sm font-medium text-gray-200">
                {formatCurrency(balance)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BalanceDisplay
