import React, { useState, useEffect } from 'react'

const VolatilityComparison: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0)
  const [ethProgress, setEthProgress] = useState(0)
  const [stablecoinProgress, setStablecoinProgress] = useState(0)

  // ETH price trajectory - volatile with peaks and valleys
  const ethTrajectory = [
    { x: 0, y: 50 },    // Start at middle
    { x: 10, y: 45 },   // Small dip
    { x: 20, y: 65 },   // Sharp rise
    { x: 30, y: 40 },   // Big drop
    { x: 40, y: 75 },   // Major peak
    { x: 50, y: 35 },   // Crash
    { x: 60, y: 55 },   // Recovery
    { x: 70, y: 80 },   // New high
    { x: 80, y: 60 },   // Pullback
    { x: 90, y: 70 },   // Rise
    { x: 100, y: 50 }   // End at middle
  ]

  // Stablecoin trajectory - very stable with minor fluctuations
  const stablecoinTrajectory = [
    { x: 0, y: 50 },    // Start at $1
    { x: 10, y: 51 },   // Tiny rise
    { x: 20, y: 49 },   // Tiny dip
    { x: 30, y: 50.5 }, // Back to stable
    { x: 40, y: 49.5 }, // Minor dip
    { x: 50, y: 50 },   // Perfect $1
    { x: 60, y: 50.2 }, // Tiny rise
    { x: 70, y: 49.8 }, // Tiny dip
    { x: 80, y: 50.1 }, // Almost perfect
    { x: 90, y: 49.9 }, // Almost perfect
    { x: 100, y: 50 }   // End at $1
  ]

  const createPath = (trajectory: { x: number; y: number }[], progress: number) => {
    if (progress === 0) return ''
    
    const totalPoints = trajectory.length
    const currentIndex = Math.floor((progress / 100) * (totalPoints - 1))
    const nextIndex = Math.min(currentIndex + 1, totalPoints - 1)
    const localProgress = ((progress / 100) * (totalPoints - 1)) % 1

    // Get points up to current position
    const visiblePoints = trajectory.slice(0, currentIndex + 1)
    
    // Interpolate current position if between points
    if (currentIndex < totalPoints - 1 && localProgress > 0) {
      const current = trajectory[currentIndex]
      const next = trajectory[nextIndex]
      const interpolatedPoint = {
        x: current.x + (next.x - current.x) * localProgress,
        y: current.y + (next.y - current.y) * localProgress
      }
      visiblePoints.push(interpolatedPoint)
    }

    // Create SVG path
    if (visiblePoints.length === 0) return ''
    
    let path = `M ${visiblePoints[0].x * 2} ${100 - visiblePoints[0].y}`
    for (let i = 1; i < visiblePoints.length; i++) {
      path += ` L ${visiblePoints[i].x * 2} ${100 - visiblePoints[i].y}`
    }
    
    return path
  }

  useEffect(() => {
    const duration = 8000 // 8 seconds for full animation
    const interval = 50 // Update every 50ms
    
    const timer = setInterval(() => {
      setEthProgress(prev => {
        if (prev >= 100) {
          // Reset and start new cycle
          setTimeout(() => {
            setAnimationKey(k => k + 1)
            setEthProgress(0)
            setStablecoinProgress(0)
          }, 1000) // 1 second pause before restart
          return 100
        }
        return prev + (100 / (duration / interval))
      })
      
      setStablecoinProgress(prev => {
        if (prev >= 100) return 100
        return prev + (100 / (duration / interval))
      })
    }, interval)

    return () => clearInterval(timer)
  }, [animationKey])

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Price Comparison
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ETH Column */}
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <img
              src="/img/eth.svg"
              alt="ETH Logo"
              className="w-12 h-12 mr-3"
            />
            <div>
              <div className="text-xl font-bold text-white">ETH</div>
              <div className="text-sm text-gray-400">Volatile Asset</div>
            </div>
          </div>
          
          {/* ETH Chart */}
          <div className="w-full h-32 bg-gray-700 rounded-lg p-4 relative overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 100"
              className="absolute inset-0"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="ethGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="100" fill="url(#ethGrid)" />
              
              {/* Price line */}
              <path
                d={createPath(ethTrajectory, ethProgress)}
                fill="none"
                stroke="#627EEA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Price labels */}
            <div className="absolute top-1 left-1 text-xs text-gray-400">$4000</div>
            <div className="absolute bottom-1 left-1 text-xs text-gray-400">$1000</div>
            <div className="absolute top-1/2 left-1 text-xs text-gray-400 transform -translate-y-1/2">$2500</div>
          </div>
          
          <div className="text-center mt-2">
            <div className="text-sm text-blue-300 font-medium">High Volatility</div>
            <div className="text-xs text-gray-500">Price swings</div>
          </div>
        </div>

        {/* Stablecoin Column */}
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <div className="flex -space-x-2 mr-3">
              <img
                src="/img/usdc.svg"
                alt="USDC Logo"
                className="w-12 h-12 border-2 border-gray-800 rounded-full"
              />
              <img
                src="/img/usdt.svg"
                alt="USDT Logo"
                className="w-12 h-12 border-2 border-gray-800 rounded-full"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-white">USDC/USDT</div>
              <div className="text-sm text-gray-400">Stable Assets</div>
            </div>
          </div>
          
          {/* Stablecoin Chart */}
          <div className="w-full h-32 bg-gray-700 rounded-lg p-4 relative overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 100"
              className="absolute inset-0"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="stableGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="100" fill="url(#stableGrid)" />
              
              {/* Price line */}
              <path
                d={createPath(stablecoinTrajectory, stablecoinProgress)}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Current price dot */}
              {stablecoinProgress > 0 && (
                <circle
                  cx={stablecoinProgress * 2}
                  cy={100 - (stablecoinTrajectory[Math.floor((stablecoinProgress / 100) * (stablecoinTrajectory.length - 1))]?.y || 50)}
                  r="3"
                  fill="#10B981"
                  className="animate-pulse"
                />
              )}
            </svg>
            
            {/* Price labels */}
            <div className="absolute top-1 left-1 text-xs text-gray-400">$1.01</div>
            <div className="absolute bottom-1 left-1 text-xs text-gray-400">$0.99</div>
            <div className="absolute top-1/2 left-1 text-xs text-gray-400 transform -translate-y-1/2">$1.00</div>
          </div>
          
          <div className="text-center mt-2">
            <div className="text-sm text-green-400 font-medium">Low Volatility</div>
            <div className="text-xs text-gray-500">Price stays ~$1.00</div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default VolatilityComparison
