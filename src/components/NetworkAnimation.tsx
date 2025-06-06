import React, { useState, useEffect } from 'react'
import { getRecipientEmoji } from '../utils/recipients'

interface Node {
  id: string
  emoji: string
  name: string
  x: number
  y: number
  connections: string[]
}

interface AnimatedPath {
  from: string
  to: string
  progress: number
  active: boolean
}

const NetworkAnimation: React.FC = () => {
  const [animatedPaths, setAnimatedPaths] = useState<AnimatedPath[]>([])
  const [currentPathIndex, setCurrentPathIndex] = useState(0)

  // Define network nodes with emojis and positions
  const nodes: Node[] = [
    { id: 'user', emoji: '👤', name: 'You', x: 50, y: 50, connections: ['alice', 'bob'] },
    { id: 'alice', emoji: getRecipientEmoji('Alice'), name: 'Alice', x: 150, y: 30, connections: ['user', 'bob', 'carol'] },
    { id: 'bob', emoji: getRecipientEmoji('Bob'), name: 'Bob', x: 250, y: 70, connections: ['user', 'alice', 'carol', 'dave'] },
    { id: 'carol', emoji: getRecipientEmoji('Carol'), name: 'Carol', x: 180, y: 120, connections: ['alice', 'bob', 'eve'] },
    { id: 'dave', emoji: '👨‍🦱', name: 'Dave', x: 320, y: 40, connections: ['bob', 'eve'] },
    { id: 'eve', emoji: getRecipientEmoji('Eve'), name: 'Eve', x: 280, y: 130, connections: ['carol', 'dave'] }
  ]

  // Predefined paths to animate
  const pathSequences = [
    ['user', 'alice', 'carol'],
    ['user', 'bob', 'dave'],
    ['alice', 'bob', 'carol', 'eve'],
    ['user', 'alice', 'bob', 'dave'],
    ['carol', 'alice', 'user'],
    ['eve', 'carol', 'alice', 'user']
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      // Clear previous paths
      setAnimatedPaths([])
      
      // Start new path sequence
      const currentSequence = pathSequences[currentPathIndex]
      const newPaths: AnimatedPath[] = []
      
      for (let i = 0; i < currentSequence.length - 1; i++) {
        newPaths.push({
          from: currentSequence[i],
          to: currentSequence[i + 1],
          progress: 0,
          active: false
        })
      }
      
      setAnimatedPaths(newPaths)
      setCurrentPathIndex((prev) => (prev + 1) % pathSequences.length)
    }, 2500) // New path every 2.5 seconds

    return () => clearInterval(interval)
  }, [currentPathIndex])

  useEffect(() => {
    if (animatedPaths.length === 0) return

    let pathIndex = 0
    const animateNextPath = () => {
      if (pathIndex >= animatedPaths.length) return

      // Activate current path
      setAnimatedPaths(prev => prev.map((path, index) => 
        index === pathIndex ? { ...path, active: true } : path
      ))

      let progress = 0
      const animationInterval = setInterval(() => {
        progress += 0.05 // 5% per frame
        
        setAnimatedPaths(prev => prev.map((path, index) => 
          index === pathIndex ? { ...path, progress: Math.min(progress, 1) } : path
        ))

        if (progress >= 1) {
          clearInterval(animationInterval)
          pathIndex++
          setTimeout(animateNextPath, 300) // Small delay between path segments
        }
      }, 50) // 20 FPS
    }

    setTimeout(animateNextPath, 500) // Initial delay
  }, [animatedPaths.length])

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  const renderConnection = (from: string, to: string) => {
    const fromPos = getNodePosition(from)
    const toPos = getNodePosition(to)
    
    return (
      <line
        key={`${from}-${to}`}
        x1={fromPos.x}
        y1={fromPos.y}
        x2={toPos.x}
        y2={toPos.y}
        stroke="#374151"
        strokeWidth="2"
        opacity="0.3"
      />
    )
  }

  const renderAnimatedPath = (path: AnimatedPath) => {
    if (!path.active) return null

    const fromPos = getNodePosition(path.from)
    const toPos = getNodePosition(path.to)
    
    const currentX = fromPos.x + (toPos.x - fromPos.x) * path.progress
    const currentY = fromPos.y + (toPos.y - fromPos.y) * path.progress

    return (
      <g key={`${path.from}-${path.to}-animated`}>
        {/* Animated line */}
        <line
          x1={fromPos.x}
          y1={fromPos.y}
          x2={currentX}
          y2={currentY}
          stroke="#3b82f6"
          strokeWidth="3"
          opacity="0.8"
        />
        {/* Moving dot */}
        <circle
          cx={currentX}
          cy={currentY}
          r="4"
          fill="#60a5fa"
          opacity="0.9"
        >
          <animate
            attributeName="r"
            values="4;6;4"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    )
  }

  // Get all unique connections for static lines
  const allConnections = new Set<string>()
  nodes.forEach(node => {
    node.connections.forEach(connId => {
      const connectionKey = [node.id, connId].sort().join('-')
      allConnections.add(connectionKey)
    })
  })

  return (
    <div className="my-12 flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <svg
          viewBox="0 0 370 180"
          className="w-full h-auto"
          style={{ maxHeight: '320px' }}
        >
          {/* Static connection lines */}
          {Array.from(allConnections).map(connection => {
            const [from, to] = connection.split('-')
            return renderConnection(from, to)
          })}
          
          {/* Animated paths */}
          {animatedPaths.map(renderAnimatedPath)}
          
          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill="#1f2937"
                stroke="#4b5563"
                strokeWidth="2"
              />
              {/* Emoji */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fontSize="20"
                className="select-none"
              >
                {node.emoji}
              </text>
              {/* Name label */}
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                fontSize="12"
                fill="#9ca3af"
                className="select-none"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="text-gray-400 text-sm mt-4 text-center max-w-md">
        A network showing connected participants. Messages can travel between any two people through various paths.
      </p>
    </div>
  )
}

export default NetworkAnimation
