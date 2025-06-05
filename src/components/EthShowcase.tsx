import React from 'react'

const EthShowcase: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* ETH Logo with pulse animation */}
      <div className="mb-6">
        <img
          src="/img/eth.svg"
          alt="Ethereum Logo"
          className="w-20 h-20 animate-pulse"
          style={{
            animation: 'ethPulse 2s ease-in-out infinite'
          }}
        />
      </div>

      {/* ETH Ticker */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">ETH</div>
        <div className="text-lg text-gray-400">Ethereum's Native Currency</div>
      </div>

      {/* Inline CSS for the animation */}
      <style>{`
        @keyframes ethPulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default EthShowcase
