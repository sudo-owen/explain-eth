import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to intro page
    navigate('/intro')
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-300">Taking you to the introduction</p>
      </div>
    </div>
  )
}

export default HomePage
