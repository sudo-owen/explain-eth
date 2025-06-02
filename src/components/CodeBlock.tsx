import React from 'react'

// IDE-like Code Block Component
interface CodeBlockProps {
  title: string
  code: string
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, className = '' }) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* IDE Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-300 text-sm font-medium ml-4">{title}</div>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm">
        <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {code.split('\n').map((line, index) => {
            // Simple syntax highlighting for our pseudocode
            let highlightedLine = line

            // Highlight keywords
            highlightedLine = highlightedLine.replace(
              /(WHENEVER|THIS PROGRAM|RECEIVES|ETH|SEND|OF THE TOTAL|TO|END)/g,
              '<span class="text-blue-400 font-semibold">$1</span>'
            )

            // Highlight program name
            highlightedLine = highlightedLine.replace(
              /(PAYMENT SPLITTER PROGRAM)/g,
              '<span class="text-pink-400 font-bold">$1</span>'
            )

            // Highlight fractions
            highlightedLine = highlightedLine.replace(
              /(1\/3)/g,
              '<span class="text-green-400">$1</span>'
            )

            // Highlight addresses (0x...)
            highlightedLine = highlightedLine.replace(
              /(0x[a-fA-F0-9]+)/g,
              '<span class="text-purple-400 break-all">$1</span>'
            )

            // Highlight names in parentheses
            highlightedLine = highlightedLine.replace(
              /\((ALICE|BOB|CAROL)\)/g,
              '(<span class="text-yellow-400">$1</span>)'
            )

            return (
              <div key={index} className="flex">
                <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock
