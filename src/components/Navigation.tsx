import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavigationProps {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const pages = [
    { path: '/intro', title: 'Intro', label: 'Introduction' },
    { path: '/apps', title: 'Apps', label: 'Apps' },
    { path: '/tokens', title: 'Tokens', label: 'Tokens' }
  ]

  const currentPageIndex = pages.findIndex(page => page.path === location.pathname)
  const currentPage = currentPageIndex !== -1 ? currentPageIndex : 0

  const canGoBack = currentPage > 0
  const canGoForward = currentPage < pages.length - 1

  const handleBack = () => {
    if (canGoBack) {
      navigate(pages[currentPage - 1].path)
    }
  }

  const handleForward = () => {
    if (canGoForward) {
      navigate(pages[currentPage + 1].path)
    }
  }

  const previousPage = canGoBack ? pages[currentPage - 1] : null
  const nextPage = canGoForward ? pages[currentPage + 1] : null

  return (
    <div className={`mt-16 pt-8 border-t border-gray-700 ${className}`}>
      <div className="flex justify-between items-center">
        {/* Back Button */}
        {canGoBack ? (
          <button
            onClick={handleBack}
            className="px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600 text-white"
          >
            ← {previousPage?.title}
          </button>
        ) : (
          <div className="px-4 py-2"></div> // Empty space to maintain layout
        )}

        {/* Page Indicator */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">
            {currentPage + 1} of {pages.length}
          </span>
          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentPage ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-300 text-sm font-medium">
            {pages[currentPage]?.title || 'Unknown'}
          </span>
        </div>

        {/* Forward Button */}
        {canGoForward ? (
          <button
            onClick={handleForward}
            className="px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600 text-white"
          >
            {nextPage?.title} →
          </button>
        ) : (
          <div className="px-4 py-2"></div> // Empty space to maintain layout
        )}
      </div>
    </div>
  )
}

export default Navigation
