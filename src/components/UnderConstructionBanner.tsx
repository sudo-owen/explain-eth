import React from 'react'

interface UnderConstructionBannerProps {
  className?: string
}

const UnderConstructionBanner: React.FC<UnderConstructionBannerProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`
      bg-yellow-700 
      text-gray-200
      px-6 
      py-4 
      rounded-lg 
      border-2 
      border-yellow-500 
      shadow-lg 
      font-semibold 
      text-lg 
      mb-8
      ${className}
    `}>
      <div className="flex justify-center text-2xl font-bold">
        <h1>⚠️ Under Construction ⚠️</h1>
      </div>
      <div>
        <p className="flex justify-center text-gray-300">
          Writing takes time! This section is still in development.
        </p>
      </div>
    </div>
  )
}

export default UnderConstructionBanner
