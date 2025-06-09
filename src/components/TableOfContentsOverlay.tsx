import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface Page {
  path: string
  title: string
  label: string
}

interface TableOfContentsOverlayProps {
  pages: Page[]
  isOpen: boolean
  onToggle: () => void
}

const TableOfContentsOverlay: React.FC<TableOfContentsOverlayProps> = ({
  pages,
  isOpen,
  onToggle
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handlePageClick = (path: string) => {
    navigate(path)
    onToggle() // Close overlay after navigation
  }

  return (
    <>
      {/* Invisible backdrop to catch clicks */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onToggle}
        />
      )}

      {/* Table of Contents Panel */}
      <div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Table of Contents</h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
            aria-label="Close table of contents"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Page List */}
        <div className="p-4 space-y-2">
          {pages.map((page, index) => {
            const isCurrent = page.path === location.pathname

            return (
              <button
                key={page.path}
                onClick={() => handlePageClick(page.path)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${isCurrent
                    ? 'bg-blue-900/30 border border-blue-500/50 text-blue-400'
                    : 'bg-gray-700/30 border border-gray-600/50 text-gray-200 hover:bg-gray-700/50'
                  }
                `}
              >
                {index+1}. {page.title}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TableOfContentsOverlay
