import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import Navigation from '../components/Navigation'

const TokensPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const {
    ethereumState,
    rollupState,
    transactionHistory,
    modalState,
    currentPendingTransaction,
    closeModal
  } = useBlockchainContext()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Tokens Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Tokens</h1>

            <p className="text-gray-300 leading-relaxed mb-6">
              This section is coming soon! Here we'll explore how digital tokens work on Ethereum, including:
            </p>

            <ul className="text-gray-300 leading-relaxed mb-6 list-disc list-inside">
              <li>What are tokens and how do they differ from ETH?</li>
              <li>How digital dollars (like USDC) work on Ethereum</li>
              <li>Different types of tokens (fungible vs non-fungible)</li>
              <li>How tokens are created and managed</li>
              <li>Real-world use cases for tokens</li>
            </ul>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold text-white mb-4">🚧 Under Construction</h3>
              <p className="text-gray-300 mb-4">
                This section is currently being developed. In the meantime, you can:
              </p>
              <ul className="text-gray-300 list-disc list-inside space-y-2">
                <li>Go back to review the Apps section</li>
                <li>Visit the Playground to experiment with the interactive features</li>
                <li>Check back soon for more content!</li>
              </ul>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              For now, you've learned about the basics of Ethereum accounts, sending ETH, and smart contracts. These are the fundamental building blocks that make everything else possible!
            </p>

          </section>

        </article>

        {/* Navigation */}
        <Navigation />

      </div>

      {/* Transaction Modal */}
      {modalState.isOpen && (
        <TransactionModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          message={modalState.message}
          onClose={closeModal}
          pendingTransaction={currentPendingTransaction}
        />
      )}

      {/* Transaction History Overlay */}
      <TransactionHistoryOverlay
        ethereumTransactions={transactionHistory.filter(tx => tx.chain === 'ethereum')}
        rollupTransactions={transactionHistory.filter(tx => tx.chain === 'rollup')}
        ethereumPendingCount={ethereumState.pendingTransactions}
        rollupPendingCount={rollupState.pendingTransactions}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        hideRollupTab={true}
      />
    </div>
  )
}

export default TokensPage
