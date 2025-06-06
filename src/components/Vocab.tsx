import React from 'react'

interface VocabProps {
  children: React.ReactNode
}

const Vocab: React.FC<VocabProps> = ({ children }) => {
  return (
    <span className="bg-blue-700 text-gray-200 px-1 py-0.25 rounded font-bold">
      {children}
    </span>
  )
}

export default Vocab
