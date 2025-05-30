import React from 'react'
import { ChainState, Transaction, Recipient } from '../types/blockchain'
import BalanceDisplay from './BalanceDisplay'
import ActionButtons from './ActionButtons'
import TransactionHistory from './TransactionHistory'

export type ColorTheme = 'ethereum' | 'rollup'

interface ChainColumnProps {
  title: string
  chainState: ChainState
  onSendMoney: (recipient: Recipient, amount: number) => void
  onPurchaseNFT: (nftId: string, price: number, emoji: string) => void
  onSellNFT: (nftId: string) => void
  onDepositSavings: (amount: number) => void
  transactionHistory: Transaction[]
  theme: ColorTheme
  className?: string
}

const ChainColumn: React.FC<ChainColumnProps> = ({
  title,
  chainState,
  onSendMoney,
  onPurchaseNFT,
  onSellNFT,
  onDepositSavings,
  transactionHistory,
  theme,
  className = ''
}) => {
  return (
    <div className={`flex flex-col p-6 ${className}`}>
      {/* Chain Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Network Active</span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 space-y-6">
        {/* Balance Display */}
        <BalanceDisplay chainState={chainState} title={title} theme={theme} />

        {/* Action Buttons */}
        <ActionButtons
          chainState={chainState}
          onSendMoney={onSendMoney}
          onPurchaseNFT={onPurchaseNFT}
          onSellNFT={onSellNFT}
          onDepositSavings={onDepositSavings}
          theme={theme}
        />

        {/* Transaction History */}
        <TransactionHistory transactions={transactionHistory} title={title} theme={theme} />
      </div>
    </div>
  )
}

export default ChainColumn
