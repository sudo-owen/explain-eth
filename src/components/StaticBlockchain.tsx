import React, { useState, useEffect } from 'react'

// Static Blockchain Component
const StaticBlockchain: React.FC = () => {
  const [pulseIndex, setPulseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 4)
    }, 1500) // Pulse every 1.5 seconds

    return () => clearInterval(interval)
  }, [])

  // Simplified mobile data - only 3 blocks with 1-2 transactions each
  const mobileBlockData = [
    {
      blockNumber: 1,
      transactions: [
        { from: 'Alice', to: 'Bob', amount: 0.05 }
      ]
    },
    {
      blockNumber: 2,
      transactions: [
        { from: 'Bob', to: 'Carol', amount: 0.02 }
      ]
    },
    {
      blockNumber: 3,
      transactions: [
        { from: 'Carol', to: 'Alice', amount: 0.01 },
      ]
    }
  ]

  // Mock transaction data for each block
  const blockData = [
    {
      blockNumber: 1,
      transactions: [
        { from: 'Alice', to: 'Bob', amount: 0.05 },
        { from: 'Carol', to: 'Alice', amount: 0.02 },
        { from: 'Bob', to: 'Carol', amount: 0.01 }
      ]
    },
    {
      blockNumber: 2,
      transactions: [
        { from: 'Bob', to: 'Alice', amount: 0.03 },
        { from: 'Alice', to: 'Carol', amount: 0.01 }
      ]
    },
    {
      blockNumber: 3,
      transactions: [
        { from: 'Carol', to: 'Bob', amount: 0.04 },
        { from: 'Alice', to: 'Bob', amount: 0.02 },
        { from: 'Bob', to: 'Carol', amount: 0.01 }
      ]
    },
    {
      blockNumber: 4,
      transactions: [
        { from: 'Bob', to: 'Alice', amount: 0.06 },
        { from: 'Carol', to: 'Alice', amount: 0.01 }
      ]
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center space-x-4">
        {blockData.map((block, index) => (
          <React.Fragment key={block.blockNumber}>
            {/* Block */}
            <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 w-48 h-66 flex flex-col transition-all duration-500 hover:border-gray-600 ${
              pulseIndex === index ? 'ring-2 ring-blue-400 ring-opacity-75 shadow-lg shadow-blue-400/25 scale-105' : ''
            }`}>
              <div className="flex items-center justify-center mb-3 space-x-2">
                <h4 className="font-semibold text-gray-100">
                  Block #{block.blockNumber}
                </h4>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {block.transactions.map((tx, txIndex) => (
                  <div key={txIndex} className="bg-gray-700 rounded p-2 text-xs">
                    <div className="text-gray-300 truncate">
                      <span className="text-blue-400">{tx.from}</span>
                      <span className="text-gray-500 mx-1">→</span>
                      <span className="text-purple-400">{tx.to}</span>
                    </div>
                    <div className="text-green-400 font-medium">
                      {tx.amount.toFixed(4)} ETH
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chain Connector - Vertically Centered */}
            {index < blockData.length - 1 && (
              <div className="flex items-center h-66">
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className="w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Layout - Simplified with 3 blocks */}
      <div className="md:hidden">
        <div className="flex justify-center space-x-2 px-2">
          {mobileBlockData.map((block, index) => (
            <React.Fragment key={block.blockNumber}>
              {/* Block */}
              <div className={`bg-gray-800 border border-gray-700 rounded-lg p-2 w-24 h-32 flex flex-col transition-all duration-500 ${
                pulseIndex === index ? 'ring-2 ring-blue-400 ring-opacity-75 shadow-lg shadow-blue-400/25 scale-105' : ''
              }`}>
                <div className="flex items-center justify-center mb-1 space-x-1">
                  <h3 className="text-xs font-semibold text-gray-100">
                    Block #{block.blockNumber}
                  </h3>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  {block.transactions.map((tx, txIndex) => (
                    <div key={txIndex} className="bg-gray-700 rounded p-1 text-xs">
                      <div className="text-gray-300 text-xs leading-tight">
                        <div className="text-blue-400 truncate">{tx.from}</div>
                        <div className="text-gray-500 text-center">↓</div>
                        <div className="text-purple-400 truncate">{tx.to}</div>
                      </div>
                      <div className="text-green-400 font-medium text-xs text-center mt-0.5">
                        {tx.amount.toFixed(2)} ETH
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chain Connector for Mobile - Vertically Centered */}
              {index < mobileBlockData.length - 1 && (
                <div className="flex items-center justify-center w-4 h-32">
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                  <div className="w-0 h-0 border-l-1 border-l-gray-600 border-t-0.5 border-t-transparent border-b-0.5 border-b-transparent"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaticBlockchain
