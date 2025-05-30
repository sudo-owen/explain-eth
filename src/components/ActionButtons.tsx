import React, { useState } from 'react'
import { ChainState, Recipient } from '../types/blockchain'
import { getAvailableNFTs } from '../utils/transactions'
import { ColorTheme } from './ChainColumn'

interface ActionButtonsProps {
  chainState: ChainState
  onSendMoney: (recipient: Recipient, amount: number) => void
  onPurchaseNFT: (nftId: string, price: number, emoji: string) => void
  onSellNFT: (nftId: string) => void
  onDepositSavings: (amount: number) => void
  theme: ColorTheme
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  chainState,
  onSendMoney,
  onPurchaseNFT,
  onSellNFT,
  onDepositSavings,
  theme
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient>('Bob')

  const availableNFTs = getAvailableNFTs()
  const recipients: Recipient[] = ['Bob', 'Carol', 'Eve']

  const getThemeColors = () => {
    if (theme === 'rollup') {
      return {
        primary: 'bg-purple-600 hover:bg-purple-700',
        secondary: 'bg-indigo-600 hover:bg-indigo-700',
        success: 'bg-violet-600 hover:bg-violet-700',
        warning: 'bg-amber-600 hover:bg-amber-700',
        background: 'bg-purple-950/30 border-purple-800/50',
        innerBackground: 'bg-purple-900/20',
        inputBackground: 'bg-purple-800/30 border-purple-600/50'
      }
    }
    return {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-purple-600 hover:bg-purple-700',
      success: 'bg-green-600 hover:bg-green-700',
      warning: 'bg-orange-600 hover:bg-orange-700',
      background: 'bg-gray-800 border-gray-700',
      innerBackground: 'bg-gray-700',
      inputBackground: 'bg-gray-600 border-gray-500'
    }
  }

  const colors = getThemeColors()

  const handlePurchaseNFT = (nft: { id: string; name: string; price: number; emoji: string }) => {
    onPurchaseNFT(nft.name, nft.price, nft.emoji)
  }

  const handleQuickDeposit = (amount: number) => {
    onDepositSavings(amount)
  }

  const handleQuickSend = (amount: number) => {
    onSendMoney(selectedRecipient, amount)
  }

  const handleSendMoney = () => {
    const amountNum = parseFloat(amount)
    if (amountNum > 0) {
      onSendMoney(selectedRecipient, amountNum)
      setAmount('')
      setActiveAction(null)
    }
  }

  const handleSellNFT = (nftId: string) => {
    onSellNFT(nftId)
  }

  const handleDepositSavings = () => {
    const amountNum = parseFloat(amount)
    if (amountNum > 0) {
      onDepositSavings(amountNum)
      setAmount('')
      setActiveAction(null)
    }
  }

