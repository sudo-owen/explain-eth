import React from 'react'

const StablecoinShowcase: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-8">
      {/* USDC Column */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* USDC Logo with pulse animation */}
        <div className="mb-6">
          <img
            src="/img/usdc.svg"
            alt="USDC Logo"
            className="w-20 h-20"
            style={{
              animation: 'usdcPulse 2.5s ease-in-out infinite'
            }}
          />
        </div>

        {/* USDC Ticker */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">USDC</div>
          <div className="text-lg text-gray-400">US Dollar Coin</div>
        </div>
      </div>

      {/* USDT Column */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* USDT Logo with pulse animation */}
        <div className="mb-6">
          <img
            src="/img/usdt.svg"
            alt="USDT Logo"
            className="w-20 h-20"
            style={{
              animation: 'usdtPulse 2.8s ease-in-out infinite'
            }}
          />
        </div>

        {/* USDT Ticker */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">USDT</div>
          <div className="text-lg text-gray-400">US Dollar Tether</div>
        </div>
      </div>

      {/* Inline CSS for the animations */}
      <style>{`
        @keyframes usdcPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes usdtPulse {
          0% { opacity: 1; transform: scale(1); }
          40% { opacity: 0.7; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default StablecoinShowcase
