import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TableOfContentsOverlay from './TableOfContentsOverlay'

interface NavigationProps {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams<{ lang: string }>()
  const [isTocOpen, setIsTocOpen] = useState(false)
  const { t } = useTranslation()

  const currentLang = lang || 'en'
  
  const pages = [
    { path: `/${currentLang}/intro`, title: t('nav.intro'), label: t('nav.intro') },
    { path: `/${currentLang}/apps`, title: t('nav.apps'), label: t('nav.apps') },
    { path: `/${currentLang}/tokens`, title: t('nav.tokens'), label: t('nav.tokens') },
    { path: `/${currentLang}/apps2`, title: t('nav.apps') + ' 2', label: t('nav.apps') + ' 2' }
  ]


  const currentPageIndex = pages.findIndex(page => page.path === location.pathname)
  const currentPage = currentPageIndex !== -1 ? currentPageIndex : 0

  const canGoBack = currentPage > 0
  const canGoForward = currentPage < pages.length - 1

  // Scroll to top whenever the location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

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

  const handleTocToggle = () => {
    setIsTocOpen(!isTocOpen)
  }

  return (
    <div className={`mt-16 pt-8 pb-24 border-t border-gray-700 ${className}`}>
      {/* Mobile: Page Indicator on top row */}
      <div className="flex justify-center items-center mb-4 md:hidden">
        <button
          onClick={handleTocToggle}
          className="flex items-center space-x-4 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-700/50"
          aria-label="Open table of contents"
        >
          <span className="text-gray-400 text-sm">
            {currentPage + 1} of {pages.length}
          </span>
          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-300 text-sm font-medium">
            {pages[currentPage]?.title || 'Unknown'}
          </span>
        </button>
      </div>

      {/* Navigation buttons row */}
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

        {/* Desktop: Page Indicator in center */}
        <button
          onClick={handleTocToggle}
          className="hidden md:flex items-center space-x-4 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-700/50"
          aria-label="Open table of contents"
        >
          <span className="text-gray-400 text-sm">
            {currentPage + 1} of {pages.length}
          </span>
          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-300 text-sm font-bold">
            {pages[currentPage]?.title || 'Unknown'}
          </span>
        </button>

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

      {/* GitHub link */}
      <div className="flex justify-center mt-6">
        <a
          href="https://github.com/sudo-owen/explain-eth"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer bg-gray-700 hover:bg-gray-600"
          aria-label="View source on GitHub"
        >
          <img
            src="/img/github.svg"
            alt="GitHub"
            className="w-5 h-5 filter invert"
          />
        </a>
      </div>

      {/* Table of Contents Overlay */}
      <TableOfContentsOverlay
        pages={pages}
        isOpen={isTocOpen}
        onToggle={handleTocToggle}
      />
    </div>
  )
}

export default Navigation
