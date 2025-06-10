import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import Navigation from '../components/Navigation'
import UnderConstructionBanner from '../components/UnderConstructionBanner'

const Apps2Page: React.FC = () => {
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
          
          {/* Apps2 Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-8">Apps (But Now With Tokens)</h1>

            <UnderConstructionBanner />

            <p className="text-gray-300 leading-relaxed mb-6">
              With stablecoins, we can now send dollars and transact in more familar ways.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              We've already covered how smart contracts can let us write different types of apps to handle payments, split bills, share fees, etc.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What happens when we combine them?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Here, we'll cover more varied app types like:
            </p>

            <ol>
              <li>Earning Yield: how to earn interest on your dollars, similar to a high-yield savings account</li>
              <li>New Payment Methods: how we can support creators with new ways of paying</li>
              <li>Trading Markets: how to use stablecoins to buy ETH and vice versa</li>
            </ol>

          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8">Earning Yield</h2>

            <p className="text-gray-300 leading-relaxed mb-6">
              As mentioned earlier, stablecoin companies will hold some of money in US Treasuries. This allows them to earn interest on their deposits and then pass those earnings back on to you. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Thus, there are apps that let you deposit your stablecoins to earn interest, around 4-6% APR. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              You get the benefits of a savings account, and the convenience of being able to send your money around quickly 24/7.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Another benefit is that interest on Ethereum is paid out <em>every block</em>, rather than needing to wait every month or every day. 
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

export default Apps2Page
