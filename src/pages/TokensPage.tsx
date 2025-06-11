import React, { useState } from 'react'
import { useBlockchainContext } from '../contexts/BlockchainContext'
import TransactionModal from '../components/TransactionModal'
import TransactionHistoryOverlay from '../components/TransactionHistoryOverlay'
import Navigation from '../components/Navigation'
import TokenFlowAnimation from '../components/TokenFlowAnimation'
import StablecoinShowcase from '../components/StablecoinShowcase'
import VolatilityComparison from '../components/VolatilityComparison'
import TokenSpreadsheet from '../components/TokenSpreadsheet'
import MintBurnAnimation from '../components/MintBurnAnimation'
import Vocab from '../components/Vocab'

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
              What is a <Vocab>token</Vocab>?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              A <Vocab>token</Vocab> is a currency that can be sent on a blockchain network.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              You can receive all types of tokens with the same <code className="bg-gray-800 px-2 py-1 rounded text-sm break-all">0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</code> address. There's no need to use a new account for each token type.
            </p>

            <div className="my-8">
              <TokenFlowAnimation />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              All of our examples so far have used ETH. But on the Ethereum network, there are many, many different types of tokens. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What other tokens are there?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              One important category of tokens are called <Vocab>stablecoins</Vocab>. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              <Vocab>Stablecoins</Vocab> are tokens whose value is tied to a currency. Like I mentioned earlier, these include tokens which track the US Dollar (and we'll focus on them). But there are also ones that track other real world currencies like the Euro and even other assets like gold or silver!
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Two popular USD stablecoins are <Vocab>USDC</Vocab> (US Dollar Coin, made by <a href="https://www.circle.com/" target="_blank" rel="noopener noreferrer">Circle</a>) and <Vocab>USDT</Vocab> (US Dollar Tether, made by <a href="https://tether.to/" target="_blank" rel="noopener noreferrer">Tether</a>).
            </p>

            <div className="my-8">
              <StablecoinShowcase />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Unlike ETH, which has a fluctuating price depending on market conditions, these USD stablecoins are always tracking the US Dollar. So 1 USDC or 1 USDT will always be redeemable for $1. This makes it great for payments, merchants, and finance.
            </p>

            {/* VOLATILITY COMPARISON */}
            <div className="my-8">
              <VolatilityComparison />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              How do stablecoins work?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Under the hood, a company manages a stablecoin. These companies will put money into insured bank accounts or short-dated US treasuries. Then, for each $1 that they put in, they will <Vocab>mint</Vocab> 1 USD token on Ethereum.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does <Vocab>minting</Vocab> mean?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              A physical mint will create new physical coins. In a similar way, a digital mint will create new digital tokens.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What does that look like?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Where do the tokens "live"?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              And how do our accounts keep track of everything?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              It's time for another example!
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Imagine the Ethereum network contains a <i>super</i> big spreadsheet.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              This spreadsheet has tables for every token <i>and</i> every account ever created. For each token, there is a column for address and balance. This way, we can keep track of everyone's balances for every token.
            </p>

            <div className="my-8">
              <TokenSpreadsheet />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              This spreadsheet model helps us think about what it really means when we "send" a token to another address (whether it's a person or a smart contract). 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              A "send" means updating the balance in the spreadsheet. The sender's balance goes down, and the receiver's balance goes up.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              So if Alice sends Bob 10 USDC, we can think of the Ethereum network updating the spreadsheet cells for Alice and Bob's accounts.
            </p>

            {/* TRANSFER ANIMATION */}
            <TokenSpreadsheet
              mode="transfer-animation"
              showTokens="USDC"
              caption="When Alice sends 10 USDC to Bob, their balances in the spreadsheet are updated."
            />

            <p className="text-gray-300 leading-relaxed mb-6">
              So when a stablecoin company <Vocab>mints</Vocab> tokens, they are sending a digital message to the Ethereum network to update the big spreadsheet so that their balance increases. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              We can send tokens around on the Ethereum network.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              But how do we actually get them "out" if we want to spend them somewhere else?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              If at any point you want to cash out, you can send the stablecoins in your wallet to one of these stablecoin companies, and they'll wire US Dollars back into your bank account. Many other fintech companies like Stripe or PayPal also support something similar. Under the hood, these companies will <Vocab>burn</Vocab> the tokens, and they'll transfer you the dollars. 
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              As you may have guessed, <Vocab>burning</Vocab> is the opposite of minting. Instead of adding to someone's balance, we are now subtracting.
            </p>

            {/* BANK MINT VS BURN */}
            <div className="my-8">
              <MintBurnAnimation />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Okay so now we know we know about stablecoins and smart contracts.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Together, we can build new types of apps!
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What do they look like?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              What kinds of cooler stuff can we build?
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Let's do a deeper dive into smart contracts, now with tokens...
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
