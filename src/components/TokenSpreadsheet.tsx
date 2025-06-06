import React, { useState } from 'react'
import { getRecipientEmoji, getRecipientAddress } from '../utils/recipients'

interface TokenData {
  name: string
  emoji: string
  address: string
  ethBalance: number
  usdcBalance: number
}

const TokenSpreadsheet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ETH' | 'USDC'>('ETH')

  // User data with random balances for demonstration
  const userData: TokenData[] = [
    {
      name: 'You',
      emoji: '👤',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      ethBalance: Math.random() * 4.9 + 0.1,
      usdcBalance: Math.random() * 4900 + 100
    },
    {
      name: 'Alice',
      emoji: getRecipientEmoji('Alice'),
      address: getRecipientAddress('Alice'),
      ethBalance: Math.random() * 4.9 + 0.1,
      usdcBalance: Math.random() * 4900 + 100
    },
    {
      name: 'Bob',
      emoji: getRecipientEmoji('Bob'),
      address: getRecipientAddress('Bob'),
      ethBalance: Math.random() * 4.9 + 0.1,
      usdcBalance: Math.random() * 4900 + 100
    },
    {
      name: 'Carol',
      emoji: getRecipientEmoji('Carol'),
      address: getRecipientAddress('Carol'),
      ethBalance: Math.random() * 4.9 + 0.1,
      usdcBalance: Math.random() * 4900 + 100
    }
  ]

  const formatETHBalance = (balance: number) => {
    return `${balance.toFixed(4)} ETH`
  }

  const formatUSDCBalance = (balance: number) => {
    return `${balance.toFixed(2)} USDC`
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getCurrentBalance = (user: TokenData) => {
    return activeTab === 'ETH' ? user.ethBalance : user.usdcBalance
  }

  const formatCurrentBalance = (user: TokenData) => {
    const balance = getCurrentBalance(user)
    return activeTab === 'ETH' ? formatETHBalance(balance) : formatUSDCBalance(balance)
  }

  return (
    <div className="space-y-6">

      {/* Mobile Tabs */}
      <div className="md:hidden">
        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('ETH')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'ETH'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <img src="/img/eth.svg" alt="ETH" className="w-5 h-5" />
            <span>ETH</span>
          </button>
          <button
            onClick={() => setActiveTab('USDC')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'USDC'
                ? 'text-green-400 border-b-2 border-green-400 bg-green-900/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <img src="/img/usdc.svg" alt="USDC" className="w-5 h-5" />
            <span>USDC</span>
          </button>
        </div>

        {/* Mobile Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <img
                src={activeTab === 'ETH' ? '/img/eth.svg' : '/img/usdc.svg'}
                alt={activeTab}
                className="w-6 h-6"
              />
              <h3 className="text-lg font-semibold text-gray-100">{activeTab} Balances</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-gray-600">
                    Address
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => (
                  <tr
                    key={user.address}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors`}
                  >
                    <td className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{user.emoji}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-200">{user.name}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {truncateAddress(user.address)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right border-b border-gray-700">
                      <span className="text-sm font-medium text-green-400">
                        {formatCurrentBalance(user)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Desktop Unified Table */}
      <div className="hidden md:block">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-gray-100 text-center">Token Balances</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-gray-600">
                    Address
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <img src="/img/eth.svg" alt="ETH" className="w-5 h-5" />
                      <span>ETH Balance</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <img src="/img/usdc.svg" alt="USDC" className="w-5 h-5" />
                      <span>USDC Balance</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => (
                  <tr
                    key={user.address}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors`}
                  >
                    <td className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{user.emoji}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-200">{user.name}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {truncateAddress(user.address)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right border-b border-gray-700">
                      <span className="text-sm font-medium text-green-400">
                        {formatETHBalance(user.ethBalance)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right border-b border-gray-700">
                      <span className="text-sm font-medium text-green-400">
                        {formatUSDCBalance(user.usdcBalance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="flex justify-center mt-6">
        <div className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded max-w-2xl">
          Each token maintains its own ledger of who owns what. Your address can hold multiple types of tokens simultaneously.
        </div>
      </div>
    </div>
  )
}

export default TokenSpreadsheet