  return (
    <div className={`${colors.background} rounded-lg p-4 border`}>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Actions</h3>

      {/* Compact Action Buttons Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setActiveAction(activeAction === 'send' ? null : 'send')}
          className={`p-2 ${colors.primary} text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-1`}
        >
          <span>💸</span>
          <span>Send</span>
        </button>

        <button
          onClick={() => setActiveAction(activeAction === 'purchase' ? null : 'purchase')}
          className={`p-2 ${colors.secondary} text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-1`}
        >
          <span>🎨</span>
          <span>Buy NFT</span>
        </button>

        {chainState.nfts.length > 0 && (
          <button
            onClick={() => setActiveAction(activeAction === 'sell' ? null : 'sell')}
            className={`p-2 ${colors.warning} text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-1`}
          >
            <span>💰</span>
            <span>Sell NFT</span>
          </button>
        )}

        <button
          onClick={() => setActiveAction(activeAction === 'savings' ? null : 'savings')}
          className={`p-2 ${colors.success} text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-1`}
        >
          <span>🏦</span>
          <span>Save</span>
        </button>
      </div>
      {/* Action Forms */}
      <div className="min-h-[200px]">
        {/* Send Money Form */}
        {activeAction === 'send' && (
          <div className={`p-4 ${colors.innerBackground} rounded-lg space-y-3 mb-4`}>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Recipient</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value as Recipient)}
                className={`w-full p-2 ${colors.inputBackground} text-white rounded border`}
              >
                {recipients.map(recipient => (
                  <option key={recipient} value={recipient}>{recipient}</option>
                ))}
              </select>
            </div>

            {/* Quick Send Buttons */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Quick Send</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => handleQuickSend(1)}
                  disabled={chainState.balance < 1}
                  className={`p-2 ${colors.primary} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm`}
                >
                  💵 $1
                </button>
                <button
                  onClick={() => handleQuickSend(5)}
                  disabled={chainState.balance < 5}
                  className={`p-2 ${colors.primary} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm`}
                >
                  💰 $5
                </button>
                <button
                  onClick={() => handleQuickSend(10)}
                  disabled={chainState.balance < 10}
                  className={`p-2 ${colors.primary} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm`}
                >
                  💎 $10
                </button>
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Custom Amount ($)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`flex-1 p-2 ${colors.inputBackground} text-white rounded border`}
                />
                <button
                  onClick={handleSendMoney}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className={`px-4 py-2 ${colors.success} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors`}
                >
                  💸 Send
                </button>
              </div>
            </div>
          </div>
        )}

      {/* NFT Gallery */}
      {activeAction === 'purchase' && (
        <div className={`p-4 ${colors.innerBackground} rounded-lg mb-4`}>
          <h4 className="text-sm font-medium text-gray-300 mb-3">🎨 Art Gallery - Click to Purchase</h4>
          <div className="grid grid-cols-4 gap-3">
            {availableNFTs.map(nft => (
              <button
                key={nft.id}
                onClick={() => handlePurchaseNFT(nft)}
                disabled={chainState.balance < nft.price}
                className={`
                  p-3 rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                  ${chainState.balance >= nft.price
                    ? `${colors.secondary} border-transparent hover:border-white/30`
                    : 'bg-gray-600 border-gray-500'
                  }
                `}
                title={`${nft.name} - $${nft.price}`}
              >
                <div className="text-2xl mb-1">{nft.emoji}</div>
                <div className="text-xs text-white font-medium">${nft.price}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sell NFT */}
      {activeAction === 'sell' && chainState.nfts.length > 0 && (
        <div className={`p-4 ${colors.innerBackground} rounded-lg mb-4`}>
          <h4 className="text-sm font-medium text-gray-300 mb-3">💰 Your NFT Collection - Click to Sell</h4>
          <div className="space-y-2">
            {chainState.nfts.map(nft => (
              <div key={nft.id} className={`flex justify-between items-center p-3 ${colors.inputBackground} rounded border`}>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{nft.emoji}</div>
                  <div>
                    <div className="text-sm text-gray-200 font-medium">{nft.name}</div>
                    <div className="text-xs text-gray-400">
                      Bought for ${nft.purchasePrice}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSellNFT(nft.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  💰 Sell
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deposit Savings */}
      {activeAction === 'savings' && (
        <div className={`p-4 ${colors.innerBackground} rounded-lg mb-4`}>
          <h4 className="text-sm font-medium text-gray-300 mb-3">🏦 Savings Deposit (10% per minute)</h4>

          {/* Quick Deposit Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => handleQuickDeposit(1)}
              disabled={chainState.balance < 1}
              className={`p-2 ${colors.success} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm`}
            >
              💵 $1
            </button>
            <button
              onClick={() => handleQuickDeposit(10)}
              disabled={chainState.balance < 10}
              className={`p-2 ${colors.success} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm`}
            >
              💰 $10
            </button>
            <button
              onClick={() => handleQuickDeposit(50)}
              disabled={chainState.balance < 50}
              className={`p-2 ${colors.success} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm`}
            >
              💎 $50
            </button>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Custom Amount ($)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`flex-1 p-2 ${colors.inputBackground} text-white rounded border`}
              />
              <button
                onClick={handleDepositSavings}
                disabled={!amount || parseFloat(amount) <= 0}
                className={`px-4 py-2 ${colors.success} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors`}
              >
                🏦 Deposit
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default ActionButtons
