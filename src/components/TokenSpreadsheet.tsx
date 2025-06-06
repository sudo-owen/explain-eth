import React, { useState, useEffect } from 'react'
import { getRecipientEmoji, getRecipientAddress } from '../utils/recipients'
import { formatETHTruncated } from '../utils/transactions'

interface TokenData {
  name: string
  emoji: string
  address: string
  ethBalance: number
  usdcBalance: number
}

interface TokenSpreadsheetProps {
  mode?: 'static' | 'transfer-animation'
  showTokens?: 'both' | 'ETH' | 'USDC'
  caption?: string
}

interface FloatingBadge {
  id: string
  amount: number
  userIndex: number
  isVisible: boolean
  isFadingIn: boolean
}

const TokenSpreadsheet: React.FC<TokenSpreadsheetProps> = ({
  mode = 'static',
  showTokens = 'both',
  caption
}) => {
  const [activeTab, setActiveTab] = useState<'ETH' | 'USDC'>(showTokens === 'USDC' ? 'USDC' : 'ETH')

  // Animation state
  const [highlightedUser, setHighlightedUser] = useState<string | null>(null)
  const [animatedBalances, setAnimatedBalances] = useState<{[key: string]: number}>({})
  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([])
  const [animationCycle, setAnimationCycle] = useState(0)
  const [highlightedBalance, setHighlightedBalance] = useState<{user: string, type: 'increase' | 'decrease'} | null>(null)

  // Animation effect for transfer mode
  useEffect(() => {
    if (mode !== 'transfer-animation') return

    const runTransferAnimation = () => {
      // Reset state
      setHighlightedUser(null)
      setAnimatedBalances({})
      setFloatingBadges([])
      setHighlightedBalance(null)

      const aliceIndex = userData.findIndex(u => u.name === 'Alice')
      const bobIndex = userData.findIndex(u => u.name === 'Bob')

      // Step 1: Highlight Alice (sender) - 1s
      setTimeout(() => {
        setHighlightedUser('Alice')
      }, 500)

      // Step 2: Highlight Bob (receiver), stop highlighting Alice - 1s
      setTimeout(() => {
        setHighlightedUser('Bob')
      }, 1500)

      // Step 3: Show [-10] badge on Alice's balance with fade in - 0.5s
      setTimeout(() => {
        setHighlightedUser(null)
        setHighlightedBalance({ user: 'Alice', type: 'decrease' })
        setFloatingBadges([
          { id: 'alice-badge', amount: -10, userIndex: aliceIndex, isVisible: false, isFadingIn: true }
        ])

        // Fade in the badge
        setTimeout(() => {
          setFloatingBadges(prev => prev.map(badge => ({ ...badge, isVisible: true, isFadingIn: false })))
        }, 50)
      }, 2500)

      // Step 4: Alice's balance decreases, fade out badge - 0.5s
      setTimeout(() => {
        setAnimatedBalances({ 'Alice': 40 }) // 50 - 10

        // Start fade out
        setFloatingBadges(prev => prev.map(badge => ({ ...badge, isVisible: false })))

        // Remove badge after fade
        setTimeout(() => {
          setFloatingBadges([])
          setHighlightedBalance(null)
        }, 300)
      }, 3000)

      // Step 5: Show [+10] badge on Bob's balance with fade in - 0.5s
      setTimeout(() => {
        setHighlightedBalance({ user: 'Bob', type: 'increase' })
        setFloatingBadges([
          { id: 'bob-badge', amount: +10, userIndex: bobIndex, isVisible: false, isFadingIn: true }
        ])

        // Fade in the badge
        setTimeout(() => {
          setFloatingBadges(prev => prev.map(badge => ({ ...badge, isVisible: true, isFadingIn: false })))
        }, 50)
      }, 3500)

      // Step 6: Bob's balance increases, fade out badge - 0.5s
      setTimeout(() => {
        setAnimatedBalances(prev => ({ ...prev, 'Bob': 285.50 })) // 275.50 + 10

        // Start fade out
        setFloatingBadges(prev => prev.map(badge => ({ ...badge, isVisible: false })))

        // Remove badge after fade
        setTimeout(() => {
          setFloatingBadges([])
          setHighlightedBalance(null)
        }, 300)
      }, 4000)

      // Step 7: Reset and loop - 2s pause
      setTimeout(() => {
        setAnimationCycle(prev => prev + 1)
      }, 6000)
    }

    runTransferAnimation()
  }, [animationCycle, mode])

  // User data with random balances for demonstration
  const userData: TokenData[] = [
    {
      name: 'You',
      emoji: '👤',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      ethBalance: 2,
      usdcBalance: 100
    },
    {
      name: 'Alice',
      emoji: getRecipientEmoji('Alice'),
      address: getRecipientAddress('Alice'),
      ethBalance: 0.3,
      usdcBalance: 50
    },
    {
      name: 'Bob',
      emoji: getRecipientEmoji('Bob'),
      address: getRecipientAddress('Bob'),
      ethBalance: 1.2,
      usdcBalance: 25.50
    },
    {
      name: 'Carol',
      emoji: getRecipientEmoji('Carol'),
      address: getRecipientAddress('Carol'),
      ethBalance: 0.8,
      usdcBalance: 69.42
    }
  ]

  const formatETHBalance = (balance: number) => {
    return {
      value: formatETHTruncated(balance).slice(0, -4),
      ticker: 'ETH'
    }
  }

  const formatUSDCBalance = (balance: number) => {
    return {
      value: balance.toFixed(2),
      ticker: 'USDC'
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getCurrentBalance = (user: TokenData) => {
    // Use animated balance if available
    if (mode === 'transfer-animation' && animatedBalances[user.name] !== undefined) {
      return activeTab === 'ETH' ? user.ethBalance : animatedBalances[user.name]
    }
    return activeTab === 'ETH' ? user.ethBalance : user.usdcBalance
  }

  const formatCurrentBalance = (user: TokenData) => {
    const balance = getCurrentBalance(user)
    return activeTab === 'ETH' ? formatETHBalance(balance) : formatUSDCBalance(balance)
  }

  const renderBalance = (balanceData: { value: string; ticker: string }, isETH: boolean, user: TokenData) => {
    const tickerColor = isETH ? 'text-blue-300' : 'text-green-400'
    const isBalanceHighlighted = highlightedBalance?.user === user.name
    const balanceHighlightColor = highlightedBalance?.type === 'increase' ? 'text-green-400' : 'text-red-400'

    return (
      <span className="text-sm">
        <span className={`font-bold transition-colors duration-300 ${
          isBalanceHighlighted ? balanceHighlightColor : 'text-gray-300'
        }`}>
          {balanceData.value}
        </span>
        <span className={`ml-1 font-medium ${tickerColor}`}>{balanceData.ticker}</span>
      </span>
    )
  }

  return (
    <div className="space-y-6">

      {/* Mobile Tabs */}
      {showTokens === 'both' && (
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
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden relative">
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
          <div className="overflow-x-auto"
            style={floatingBadges.length > 0 ? { overflowX: 'hidden' } : {}}
          >
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
                {userData.map((user, index) => {
                  const isHighlighted = highlightedUser === user.name
                  const floatingBadge = floatingBadges.find(badge => badge.userIndex === index)

                  return (
                    <tr
                      key={user.address}
                      className={`
                        ${isHighlighted ? 'bg-blue-600/40' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                        ${!isHighlighted ? 'hover:bg-gray-700' : ''}
                        transition-all duration-300
                      `}
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
                      <td className="px-4 py-3 text-right border-b border-gray-700 relative">
                        {renderBalance(formatCurrentBalance(user), activeTab === 'ETH', user)}

                        {/* Floating Badge */}
                        {floatingBadge && (
                          <div
                            className={`
                              absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold z-10 pointer-events-none
                              ${floatingBadge.amount > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                              transition-all duration-300 ease-out
                              ${floatingBadge.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                            `}
                            style={{ transform: 'translate(25%, -25%)' }}
                          >
                            {floatingBadge.amount > 0 ? '+' : ''}{floatingBadge.amount}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Mobile Single Token Table (when not showing both) */}
      {showTokens !== 'both' && (
        <div className="md:hidden">
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden relative">
              <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <img
                    src={showTokens === 'ETH' ? '/img/eth.svg' : '/img/usdc.svg'}
                    alt={showTokens}
                    className="w-6 h-6"
                  />
                  <h3 className="text-lg font-semibold text-gray-100">{showTokens} Balances</h3>
                </div>
              </div>
              <div className="overflow-x-auto"
              >
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
                    {userData.map((user, index) => {
                      const isHighlighted = highlightedUser === user.name
                      const floatingBadge = floatingBadges.find(badge => badge.userIndex === index)

                      return (
                        <tr
                          key={user.address}
                          className={`
                            ${isHighlighted ? 'bg-blue-600/40' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                            ${!isHighlighted ? 'hover:bg-gray-700' : ''}
                            transition-all duration-300
                          `}
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
                          <td className="px-4 py-3 text-right border-b border-gray-700 relative">
                            {renderBalance(formatCurrentBalance(user), showTokens === 'ETH', user)}

                            {/* Floating Badge */}
                            {floatingBadge && (
                              <div
                                className={`
                                  absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold z-10 pointer-events-none
                                  ${floatingBadge.amount > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                                  transition-all duration-300 ease-out
                                  ${floatingBadge.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                                `}
                                style={{ transform: 'translate(25%, -25%)' }}
                              >
                                {floatingBadge.amount > 0 ? '+' : ''}{floatingBadge.amount}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      {/* Desktop Unified Table */}
      <div className="hidden md:block">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden relative">
          <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-gray-100 text-center">
              {showTokens === 'both' ? 'Token Balances' : `${showTokens} Balances`}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-gray-600">
                    Address
                  </th>
                  {(showTokens === 'both' || showTokens === 'ETH') && (
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <img src="/img/eth.svg" alt="ETH" className="w-5 h-5" />
                        <span>ETH Balance</span>
                      </div>
                    </th>
                  )}
                  {(showTokens === 'both' || showTokens === 'USDC') && (
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 border-b border-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <img src="/img/usdc.svg" alt="USDC" className="w-5 h-5" />
                        <span>USDC Balance</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => {
                  const isHighlighted = highlightedUser === user.name
                  const floatingBadge = floatingBadges.find(badge => badge.userIndex === index)

                  return (
                    <tr
                      key={user.address}
                      className={`
                        ${isHighlighted ? 'bg-blue-600/40' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                        ${!isHighlighted ? 'hover:bg-gray-700' : ''}
                        transition-all duration-300
                      `}
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
                      {(showTokens === 'both' || showTokens === 'ETH') && (
                        <td className="px-4 py-3 text-right border-b border-gray-700 relative">
                          {renderBalance(formatETHBalance(user.ethBalance), true, user)}
                        </td>
                      )}
                      {(showTokens === 'both' || showTokens === 'USDC') && (
                        <td className="px-4 py-3 text-right border-b border-gray-700 relative">
                          {renderBalance(formatCurrentBalance(user), false, user)}

                          {/* Floating Badge */}
                          {floatingBadge && (
                            <div
                              className={`
                                absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold z-10 pointer-events-none
                                ${floatingBadge.amount > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                                transition-all duration-300 ease-out
                                ${floatingBadge.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                              `}
                              style={{ transform: 'translate(25%, -25%)' }}
                            >
                              {floatingBadge.amount > 0 ? '+' : ''}{floatingBadge.amount}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="flex justify-center mt-6">
        <div className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded max-w-2xl">
          {caption || "Each token maintains its own table of who owns what. Your address can hold multiple types of tokens simultaneously because it has a row in every token's table."}
        </div>
      </div>
    </div>
  )
}

export default TokenSpreadsheet
