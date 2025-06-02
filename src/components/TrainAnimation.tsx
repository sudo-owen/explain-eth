import React, { useState, useEffect } from 'react'

// Train Animation Component
const TrainAnimation: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState<'loading' | 'moving'>('loading')
  const [cycleCount, setCycleCount] = useState(0)
  const [visibleBoxes, setVisibleBoxes] = useState<number[]>([])
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const runCycle = () => {
      // Phase 1: Loading boxes (1.5 seconds total, staggered)
      setAnimationPhase('loading')
      setVisibleBoxes([])
      setIsMoving(false)

      // Show boxes one by one with 0.5 second delays
      setTimeout(() => setVisibleBoxes([0]), 200)
      setTimeout(() => setVisibleBoxes([0, 1]), 700)
      setTimeout(() => setVisibleBoxes([0, 1, 2]), 1200)

      setTimeout(() => {
        // Phase 2: Moving (4 seconds)
        setAnimationPhase('moving')
        
        // Use requestAnimationFrame to ensure the DOM is ready before triggering animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsMoving(true)
          })
        })

        setTimeout(() => {
          // Reset and start next cycle
          setCycleCount(prev => prev + 1)
          runCycle()
        }, 4000)
      }, 1500)
    }

    runCycle()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto my-12 pb-2 bg-gray-800 rounded-lg">
      <div className="relative h-32 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800 rounded-lg">
        {/* Track */}
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-600"></div>

        {/* Train Unit - moves as one piece */}
        <div
          className="absolute bottom-4 flex items-end space-x-2"
          style={{
            left: '20px',
            transform: isMoving ? 'translateX(calc(100vw + 100px))' : 'translateX(0px)',
            opacity: 1,
            transition: isMoving
              ? 'transform 4000ms ease-in'
              : 'opacity 500ms ease-in-out'
          }}
        >
          {/* Boxes */}
          {visibleBoxes.map((index) => (
            <div
              key={`${cycleCount}-${index}`}
              className="w-8 h-8 transition-all duration-500 ease-out"
              style={{
                opacity: 1,
                transform: 'translateY(-10px)',
                transitionDelay: `${index * 0.5}s`
              }}
            >
              <img
                src="/img/box.svg"
                alt="Package"
                className="w-full h-full"
                style={{ filter: 'brightness(1.2)' }}
              />
            </div>
          ))}

          {/* Train */}
          <div className="w-24 h-16">
            <img
              src="/img/train.svg"
              alt="Train"
              className="w-full h-full"
              style={{ filter: 'brightness(1.2)' }}
            />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-4 text-white text-sm font-bold">
          Train Station
        </div>
        <div className="absolute top-2 right-4 text-white text-sm font-bold">
          Next Stop
        </div>

      </div>
      
      {/* Status */}
      <div className="flex justify-center mt-4">
        <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
          {animationPhase === 'loading' && 'Loading packages onto train...'}
          {animationPhase === 'moving' && 'Train departing!'}
        </div>
      </div>
    </div>
  )
}

export default TrainAnimation
