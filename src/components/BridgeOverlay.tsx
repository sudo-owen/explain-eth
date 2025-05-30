import React, { useState } from 'react'
import { ChainState } from '../types/blockchain'
import { formatETH } from '../utils/transactions'

interface BridgeOverlayProps {
  ethereumState: ChainState
  rollupState: ChainState
  onBridge: (amount: number) => void
  isOpen: boolean
  onToggle: () => void
}

const BridgeOverlay: React.FC<BridgeOverlayProps> = ({
  ethereumState,
  rollupState,
  onBridge,
  isOpen,
  onToggle
}) => {
  const [amount, setAmount] = useState('')

  const handleQuickBridge = (bridgeAmount: number) => {
    onBridge(bridgeAmount)
  }

  const handleBridge = () => {
    const amountNum = parseFloat(amount)
    if (amountNum > 0) {
      onBridge(amountNum)
      setAmount('')
    }
  }

  return (
    <>
      {/* Bridge Panel */}
      <div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">🌉 Bridge to Rollup</h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Bridge Info */}
        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-300 mb-4">
            Bridge your ETH from Ethereum Mainnet to the Rollup for faster and cheaper transactions.
          </div>

          {/* Balance Display */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Ethereum Mainnet</div>
              <div className="text-lg font-semibold text-blue-400">
                {formatETH(ethereumState.balance)}
              </div>
            </div>
            <div className="p-3 bg-purple-900/20 border border-purple-600/30 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Rollup</div>
              <div className="text-lg font-semibold text-purple-400">
                {formatETH(rollupState.balance)}
              </div>
            </div>
          </div>

          {/* Bridge Arrow */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="text-blue-400">Ethereum</div>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="text-purple-400">Rollup</div>
            </div>
          </div>

          {/* Quick Bridge Buttons */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Quick Bridge</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => handleQuickBridge(0.1)}
                disabled={ethereumState.balance < 0.1}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm cursor-pointer"
              >
                💎 0.1 ETH
              </button>
              <button
                onClick={() => handleQuickBridge(0.5)}
                disabled={ethereumState.balance < 0.5}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm cursor-pointer"
              >
                💰 0.5 ETH
              </button>
              <button
                onClick={() => handleQuickBridge(ethereumState.balance * 0.5)}
                disabled={ethereumState.balance <= 0}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm cursor-pointer"
              >
                🌟 Half
              </button>
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Custom Amount (ETH)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000"
                min="0"
                step="0.001"
                className="flex-1 p-2 bg-gray-600 border-gray-500 text-white rounded border"
              />
              <button
                onClick={handleBridge}
                disabled={!amount || parseFloat(amount) <= 0}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors cursor-pointer"
              >
                🌉 Bridge
              </button>
            </div>
          </div>

          {/* Bridge Benefits */}
          <div className="mt-4 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
            <div className="text-sm font-medium text-green-400 mb-2">Rollup Benefits:</div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• 10x lower fees (0.0001-0.0002 ETH)</li>
              <li>• 30x faster confirmations (400ms)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default BridgeOverlay
