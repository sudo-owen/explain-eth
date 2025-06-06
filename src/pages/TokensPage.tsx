import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import Navigation from '../components/Navigation'
import TokenFlowAnimation from '../components/TokenFlowAnimation'
import StablecoinShowcase from '../components/StablecoinShowcase'
import VolatilityComparison from '../components/VolatilityComparison'
import TokenSpreadsheet from '../components/TokenSpreadsheet'

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
              Your account can hold many types of <strong>tokens</strong>. What is a token?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              A token is a currency that can be sent on a blockchain network. You can receive all types of tokens with the same <code className="bg-gray-800 px-2 py-1 rounded text-sm break-all">0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</code> address.
            </p>

            <div className="my-8">
              <TokenFlowAnimation />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              What other tokens are there?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              All of our examples so far have used ETH. But on the Ethereum network, there are many, many different types of tokens. One important category of tokens are called <strong>stablecoins</strong>.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              <strong>Stablecoins</strong> are tokens whose value is tied to a currency. Like I mentioned earlier, these include tokens which track the US Dollar (and we'll focus on them). But there are also ones that track other real world currencies like the Euro and even other assets like gold or silver!
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Two popular USD stablecoins are <strong>USDC (US Dollar Coin)</strong> and <strong>USDT (US Dollar Tether)</strong>.
            </p>

            <div className="my-8">
              <StablecoinShowcase />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Unlike ETH, which has a fluctuating price depending on market conditions, these USD stablecoins are always tracking the US Dollar. So 1 USDC or 1 USDT will always be redeemable for $1. This makes it great for payments, splitting bills, or merchants.
            </p>

            {/* VOLATILITY COMPARISON */}
            <div className="my-8">
              <VolatilityComparison />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              How do stablecoins work?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Under the hood, a company manages a stablecoin. These companies will put money into bank accounts, bonds, or short-dated USD treasuries. Then, for each $1 that they put in, they will <strong>mint</strong> 1 USD token on Ethereum.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does <strong>minting</strong> mean?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              A physical mint will create new physical coins. In a similar way, a digital mint will create new digital tokens.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does that look like? And how does your address hold all of these tokens?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              One way to think about what's happening is that the Ethereum network contains a super big spreadsheet. And this spreadsheet has tables for every token, with a column for address and balance.
            </p>

            <div className="my-8">
              <TokenSpreadsheet />
            </div>

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
